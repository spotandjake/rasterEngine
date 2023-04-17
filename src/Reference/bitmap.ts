export class Bitmap {
  public width: number;
  public height: number;
  public pixels: Uint32Array;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = new Uint32Array(width * height);
  }

  // Render bitmap image onto this bitmap with offset
  render(bitmap: Bitmap, ox: number, oy: number): void {
    for (let y = 0; y < bitmap.height; ++y) {
      let yy = oy + y;
      if (yy < 0 || yy >= this.height) continue;
      for (let x = 0; x < bitmap.width; ++x) {
        let xx = ox + x;
        if (xx < 0 || xx >= this.width) {
          continue;
        }
        const color = bitmap.pixels[x + y * bitmap.width];
        this.pixels[xx + yy * this.width] = color;
      }
    }
  }

  clear(color: number): void {
    for (let i = 0; i < this.pixels.length; ++i) {
      this.pixels[i] = color;
    }
  }
}
