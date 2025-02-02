import fs from 'fs';
import path from 'path';

const progressPath = path.join(process.cwd(), 'progress.json');

export async function POST(request) {
  try {
    const { userId, lessonId, score } = await request.json(); // Get progress data from the request body

    // Read the existing progress data
    let progress = [];
    if (fs.existsSync(progressPath)) {
      progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    }

    // Update or add the user's progress
    const userProgress = progress.find((p) => p.userId === userId);
    if (userProgress) {
      userProgress.lessons.push({ lessonId, score });
    } else {
      progress.push({ userId, lessons: [{ lessonId, score }] });
    }

    // Save the updated progress data
    fs.writeFileSync(progressPath, JSON.stringify(progress));

    return new Response(
      JSON.stringify({ message: 'Progress saved successfully' }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error saving progress:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while saving progress' }),
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

    // Read the progress data
    if (fs.existsSync(progressPath)) {
      const progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
      const userProgress = progress.find((p) => p.userId === userId);
      return new Response(JSON.stringify(userProgress || { userId, lessons: [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ userId, lessons: [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching progress:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching progress' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}