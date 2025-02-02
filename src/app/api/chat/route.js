export async function POST(request) {
  try {
    const { messages } = await request.json(); // Get user input from the request body

    // Validate the request body
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request body: messages array is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Ensure API Key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Google Gemini API key is missing" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prepare request payload
    const requestBody = JSON.stringify({
      contents: messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    // Call the Google Gemini API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        signal: controller.signal, // Attach timeout signal
      }
    );

    clearTimeout(timeout); // Clear timeout if request succeeds

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch response from Google Gemini API");
    }

    const data = await response.json();

    // Ensure response structure is valid
    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      throw new Error("Invalid API response format");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    // Return AI response
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error calling Google Gemini API:", error);

    // Handle timeout error
    if (error.name === "AbortError") {
      return new Response(
        JSON.stringify({
          error: "Request timed out. Please try again.",
        }),
        {
          status: 504,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle quota errors
    if (error.code === "RESOURCE_EXHAUSTED") {
      return new Response(
        JSON.stringify({
          error: "You have exceeded your Google Gemini API quota. Please check your billing details.",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while processing your request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
