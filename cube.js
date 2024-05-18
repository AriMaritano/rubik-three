
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);


cube = createCube(0, 0, 0);

scene.add(cube)
renderer.render();


// Define the colors for the cube faces
const colors = [0xffffff, 0xffff00, 0x0000ff, 0x00ff00, 0xff0000, 0xffa500]; // White, Yellow, Blue, Green, Red, Orange

// Create a function to create the smaller cubes
function createCube(x, y, z) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));
  const cube = new THREE.Mesh(geometry, materials);

  cube.position.set(x, y, z);
  scene.add(cube);
  return cube;
}
