export async function saveToLeaderboard(username, appleCount) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API_URL}/api/score`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, score: appleCount }),
    }
  );
  if (!response.ok) {
    console.error("Failed to save apple count");
  }
}
