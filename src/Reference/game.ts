import { Vec2, Vec3, Mat4 } from "./math";
import { Vertex } from "./vertex";
import * as Resources from "./resources";
import * as Input from "./input";
import {
  RENDER_BACKGROUND,
  CALC_LIGHT,
  RENDER_FACE_NORMAL,
  RENDER_TANGENT_SPACE,
  DISABLE_NORMAL_MAPPING,
} from "./renderer";

export class Game {
  constructor(renderer, camera) {
    this.renderer = renderer;
    this.camera = camera;
    this.time = 0.0;
    this.renderSkybox = true;
  }
  update(delta) {
    // Handle camera movement
    let speed = 5.0;
    let rotSpeed = 60.0;
    if (Input.isKeyDown("Shift")) speed *= 1.5;
    let mx = 0.0;
    let mz = 0.0;
    if (Input.isKeyDown("a")) --mx;
    if (Input.isKeyDown("d")) ++mx;
    if (Input.isKeyDown("w")) --mz;
    if (Input.isKeyDown("s")) ++mz;

    if (new Vec2(mx, mz).getLength() > 1) {
      mx /= 1.414;
      mz /= 1.414;
    }

    this.camera.pos.x +=
      (Math.cos((this.camera.rot.y * Math.PI) / 180.0) * mx +
        Math.sin((this.camera.rot.y * Math.PI) / 180.0) * mz) *
      speed *
      delta;
    this.camera.pos.z +=
      (-Math.sin((this.camera.rot.y * Math.PI) / 180.0) * mx +
        Math.cos((this.camera.rot.y * Math.PI) / 180.0) * mz) *
      speed *
      delta;

    if (Input.isKeyDown(" ")) this.camera.pos.y += speed * delta;
    if (Input.isKeyDown("c")) this.camera.pos.y -= speed * delta;
    if (Input.isKeyDown("ArrowUp")) this.camera.rot.x += rotSpeed * delta;
    if (Input.isKeyDown("ArrowDown")) this.camera.rot.x -= rotSpeed * delta;
    if (Input.isKeyDown("ArrowLeft")) this.camera.rot.y += rotSpeed * delta;
    if (Input.isKeyDown("ArrowRight")) this.camera.rot.y -= rotSpeed * delta;
    
    const radRot = this.camera.rot.mul(-Math.PI / 180.0);
    this.camera.cameraTransform = new Mat4().rotate(
      radRot.x,
      radRot.y,
      radRot.z
    );
    this.camera.cameraTransform = this.camera.cameraTransform.translate(
      -this.camera.pos.x,
      -this.camera.pos.y,
      -this.camera.pos.z
    );

    // Control directional light
    if (Input.isKeyDown("q")) this.renderer.sun.rotation.y += delta;
    if (Input.isKeyDown("e")) this.renderer.sun.rotation.y -= delta;
    if (Input.isKeyDown("r")) this.renderer.sun.rotation.z += delta;
    if (Input.isKeyDown("f")) this.renderer.sun.rotation.z -= delta;

    let matrix = new Mat4().rotate(
      this.renderer.sun.rotation.x,
      this.renderer.sun.rotation.y,
      this.renderer.sun.rotation.z
    );
    let sunDir = matrix
      .mulVector(this.renderer.sun.posRelativeToZero, 0)
      .normalized()
      .mul(-1);
    this.renderer.sun.dirVS = this.camera.cameraTransform.mulVector(sunDir, 0);

    this.time += delta;

    // Toggling render flags
    if (Input.isKeyPressed("n")) this.renderer.toggleFlag(RENDER_FACE_NORMAL);
    if (Input.isKeyPressed("t")) this.renderer.toggleFlag(RENDER_TANGENT_SPACE);
    if (Input.isKeyPressed("m"))
      this.renderer.toggleFlag(DISABLE_NORMAL_MAPPING);
    if (Input.isKeyPressed("b")) this.renderSkybox = !this.renderSkybox;
  }

  render() {
    let xPos = 0.0;
    let zPos = -5.0;
    let index = 0.0;
    let gap = 4.0;

    // Teapot
    this.renderer.transform = new Mat4().translate(
      xPos + index++ * gap,
      0.0,
      zPos
    );
    this.renderer.transform = this.renderer.transform.scale(1);
    this.renderer.setMaterial(Resources.textures.white, undefined, 100.0);
    this.renderer.drawModel(Resources.models.teapot);
    // Skybox
    if (this.renderSkybox) {
      this.drawSkyBox(this.time / 100.0);
    }
  }

