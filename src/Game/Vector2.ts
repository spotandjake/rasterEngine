// Vector2 class
// When moving to c# this should be a struct
class Vector2 {
  public readonly x: number;
  public readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  } 
}
// Export Default
export default Vector2;