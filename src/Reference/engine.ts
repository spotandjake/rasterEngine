import { Camera } from "./camera";
import { Bitmap } from "./bitmap";
import { Renderer } from "./renderer";
import * as Util from "./utils";
import * as Resources from "./resources";
import { Constants } from "./constants";
import * as Input from "./input";
import { Game } from "./game";

export class Engine {
  private times: number[];
  private started: boolean;
  private cvs: HTMLCanvasElement | undefined;
  private tmpCvs: HTMLCanvasElement | undefined;
  private gfx: CanvasRenderingContext2D | undefined;
  private tmpGfx: CanvasRenderingContext2D | undefined;
  private renderer: Renderer | undefined;
  private game: Game | undefined;

  constructor() {
    this.times = [];
    this.started = false;
  }

  public start(): void {
    this.init();
    this.run();
  }

  public init(): void {

    window.addEventListener("keydown", function (e) {
      if (e.key == " " && e.target == document.body) {
        e.preventDefault();
      }
    });

    this.cvs = document.createElement("canvas");
    this.cvs.width = window.innerWidth;
    this.cvs.height = window.innerHeight;
    document.querySelector("#app")!.appendChild(this.cvs);
    this.gfx = this.cvs.getContext("2d");

    this.gfx.font = "60px verdana";
    this.gfx.fillText("Loading...", 10, 60);

    this.tmpCvs = document.createElement("canvas");
    this.tmpGfx = this.tmpCvs.getContext("2d");

    for (const key in Resources.textures) {
      if (Object.hasOwnProperty.call(Resources.textures, key)) {
        const imageURL = Resources.textures[key][0];
        const imageWidth = Resources.textures[key][1][0];
        const imageHeight = Resources.textures[key][1][1];

        let image = new Image();
        image.src = imageURL;
        image.crossOrigin = "Anonymous";
        image.onload = () => {
          this.tmpCvs.setAttribute("width", imageWidth + "px");
          this.tmpCvs.setAttribute("height", imageHeight + "px");

          // Loading textures
          this.tmpGfx.drawImage(image, 0, 0, imageWidth, imageHeight);

          if (key == "skybox") {
            const size = Util.int(imageWidth / 4);

            let top = this.tmpGfx.getImageData(size, 0, size, size);
            let bottom = this.tmpGfx.getImageData(size, size * 2, size, size);
            let front = this.tmpGfx.getImageData(size, size, size, size);
            let back = this.tmpGfx.getImageData(size * 3, size, size, size);
            let right = this.tmpGfx.getImageData(size * 2, size, size, size);
            let left = this.tmpGfx.getImageData(0, size, size, size);

            Resources.textures["skybox_top"] = Util.convertImageDataToBitmap(
              top,
              size,
              size
            );
            Resources.textures["skybox_bottom"] = Util.convertImageDataToBitmap(
              bottom,
              size,
              size
            );
            Resources.textures["skybox_front"] = Util.convertImageDataToBitmap(
              front,
              size,
              size
            );
            Resources.textures["skybox_back"] = Util.convertImageDataToBitmap(
              back,
              size,
              size
            );
            Resources.textures["skybox_right"] = Util.convertImageDataToBitmap(
              right,
              size,
              size
            );
            Resources.textures["skybox_left"] = Util.convertImageDataToBitmap(
              left,
              size,
              size
            );
            Constants.LOADED_RESOURCES++;
            return;
          }
          image = this.tmpGfx.getImageData(0, 0, imageWidth, imageHeight);
          image = Util.convertImageDataToBitmap(image, imageWidth, imageHeight);
          Resources.textures[key] = image;
          Constants.LOADED_RESOURCES++;
        };
      }
    }
    Constants.WIDTH = Constants.WIDTH / Constants.SCALE;
    Constants.HEIGHT = Constants.HEIGHT / Constants.SCALE;
    this.camera = new Camera();
    this.renderer = new Renderer(
      Constants.WIDTH,
      Constants.HEIGHT,
      this.camera
    );
    this.game = new Game(this.renderer, this.camera);
    let sample = new Bitmap(64, 64);
    for (let i = 0; i < 64 * 64; ++i) {
      const x = i % 64;
      const y = Util.int(i / 64);
      sample.pixels[i] = ((x << 6) % 0xff << 8) | (y << 6) % 0xff;
    }
    Resources.textures["sample0"] = sample;
    sample = new Bitmap(64, 64);
    sample.clear(0xff00ff);
    Resources.textures["sample1"] = sample;
    sample = new Bitmap(64, 64);
    sample.clear(0xdfdfdf);
    Resources.textures["white"] = sample;

    sample = new Bitmap(64, 64);
    sample.clear(0x8080ff);
    Resources.textures["default_normal"] = sample;

    Input.init();
  }

  public run(): void {
    const now = performance.now();

    while (this.times.length > 0 && this.times[0] <= now - 1000) {
      this.times.shift();
    }

    let delta = 1.0;
    if (this.times.length > 0) {
      delta = (now - this.times[this.times.length - 1]) / 1000.0;
    }

    this.times.push(now);

    if (
      !this.started &&
      Constants.LOADED_RESOURCES == Constants.RESOURCE_READY
    ) {
      this.started = true;
      this.cvs.setAttribute("width", Constants.WIDTH * Constants.SCALE + "px");
      this.cvs.setAttribute(
        "height",
        Constants.HEIGHT * Constants.SCALE + "px"
      );
      this.tmpCvs.setAttribute(
        "width",
        Constants.WIDTH * Constants.SCALE + "px"
      );
      this.tmpCvs.setAttribute(
        "height",
        Constants.HEIGHT * Constants.SCALE + "px"
      );
      this.gfx.font = "48px verdana";
    }

    if (!this.started) {
      this.gfx.clearRect(0, 0, this.cvs.width, this.cvs.height);
      this.gfx.fillText(
        "Loading..." +
          Util.int(
            (Constants.LOADED_RESOURCES / Constants.RESOURCE_READY) * 100
          ) +
          "%",
        10,
        60
      );
    }

    if (this.started) {
      this.update(delta);
      this.render();
    }
    requestAnimationFrame(this.run.bind(this));
  }
  public update(delta: number): void {
    this.game.update(delta);
    Input.update();
  }
  public render() {
    this.renderer.clear(0xa7cff7);
    this.game.render();

    if (Constants.SCALE > 1) {
      // Resize the imagedata using off-screen rendering
      this.tmpGfx.putImageData(
        Util.convertBitmapToImageData(this.renderer),
        0,
        0
      );
      this.gfx.save();
      this.gfx.imageSmoothingEnabled = false;
      this.gfx.scale(Constants.SCALE, Constants.SCALE);
      this.gfx.drawImage(this.tmpCvs, 0, 0);
      this.gfx.restore();
    } else {
      this.gfx.putImageData(
        Util.convertBitmapToImageData(this.renderer),
        0,
        0
      );
    }
  }
}
