export function displayGameOverMessage(message) {
  const gameOverContainer = document.getElementById("game-over-container");
  const gameOverMessage = document.getElementById("game-over-message");

  gameOverContainer.classList.remove("hidden");
  gameOverMessage.textContent = message;
}
