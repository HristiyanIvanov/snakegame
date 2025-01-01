import { gsap } from "gsap";
import { saveToLeaderboard } from "./saveToLeaderboard";
import { getCornerSprite, getDirection } from "./movement";
import { getRandomPosition } from "./utils";
import { renderSnake, renderApple } from "./render";
import { displayGameOverMessage } from "./displayMessage";
let appleCount = 0;
let isLevelTwo = false;
let gameOver = false;

export function moveSnake(
  snake,
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT,
  username,
  obstacleSprite,
  gameInterval,
  snakeContainer,
  textures,
  apple,
  setApple,
  appleSprite,
  app
) {
  const head = { ...snake.segments[0] };

  if (snake.direction === "right") head.x += GRID_SIZE;
  else if (snake.direction === "left") head.x -= GRID_SIZE;
  else if (snake.direction === "up") head.y -= GRID_SIZE;
  else if (snake.direction === "down") head.y += GRID_SIZE;

  if (gameOver) return;

  if (
    head.x < 0 ||
    head.x >= GRID_SIZE * GRID_WIDTH ||
    head.y < 0 ||
    head.y >= GRID_SIZE * GRID_HEIGHT
  ) {
    displayGameOverMessage("Game Over! Snake hit the wall.", app);
    if (!gameOver) {
      saveToLeaderboard(username, appleCount);
      gameOver = true;
    }
    clearInterval(gameInterval);
    return;
  }

  if (
    snake.segments.some(
      (segment) => segment.x === head.x && segment.y === head.y
    )
  ) {
    displayGameOverMessage("Game Over! Snake collided with itself.", app);
    if (!gameOver) {
      saveToLeaderboard(username, appleCount);
      gameOver = true;
    }
    clearInterval(gameInterval);
    return;
  }

  if (isLevelTwo && head.x === GRID_SIZE * 5 && head.y === GRID_SIZE * 5) {
    displayGameOverMessage("Game Over! Snake hit the obstacle.", app);
    if (!gameOver) {
      saveToLeaderboard(username, appleCount);
      gameOver = true;
    }
    clearInterval(gameInterval);
    return;
  }

  snake.segments.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    const newApple = getRandomPosition(
      snake,
      obstacleSprite,
      GRID_SIZE,
      GRID_WIDTH,
      GRID_HEIGHT
    );

    setApple(newApple);
    renderApple(appleSprite, newApple, GRID_SIZE);

    appleCount++;
    document.getElementById("score").textContent = "Score: " + appleCount;

    if (appleCount === 2 && !isLevelTwo) {
      transitionToLevelTwo(GRID_SIZE, obstacleSprite, app);
    }
  } else {
    snake.segments.pop();
  }

  gsap.to(snakeContainer.children, {
    duration: 0.9,
    x: (i) => snake.segments[i]?.x,
    y: (i) => snake.segments[i]?.y,
    ease: "power1.inOut",
    onUpdate: () => {
      renderSnake(
        snakeContainer,
        snake,
        textures,
        GRID_SIZE,
        getDirection,
        getCornerSprite
      );
    },
  });
}

async function transitionToLevelTwo(GRID_SIZE, obstacleSprite, app) {
  isLevelTwo = true;

  obstacleSprite.visible = true;
  obstacleSprite.width = 0;
  obstacleSprite.height = 0;
  obstacleSprite.x = GRID_SIZE * 5;
  obstacleSprite.y = GRID_SIZE * 5;

  if (!app.stage.children.includes(obstacleSprite)) {
    app.stage.addChild(obstacleSprite);
  }
  gsap.to(obstacleSprite, {
    width: GRID_SIZE,
    height: GRID_SIZE,
    duration: 0.5,
    ease: "power1.inOut",
  });
}
