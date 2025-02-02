import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config.json');

export async function POST(request) {
  try {
    const { code } = await request.json(); // Get user code from the request body

    // Read the API key from the config file
    if (!fs.existsSync(configPath)) {
      throw new Error('API key not configured');
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const apiKey = config.apiKey;

    // Call the Google Gemini API to evaluate the code
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: 'You are a Python tutor. Evaluate the following code and provide feedback:' }],
          },
          {
            role: 'user',
            parts: [{ text: code }],
          },
        ],
      }),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch response');
    }

    const data = await response.json();
    const aiFeedback = data.candidates[0].content.parts[0].text;

    // Return the AI's feedback
    return new Response(JSON.stringify({ feedback: aiFeedback }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calling Google Gemini API:', error);

    // Handle quota errors
    if (error.code === 'RESOURCE_EXHAUSTED') {
      return new Response(
        JSON.stringify({
          error: 'You have exceeded your Google Gemini API quota. Please check your billing details.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while processing your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}