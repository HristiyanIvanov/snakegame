const leaderboardList = document.getElementById("leaderboard-list");

async function fetchLeaderboard() {
  try {
    const response = await fetch(`
      ${import.meta.env.VITE_BASE_API_URL}/api/leaderboard`);

    if (!response.ok) {
      throw new Error("Server not available");
    }

    const data = await response.json();

    if (data.length === 0) {
      const listItem = document.createElement("li");
      listItem.style.listStyle = "none";
      listItem.textContent = "Leaderboard is empty";
      leaderboardList.appendChild(listItem);
    } else {
      const topFive = data.sort((a, b) => b.score - a.score).slice(0, 5);
      topFive.forEach((entry) => {
        const listItem = document.createElement("li");
        listItem.style.listStyle = "none";
        listItem.textContent = `${entry.username}: ${entry.score}`;
        leaderboardList.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);

    const listItem = document.createElement("li");
    listItem.style.listStyle = "none";
    listItem.textContent =
      "Unable to load leaderboard. Please try again later.";
    leaderboardList.appendChild(listItem);
  }
}

fetchLeaderboard();
