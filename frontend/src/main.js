import { Application, Container, Sprite } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { loadTextures } from "./textures";
import { renderSnake, renderApple } from "./render";
import { calcCenter, getRandomPosition } from "./utils";
import { gsap } from "gsap";
import { getCornerSprite, getDirection, onKeyDown } from "./movement";
import { moveSnake } from "./snake";

const GRID_SIZE = 32;
const GRID_WIDTH = 11;
const GRID_HEIGHT = 11;

(async () => {
  const app = new Application();
  await app.init({
    width: GRID_SIZE * GRID_WIDTH,
    height: GRID_SIZE * GRID_HEIGHT,
    backgroundColor: 0x00ff00,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.getElementById("snake-container").appendChild(app.canvas);
  initDevtools({ app });

  const landingScreen = document.getElementById("landing-screen");
  const gameScreen = document.getElementById("game-screen");
  const startButton = document.getElementById("start-game");
  const pauseButton = document.getElementById("pause-button");
  const resumeButton = document.getElementById("resume-button");
  const textures = await loadTextures();
  const snakeContainer = new Container();
  const appleSprite = new Sprite(textures.food.apple);
  const obstacleSprite = new Sprite(textures.obstacle.obstacleTexture);
  let isPaused = true;
  let username;

  startButton.addEventListener("click", () => {
    username = document.getElementById("username").value;

    if (!username) {
      alert("Username cannot be empty");
      return;
    }
    landingScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    isPaused = false;
    startGame();
  });

  const snake = {
    segments: [
      {
        x: calcCenter(GRID_SIZE, GRID_WIDTH, GRID_HEIGHT).x,
        y: calcCenter(GRID_SIZE, GRID_WIDTH, GRID_HEIGHT).y,
      },
      {
        x: calcCenter(GRID_SIZE, GRID_WIDTH, GRID_HEIGHT).x - GRID_SIZE,
        y: calcCenter(GRID_SIZE, GRID_WIDTH, GRID_HEIGHT).y,
      },
      {
        x: calcCenter(GRID_SIZE, GRID_WIDTH, GRID_HEIGHT).x - 2 * GRID_SIZE,
        y: calcCenter(GRID_SIZE, GRID_WIDTH, GRID_HEIGHT).y,
      },
    ],
    direction: "right",
    nextDirection: "right",
  };

  let apple = getRandomPosition(
    snake,
    obstacleSprite,
    GRID_SIZE,
    GRID_WIDTH,
    GRID_HEIGHT
  );

  function setApple(newApple) {
    apple = newApple;
  }

  renderApple(appleSprite, apple, GRID_SIZE);

  app.stage.addChild(snakeContainer);
  app.stage.addChild(appleSprite);

  renderSnake(
    snakeContainer,
    snake,
    textures,
    GRID_SIZE,
    getDirection,
    getCornerSprite
  );
  renderApple(appleSprite, apple, GRID_SIZE);

  window.addEventListener("keydown", (e) => onKeyDown(e, snake));

  function startGame() {
    if (isPaused) return;
    function animateSnake() {
      snake.direction = snake.nextDirection;

      moveSnake(
        snake,
        GRID_SIZE,
        GRID_WIDTH,
        GRID_HEIGHT,
        username,
        obstacleSprite,
        snakeContainer,
        textures,
        apple,
        setApple,
        appleSprite,
        app
      );

      gsap.timeline().to(snakeContainer.children, {
        duration: 0.2,
        x: (i) => snake.segments[i]?.x,
        y: (i) => snake.segments[i]?.y,
        ease: "linear",
        onComplete: () => {
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

      gsap.delayedCall(0.2, animateSnake);
    }

    animateSnake();
  }

  function pauseGame() {
    if (!isPaused) {
      isPaused = true;
    }
  }

  function resumeGame() {
    if (isPaused) {
      isPaused = false;
      startGame();
    }
  }

  pauseButton.addEventListener("click", pauseGame);
  resumeButton.addEventListener("click", resumeGame);

  startGame();
})();
