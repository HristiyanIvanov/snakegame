import { Assets } from "pixi.js";

export async function loadTextures() {
  return {
    head: {
      up: await Assets.load("./assets/head_up.png"),
      down: await Assets.load("./assets/head_down.png"),
      left: await Assets.load("./assets/head_left.png"),
      right: await Assets.load("./assets/head_right.png"),
    },
    body: {
      horizontal: await Assets.load("./assets/body_horizontal.png"),
      vertical: await Assets.load("./assets/body_vertical.png"),
      topleft: await Assets.load("./assets/body_bottomleft.png"),
      topright: await Assets.load("./assets/body_bottomright.png"),
      bottomleft: await Assets.load("./assets/body_topleft.png"),
      bottomright: await Assets.load("./assets/body_topright.png"),
    },
    tail: {
      up: await Assets.load("./assets/tail_up.png"),
      down: await Assets.load("./assets/tail_down.png"),
      left: await Assets.load("./assets/tail_left.png"),
      right: await Assets.load("./assets/tail_right.png"),
    },
    food: {
      apple: await Assets.load("./assets/apple.png"),
    },
    obstacle: {
      obstacleTexture: await Assets.load("./assets/obstacle.png"),
    },
  };
}
