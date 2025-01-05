import { Sprite } from "pixi.js";
import { gsap } from "gsap";
import { getDirection, getCornerSprite } from "./movement";
import { GRID_SIZE } from "./constans";

export function renderSnake(container, snake, textures) {
  container.removeChildren();

  snake.segments.forEach((segment, index) => {
    let sprite;
    segment.isCorner = false;
    segment.isBeforeCorner = false;
    segment.index = index;

    if (index === 0) {
      sprite = new Sprite(textures.head[snake.direction]);
    } else if (index === snake.segments.length - 1) {
      const tailDir = getDirection(
        snake.segments[index - 1],
        snake.segments[index]
      );
      sprite = new Sprite(textures.tail[tailDir]);
    } else {
      const prevDir = getDirection(
        snake.segments[index - 1],
        snake.segments[index]
      );
      const nextDir = getDirection(
        snake.segments[index],
        snake.segments[index + 1]
      );

      if (prevDir !== nextDir) {
        segment.isCorner = true;
        if (index > 1) {
          snake.segments[index - 1].isBeforeCorner = true;
        }
        sprite = getCornerSprite(prevDir, nextDir, textures);
      } else {
        sprite =
          prevDir === "left" || prevDir === "right"
            ? new Sprite(textures.body.horizontal)
            : new Sprite(textures.body.vertical);
      }
    }

    sprite.width = GRID_SIZE;
    sprite.height = GRID_SIZE;

    sprite.x = segment.x;
    sprite.y = segment.y;

    container.addChild(sprite);
  });
}

export function renderApple(appleSprite, apple) {
  appleSprite.width = GRID_SIZE;
  appleSprite.height = GRID_SIZE;

  gsap.to(appleSprite, {
    x: apple.x,
    y: apple.y,
    duration: 0.2,
    ease: "power2.out",
  });
}
