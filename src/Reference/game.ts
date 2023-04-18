import { Vec2, Vec3, Mat4 } from "./math";
import { Vertex } from "./vertex";
import * as Resources from "./resources";
import * as Input from "./input";
import { Camera } from "./camera";
import {
  Renderer,
  RENDER_BACKGROUND,
  CALC_LIGHT,
  RENDER_FACE_NORMAL,
  RENDER_TANGENT_SPACE,
  RENDER_VERTEX_NORMAL,
} from "./renderer";

export class Game {
  // Constants Cached
  private t00 = new Vec2(0.0, 1.0);
  private t10 = new Vec2(1.0, 1.0);
  private t11 = new Vec2(1.0, 0.0);
  private t01 = new Vec2(0.0, 0.0);
  private skyBoxSize = new Vec3(1000.0, 1000.0, 1000.0);
  // Internals
  private renderer: Renderer;
  private camera: Camera;
  private time: number;
  constructor(renderer: Renderer, camera: Camera) {
    this.renderer = renderer;
    this.camera = camera;
    this.time = 0.0;
  }
  public update(delta: number) {
    // Handle camera movement
    let speed = 5.0;
    let rotSpeed = 60.0;
    let mx = 0.0;
    let mz = 0.0;
    if (Input.isKeyDown("Shift")) speed *= 1.5;
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
    if (Input.isKeyPressed("y")) this.renderer.toggleFlag(RENDER_TANGENT_SPACE);
    if (Input.isKeyPressed("u")) this.renderer.toggleFlag(RENDER_VERTEX_NORMAL);
  }
  public render() {
    // Teapot
    this.renderer.transform = new Mat4().translate(0.0, 0.0, -5.0);
    this.renderer.transform = this.renderer.transform.scale(1);
    this.renderer.setMaterial(Resources.textures.white, undefined, 100.0);
    this.renderer.drawModel(Resources.models.teapot);
    // Skybox
    this.drawSkyBox(this.time / 100.0);
  }
  private drawSkyBox(rotation: number): void {
    // Get From Cache
    const { t00, t10, t11, t01, skyBoxSize } = this;
    this.renderer.renderFlag = RENDER_BACKGROUND | (!CALC_LIGHT ? 1 : 0);
    let pos = this.camera.pos.sub(
      new Vec3(skyBoxSize.x * 0.5, skyBoxSize.y * 0.5, -skyBoxSize.z * 0.5)
    );
    this.renderer.transform = new Mat4().rotate(0.0, rotation, 0.0);
    const p000 = new Vec3(pos.x, pos.y, pos.z);
    const p100 = new Vec3(pos.x + skyBoxSize.x, pos.y, pos.z);
    const p110 = new Vec3(pos.x + skyBoxSize.x, pos.y + skyBoxSize.y, pos.z);
    const p010 = new Vec3(pos.x, pos.y + skyBoxSize.y, pos.z);
    const p001 = new Vec3(pos.x, pos.y, pos.z - skyBoxSize.z);
    const p101 = new Vec3(pos.x + skyBoxSize.x, pos.y, pos.z - skyBoxSize.z);
    const p111 = new Vec3(
      pos.x + skyBoxSize.x,
      pos.y + skyBoxSize.y,
      pos.z - skyBoxSize.z
    );
    const p011 = new Vec3(pos.x, pos.y + skyBoxSize.y, pos.z - skyBoxSize.z);
    // Compute Verts
    const vertColor = 0xffffff;
    const vertA = new Vertex(p000, vertColor, t01);
    const vertB = new Vertex(p010, vertColor, t00);
    const vertC = new Vertex(p011, vertColor, t10);
    const vertD = new Vertex(p001, vertColor, t11);
    const vertE = new Vertex(p100, vertColor, t01);
    const vertF = new Vertex(p110, vertColor, t00);
    const vertG = new Vertex(p010, vertColor, t10);
    const vertH = new Vertex(p000, vertColor, t11);
    const vertI = new Vertex(p011, vertColor, t01);
    const vertJ = new Vertex(p110, vertColor, t10);
    const vertK = new Vertex(p111, vertColor, t11);
    const vertL = new Vertex(p001, vertColor, t00);
    const vertM = new Vertex(p101, vertColor, t10);
    const vertN = new Vertex(p100, vertColor, t11);
    const vertO = new Vertex(p001, vertColor, t01);
    const vertP = new Vertex(p011, vertColor, t00);
    const vertQ = new Vertex(p111, vertColor, t10);
    const vertR = new Vertex(p101, vertColor, t11);
    const vertS = new Vertex(p101, vertColor, t01);
    const vertT = new Vertex(p111, vertColor, t00);
    // Render
    this.renderer.setMaterial(Resources.textures.skybox_front);
    this.renderer.drawTriangle(vertO, vertP, vertQ);
    this.renderer.drawTriangle(vertO, vertQ, vertR);
    this.renderer.setMaterial(Resources.textures.skybox_right);
    this.renderer.drawTriangle(vertS, vertT, vertJ);
    this.renderer.drawTriangle(vertS, vertJ, vertN);
    this.renderer.setMaterial(Resources.textures.skybox_left);
    this.renderer.drawTriangle(vertA, vertB, vertC);
    this.renderer.drawTriangle(vertA, vertC, vertD);
    this.renderer.setMaterial(Resources.textures.skybox_back);
    this.renderer.drawTriangle(vertE, vertF, vertG);
    this.renderer.drawTriangle(vertE, vertG, vertH);
    this.renderer.setMaterial(Resources.textures.skybox_top);
    this.renderer.drawTriangle(vertI, vertB, vertJ);
    this.renderer.drawTriangle(vertI, vertJ, vertK);
    this.renderer.setMaterial(Resources.textures.skybox_bottom);
    this.renderer.drawTriangle(vertA, vertL, vertM);
    this.renderer.drawTriangle(vertA, vertM, vertN);
    this.renderer.renderFlag = this.renderer.defaultRenderFlag;
  }
}
