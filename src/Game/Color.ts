// When moving to c# this should be a struct
class Color {
  public r: number;
  public g: number;
  public b: number;
  // Constructor
  constructor(r: number, g: number, b: number) {
    // Set The Color
    this.r = r;
    this.g = g;
    this.b = b;
  }
}
// Default Export
export default Color;