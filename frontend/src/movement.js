import { Sprite } from "pixi.js";
export function onKeyDown(event, snake) {
  const key = event.key.toLowerCase();

  if (key === "arrowup" && snake.direction !== "down") {
    snake.nextDirection = "up";
  } else if (key === "arrowdown" && snake.direction !== "up") {
    snake.nextDirection = "down";
  } else if (key === "arrowleft" && snake.direction !== "right") {
    snake.nextDirection = "left";
  } else if (key === "arrowright" && snake.direction !== "left") {
    snake.nextDirection = "right";
  }
}

export function getDirection(from, to) {
  if (from.x < to.x) return "right";
  if (from.x > to.x) return "left";
  if (from.y < to.y) return "down";
  if (from.y > to.y) return "up";
}

export function getCornerSprite(prevDir, nextDir, textures) {
  if (prevDir === "up" && nextDir === "right")
    return new Sprite(textures.body.topright);
  if (prevDir === "right" && nextDir === "up")
    return new Sprite(textures.body.bottomleft);
  if (prevDir === "left" && nextDir === "up")
    return new Sprite(textures.body.bottomright);
  if (prevDir === "up" && nextDir === "left")
    return new Sprite(textures.body.topleft);
  if (prevDir === "right" && nextDir === "down")
    return new Sprite(textures.body.topleft);
  if (prevDir === "down" && nextDir === "right")
    return new Sprite(textures.body.bottomright);
  if (prevDir === "down" && nextDir === "left")
    return new Sprite(textures.body.bottomleft);
  if (prevDir === "left" && nextDir === "down")
    return new Sprite(textures.body.topright);
}
