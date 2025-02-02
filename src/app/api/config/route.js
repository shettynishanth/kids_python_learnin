import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config.json');

export async function POST(request) {
  try {
    const { apiKey } = await request.json(); // Get API key from the request body

    // Validate the API key
    if (!apiKey || typeof apiKey !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Save the API key to a config file
    fs.writeFileSync(configPath, JSON.stringify({ apiKey }));

    return new Response(
      JSON.stringify({ message: 'API key saved successfully' }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error saving API key:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while saving the API key' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET() {
  try {
    // Read the API key from the config file
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return new Response(JSON.stringify({ apiKey: config.apiKey }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ apiKey: null }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error reading API key:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while reading the API key' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}