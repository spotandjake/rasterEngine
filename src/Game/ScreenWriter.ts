// This file contains all logic for drawing to the canvas.
class ScreenWriter {
  // Internals
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frameBuffer: ImageData = new ImageData(1, 1);
  protected width: number = 0;
  protected height: number = 0;
  // Constructor
  constructor(width: number, height: number) {
    // Create The Canvas
    this.canvas = document.createElement("canvas");
    // Get The Context
    this.ctx = this.canvas.getContext("2d")!;

    // Set The Size
    this.setSize(width, height);
    // Add The Canvas to The Screen
    document.querySelector<HTMLDivElement>("#app")!.appendChild(this.canvas);
  }
  // Internal Methods
  private setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    // Set The Canvas Size
    this.canvas.width = width;
    this.canvas.height = height;
    // Create Our FrameBuffer
    this.frameBuffer = this.ctx.createImageData(width, height);
  }
  // Public Methods
  // TODO: Expose onResize
  public clearBackground(color: number): void {
    const { width, height } = this;
    // Set The Background Color
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.setPixel(x, y, color);
      }
    }
  }
  public setPixel(x: number, y: number, color: number): void {
    const { frameBuffer, width } = this;
    // Calculate the pixel index
    const index = 4 * (x + y * width);
    // Set Our Color
    frameBuffer.data[index + 0] = (color >> 16) & 0xff;
    frameBuffer.data[index + 1] = (color >> 8) & 0xff;
    frameBuffer.data[index + 2] = color & 0xff;
    // We don't really have a need for alpha as of now so we just set it to 255
    frameBuffer.data[index + 3] = 255;
  }
  public getPixel(x: number, y: number): number {
    const { frameBuffer, width } = this;
    // Calculate the pixel index
    const index = 4 * (x + y * width);
    const r = frameBuffer.data[index + 0];
    const g = frameBuffer.data[index + 1];
    const b = frameBuffer.data[index + 2];
    return (r << 16) | (g << 8) | b;
  }
  public drawFrame(): void {
    this.ctx.putImageData(this.frameBuffer, 0, 0);
  }
}

// Default Export
export default ScreenWriter;
