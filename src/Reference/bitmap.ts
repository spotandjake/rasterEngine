export class Bitmap {
  public width: number;
  public height: number;
  public pixels: Uint32Array;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = new Uint32Array(width * height);
  }
  public clear(color: number): void {
    for (let i = 0; i < this.pixels.length; ++i) {
      this.pixels[i] = color;
    }
  }
}
