import { gsap } from "gsap";
import { saveToLeaderboard } from "./saveToLeaderboard";
import { getRandomPosition } from "./utils";
import { renderApple, renderSnake } from "./render";
import { displayGameOverMessage } from "./displayMessage";
import { GRID_SIZE, GRID_WIDTH, GRID_HEIGHT, SNAKE_SPEED } from "./constans";
import { getDirection } from "./movement";
let appleCount = 0;
let isLevelTwo = false;
let gameOver = false;

export function moveSnake(
  snake,
  username,
  obstacleSprite,
  snakeBodyContainer,
  textures,
  apple,
  setApple,
  appleSprite,
  snakeContainer
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
    displayGameOverMessage("Game Over! Snake hit the wall.");
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
    displayGameOverMessage("Game Over! Snake collided with itself.");
    if (!gameOver) {
      saveToLeaderboard(username, appleCount);
      gameOver = true;
    }
    return;
  }

  if (isLevelTwo && head.x === GRID_SIZE * 5 && head.y === GRID_SIZE * 5) {
    displayGameOverMessage("Game Over! Snake hit the obstacle.");
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
      transitionToLevelTwo(obstacleSprite, snakeContainer);
    }
  } else {
    snake.segments.pop();
  }

  snakeBodyContainer.children.forEach((child, i) => {
    const currentSegment = snake.segments[i];
    const nextSegment = snake.segments[i + 1];
    const previousSegment = snake.segments[i - 1];
    if (i > 0) {
      if (
        currentSegment?.isBeforeCorner ||
        currentSegment?.isCorner ||
        currentSegment?.index + 1 === snake.segments.length - 2
      ) {
        child.x = nextSegment?.x;
        child.y = nextSegment?.y;
      } else if (child.isDuplicate) {
        gsap.to(child, {
          duration: 0.1,
          x: previousSegment.x,
          y: previousSegment.y,
          alpha: 0,
          ease: "none",
        });
      }
    } else {
      gsap.to(child, {
        duration: SNAKE_SPEED,
        x: currentSegment.x,
        y: currentSegment.y,
        ease: "none",
        onComplete: () => {
          renderSnake(snakeBodyContainer, snake, textures);
        },
      });
    }
  });
}

async function transitionToLevelTwo(obstacleSprite, snakeContainer) {
  isLevelTwo = true;

  obstacleSprite.visible = true;
  obstacleSprite.width = 0;
  obstacleSprite.height = 0;
  obstacleSprite.x = GRID_SIZE * 5;
  obstacleSprite.y = GRID_SIZE * 5;

  if (!snakeContainer.children.includes(obstacleSprite)) {
    snakeContainer.addChild(obstacleSprite);
  }

  gsap.to(obstacleSprite, {
    width: GRID_SIZE,
    height: GRID_SIZE,
    duration: 0.5,
    ease: "power2.out",
  });
}
