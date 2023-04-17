import * as Resources from "./resources";

export let Constants = {
  WIDTH: 1200,
  // (Constants.WIDTH / 4) * 3
  HEIGHT: (1200 / 4) * 3,
  SCALE: 4,
  FOV: (1200 / 4) * 3 / 4,
  RESOURCE_READY:
    Object.keys(Resources.textures).length +
    Object.keys(Resources.models).length,
  LOADED_RESOURCES: 0,
  GLOBAL_ALPHA: 255,
};
