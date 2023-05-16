import "./style.css";
// Imports
// import "./Reference/main";
import Renderer from "./Game/Renderer";
import ModelParser from "./Game/ModelParser";
// loadImage
const imgCanvas = document.createElement("canvas");
const imgCtx = imgCanvas.getContext("2d")!;
let loadImage = (imageUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
  });
};
// Slightly Different than normal texture because we are chopping it up
let loadSkyBoxTexture = async (
  imageUrl: string,
  imgWidth: number,
  imgHeight: number
) => {
  let imageItem = await loadImage(imageUrl);
  // Load Into Canvas
  imgCtx.drawImage(imageItem, 0, 0, imgWidth, imgHeight);
  // Get Size
  const size = Math.ceil(imgWidth / 4);
  // Get Image Data
  const top = imgCtx.getImageData(size, 0, size, size);
  const bottom = imgCtx.getImageData(size, size * 2, size, size);
  const front = imgCtx.getImageData(size, size, size, size);
  const back = imgCtx.getImageData(size * 3, size, size, size);
  const right = imgCtx.getImageData(size * 2, size, size, size);
  const left = imgCtx.getImageData(0, size, size, size);
  // Return Our Textures
  return {
    skyBoxTop: top,
    skyBoxBottom: bottom,
    skyBoxFront: front,
    skyBoxBack: back,
    skyBoxRight: right,
    skyBoxLeft: left,
  };
};
// Load Assets
const monkeyObj = await fetch("./monkey.obj").then((res) => res.text());
const skyBoxTex = await loadSkyBoxTexture("./imgs/skybox3.png", 2048, 1536);
// ParseModel
const modelParser = new ModelParser();
const monkeyModel = modelParser.ObjParser(monkeyObj);
// Create Our Game Objects
// Create Our Renderer
const renderer = new Renderer(window.innerWidth, window.innerHeight);
// Frame Loop
// Draw Frame
renderer.drawFrame();