  drawSkyBox(rotation) {
    this.renderer.renderFlag = RENDER_BACKGROUND | !CALC_LIGHT;

    let size = new Vec3(1000.0, 1000.0, 1000.0);
    let pos = this.camera.pos.sub(
      new Vec3(size.x / 2.0, size.y / 2.0, -size.z / 2.0)
    );
    this.renderer.transform = new Mat4().rotate(0.0, rotation, 0.0);

    const p000 = new Vec3(pos.x, pos.y, pos.z);
    const p100 = new Vec3(pos.x + size.x, pos.y, pos.z);
    const p110 = new Vec3(pos.x + size.x, pos.y + size.y, pos.z);
    const p010 = new Vec3(pos.x, pos.y + size.y, pos.z);

    const p001 = new Vec3(pos.x, pos.y, pos.z - size.z);
    const p101 = new Vec3(pos.x + size.x, pos.y, pos.z - size.z);
    const p111 = new Vec3(pos.x + size.x, pos.y + size.y, pos.z - size.z);
    const p011 = new Vec3(pos.x, pos.y + size.y, pos.z - size.z);

    const t00 = new Vec2(0.0, 1.0);
    const t10 = new Vec2(1.0, 1.0);
    const t11 = new Vec2(1.0, 0.0);
    const t01 = new Vec2(0.0, 0.0);

    this.renderer.setMaterial(Resources.textures.skybox_front);
    this.renderer.drawTriangle(
      new Vertex(p001, 0xffffff, t01),
      new Vertex(p011, 0xffffff, t00),
      new Vertex(p111, 0xffffff, t10)
    );
    this.renderer.drawTriangle(
      new Vertex(p001, 0xffffff, t01),
      new Vertex(p111, 0xffffff, t10),
      new Vertex(p101, 0xffffff, t11)
    );

    this.renderer.setMaterial(Resources.textures.skybox_right);
    this.renderer.drawTriangle(
      new Vertex(p101, 0xffffff, t01),
      new Vertex(p111, 0xffffff, t00),
      new Vertex(p110, 0xffffff, t10)
    );
    this.renderer.drawTriangle(
      new Vertex(p101, 0xffffff, t01),
      new Vertex(p110, 0xffffff, t10),
      new Vertex(p100, 0xffffff, t11)
    );

    this.renderer.setMaterial(Resources.textures.skybox_left);
    this.renderer.drawTriangle(
      new Vertex(p000, 0xffffff, t01),
      new Vertex(p010, 0xffffff, t00),
      new Vertex(p011, 0xffffff, t10)
    );
    this.renderer.drawTriangle(
      new Vertex(p000, 0xffffff, t01),
      new Vertex(p011, 0xffffff, t10),
      new Vertex(p001, 0xffffff, t11)
    );

    this.renderer.setMaterial(Resources.textures.skybox_back);
    this.renderer.drawTriangle(
      new Vertex(p100, 0xffffff, t01),
      new Vertex(p110, 0xffffff, t00),
      new Vertex(p010, 0xffffff, t10)
    );
    this.renderer.drawTriangle(
      new Vertex(p100, 0xffffff, t01),
      new Vertex(p010, 0xffffff, t10),
      new Vertex(p000, 0xffffff, t11)
    );

    this.renderer.setMaterial(Resources.textures.skybox_top);
    this.renderer.drawTriangle(
      new Vertex(p011, 0xffffff, t01),
      new Vertex(p010, 0xffffff, t00),
      new Vertex(p110, 0xffffff, t10)
    );
    this.renderer.drawTriangle(
      new Vertex(p011, 0xffffff, t01),
      new Vertex(p110, 0xffffff, t10),
      new Vertex(p111, 0xffffff, t11)
    );

    this.renderer.setMaterial(Resources.textures.skybox_bottom);
    this.renderer.drawTriangle(
      new Vertex(p000, 0xffffff, t01),
      new Vertex(p001, 0xffffff, t00),
      new Vertex(p101, 0xffffff, t10)
    );
    this.renderer.drawTriangle(
      new Vertex(p000, 0xffffff, t01),
      new Vertex(p101, 0xffffff, t10),
      new Vertex(p100, 0xffffff, t11)
    );

    this.renderer.renderFlag = this.renderer.defaultRenderFlag;
  }
}
