// Imports
import ScreenWriter from './ScreenWriter';
import GameObject from './GameObject';
import Color from './Color';
// This is our renderer
class Renderer {
  // Internals
  private screenWriter: ScreenWriter;
  // Constructor
  constructor() {
    // Create The screenWriter
    this.screenWriter = new ScreenWriter();
    this.screenWriter.clearBackground(new Color(100, 149, 237));
    this.screenWriter.drawFrame();
  }
  // Internal Method
  
  // Public Methods
  // TODO: This should not directly take a game object
  public Draw(gameObj: GameObject): void {
    // Render Out Our Scene Data
    // NOTE: This is just being used for testing atm
    const { screenWriter } = this;
    var centerX = screenWriter.getWidth() / 2.0;
    var centerY = screenWriter.getHeight() / 2.0;  
    var scale = 100;
    centerY += 150;
    
    // draw our model
    for (var i = 0; i < gameObj.getModel().faces.length; i++) {
      var face = gameObj.getModel().faces[i];
      var v0 = gameObj.getModel().verts[face[0] - 1];
      var v1 = gameObj.getModel().verts[face[1] - 1];
      var v2 = gameObj.getModel().verts[face[2] - 1];
      
      if (v0 && v1 && v2) {
        screenWriter.drawLine(centerX + v0.x * scale, centerY - v0.y * scale, centerX + v1.x * scale, centerY - v1.y * scale);
        screenWriter.drawLine(centerX + v1.x * scale, centerY - v1.y * scale, centerX + v2.x * scale, centerY - v2.y * scale);
        screenWriter.drawLine(centerX + v2.x * scale, centerY - v2.y * scale, centerX + v0.x * scale, centerY - v0.y * scale);
      } else {
        if (!v0) { console.log("Vertice " + (face[0] - 1) + " not found!"); }
        if (!v1) { console.log("Vertice " + (face[1] - 1) + " not found!"); }
        if (!v2) { console.log("Vertice " + (face[2] - 1) + " not found!"); }
      }
    }
    // Draw The Pixels To The Screen
    this.screenWriter.drawFrame();
  }
}

// Default Export
export default Renderer;