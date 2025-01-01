export function calcCenter(GRID_SIZE, GRID_WIDTH, GRID_HEIGHT) {
  return {
    x: Math.floor((GRID_SIZE * GRID_WIDTH) / 2 / GRID_SIZE) * GRID_SIZE,
    y: Math.floor((GRID_SIZE * GRID_HEIGHT) / 2 / GRID_SIZE) * GRID_SIZE,
  };
}

export function getRandomPosition(
  snake,
  obstacleSprite,
  GRID_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT
) {
  let position;

  do {
    const x = Math.floor(Math.random() * GRID_WIDTH) * GRID_SIZE;
    const y = Math.floor(Math.random() * GRID_HEIGHT) * GRID_SIZE;
    position = { x, y };
  } while (
    snake.segments.some(
      (segment) => segment.x === position.x && segment.y === position.y
    ) ||
    (position.x === obstacleSprite.x && position.y === obstacleSprite.y)
  );

  return position;
}
