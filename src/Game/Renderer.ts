// Imports
import ScreenWriter from './ScreenWriter';
import Color from './Color';
// This is our renderer
class Renderer {
  // Internals
  private screenWriter: ScreenWriter;
  // Constructor
  constructor() {
    // Create The screenWriter
    this.screenWriter = new ScreenWriter();
    this.screenWriter.clearBackground(new Color(179, 210, 228));
    this.screenWriter.drawFrame();
  }
  // Internal Methods
  // Public Methods
  public Draw(): void {
    // Render Out Our Scene Data
    // Draw The Pixels To The Screen
    this.screenWriter.drawFrame();
  }
}

// Default Export
export default Renderer;