import { gsap } from "gsap";
import { saveToLeaderboard } from "./saveToLeaderboard";
import { getRandomPosition } from "./utils";
import { renderApple, renderSnake } from "./render";
import { displayGameOverMessage } from "./displayMessage";
import { GRID_SIZE, GRID_WIDTH, GRID_HEIGHT, SNAKE_SPEED } from "./constans";
let appleCount = 0;
let isLevelTwo = false;
let gameOver = false;

export function moveSnake(
  snake,
  username,
  obstacleSprite,
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
    return;
  }

  if (isLevelTwo && head.x === GRID_SIZE * 5 && head.y === GRID_SIZE * 5) {
    displayGameOverMessage("Game Over! Snake hit the obstacle.", app);
    if (!gameOver) {
      saveToLeaderboard(username, appleCount);
      gameOver = true;
    }
    return;
  }

  snake.segments.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    const newApple = getRandomPosition(snake, obstacleSprite);

    setApple(newApple);
    renderApple(appleSprite, newApple);

    appleCount++;
    document.getElementById("score").textContent = "Score: " + appleCount;

    if (appleCount === 25 && !isLevelTwo) {
      transitionToLevelTwo(obstacleSprite, app);
    }
  } else {
    snake.segments.pop();
  }

  snakeContainer.children.forEach((child, i) => {
    gsap.to(child, {
      duration: SNAKE_SPEED,
      x: snake.segments[i].x,
      y: snake.segments[i].y,
      ease: "none",
      onUpdate: () => {
        child.x = gsap.getProperty(child, "x");
        child.y = gsap.getProperty(child, "y");
      },
      onComplete: () => {
        renderSnake(snakeContainer, snake, textures);
      },
    });
  });
}

async function transitionToLevelTwo(obstacleSprite, app) {
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
