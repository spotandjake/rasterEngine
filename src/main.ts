import './style.css'
// Imports
import Renderer from './Game/Renderer';
import GameObject from './Game/GameObject';
import Vector3 from './Game/Vector3';
import parseObj from './ObjParser';
// Load Assets
const teapotRaw = await fetch('./teapot.obj').then(res => res.text());
const teapotModel = parseObj(teapotRaw);
// Create a new gameObject
const teapot = new GameObject(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(200, 200, 200), teapotModel);
// Create a new renderer
const renderer = new Renderer();
renderer.drawObjects([teapot]);