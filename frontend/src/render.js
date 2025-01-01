import { Sprite } from "pixi.js";
import { gsap } from "gsap";

export function renderSnake(
  container,
  snake,
  textures,
  GRID_SIZE,
  getDirection,
  getCornerSprite
) {
  const existingSprites = container.children.reduce((map, child) => {
    map[`${child.x}-${child.y}`] = child;
    return map;
  }, {});

  container.removeChildren();

  snake.segments.forEach((segment, index) => {
    let sprite;

    if (existingSprites[`${segment.x}-${segment.y}`]) {
      sprite = existingSprites[`${segment.x}-${segment.y}`];
    } else {
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
    }

    gsap.to(sprite, {
      x: segment.x,
      y: segment.y,
      duration: 0.2,
      ease: "power2.out",
    });

    container.addChild(sprite);
  });

  if (snake.hasGrown) {
    const lastSegment = snake.segments[snake.segments.length - 1];
    const newTailSprite = new Sprite(textures.body.vertical);
    newTailSprite.width = GRID_SIZE;
    newTailSprite.height = GRID_SIZE;
    newTailSprite.x = lastSegment.x;
    newTailSprite.y = lastSegment.y;
    newTailSprite.alpha = 0;

    container.addChild(newTailSprite);

    gsap.to(newTailSprite, {
      alpha: 1,
      duration: 0.5,
      ease: "linear",
    });

    snake.hasGrown = false;
  }
}

export function renderApple(appleSprite, apple, GRID_SIZE) {
  appleSprite.width = GRID_SIZE;
  appleSprite.height = GRID_SIZE;

  gsap.to(appleSprite, {
    x: apple.x,
    y: apple.y,
    duration: 0.2,
    ease: "power2.out",
  });
}
