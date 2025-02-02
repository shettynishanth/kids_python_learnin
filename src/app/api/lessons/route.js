export async function POST(request) {
  try {
    const { userId, character } = await request.json(); // Get userId and character from the request body

    // Validate the request body
    if (!userId || !character) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body: userId and character are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Save or update the user's preferences
    const stmt = db.prepare(`
      INSERT INTO preferences (userId, character)
      VALUES (?, ?)
      ON CONFLICT(userId) DO UPDATE SET character = ?;
    `);
    const result = stmt.run(userId, character, character);

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Preferences saved successfully', id: result.lastInsertRowid }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error saving preferences:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while saving preferences' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // Get userId from query parameters

    // Validate the userId
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch the user's preferences from the database
    const stmt = db.prepare(`
      SELECT character
      FROM preferences
      WHERE userId = ?;
    `);
    const preferences = stmt.get(userId);

    // Return the user's preferences
    return new Response(JSON.stringify({ userId, preferences }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching preferences' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
