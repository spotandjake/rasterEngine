import './style.css'
// Imports
import Renderer from './Game/Renderer';
import GameObject from './Game/GameObject';
import Vector3 from './Game/Vector3';
import parseObj from './ObjParser';
// Load Assets
const teapotRaw = await fetch('./teapot.obj').then(res => res.text());
const teapotModel = parseObj(teapotRaw);
// const bunnyRaw = await fetch('./bunny.obj').then(res => res.text());
// const bunnyModel = parseObj(bunnyRaw);
// Create a new gameObject
const teapot = new GameObject(new Vector3(0, -1, 3), new Vector3(0, 0, 0), new Vector3(200, 200, 200), teapotModel);
// const bunny = new GameObject(new Vector3(0, -0.1, 0), new Vector3(0, 0, 0), new Vector3(5000, 5000, 5000), bunnyModel);
// Create a new renderer
const renderer = new Renderer();
renderer.drawObjects([teapot]);
// let frame = () => {
//   teapot.setPosition(teapot.getPosition().add(new Vector3(1, 0, 0)));
//   renderer.drawObjects([teapot]);
//   window.requestAnimationFrame(frame);
// }
// window.requestAnimationFrame(frame);
