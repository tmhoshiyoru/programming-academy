export type Ball = { x: number; y: number; vx: number; vy: number };

/** Split a snapshot of all live balls, retaining each original ball and its speed. */
export function splitBalls(balls: readonly Ball[]): Ball[] {
  return balls.flatMap(ball => [
    ball,
    ...[-Math.PI / 9, Math.PI / 9].map(angle => ({
      x: ball.x,
      y: ball.y,
      vx: ball.vx * Math.cos(angle) - ball.vy * Math.sin(angle),
      vy: ball.vx * Math.sin(angle) + ball.vy * Math.cos(angle),
    })),
  ]);
}
