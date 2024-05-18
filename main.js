import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  85,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

const cubeSize = 4;
const squaresOffset = 1.025;
const faceSize = cubeSize * 0.999; // shrinking it a little bit so that the edges are visible

function createCube(x = 0, y = 0, z = 0) {
  const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const material = new THREE.MeshBasicMaterial(0xffffff);
  const cube = new THREE.Mesh(geometry, material);
  // cube.rotateX(0.5)
  // cube.rotateY(0.5)
  cube.position.set(x, y, z);
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black color for edges
  const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  cube.add(edges); // Add edges to the cube
  return cube;
}

const colors = {
  white: 0xffffff,
  yellow: 0xffff00,
  blue: 0x1111ff,
  green: 0x33ff33,
  red: 0xff3333,
  orange: 0xffa500,
};

function createFace(color) {
  const geometry = new THREE.BoxGeometry(faceSize, faceSize, 0.1);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const face = new THREE.Mesh(geometry, material);
  scene.add(face);
  return face;
}

function setFace(cube, color, facePosition) {
  const face = createFace(color);
  switch (facePosition) {
    case "front":
      face.position.set(
        cube.position.x,
        cube.position.y,
        cube.position.z + cubeSize / 2
      );
      break;
    case "back":
      face.position.set(
        cube.position.x,
        cube.position.y,
        cube.position.z - cubeSize / 2
      );
      break;
    case "left":
      face.rotateY(Math.PI / 2);
      face.position.set(
        cube.position.x - cubeSize / 2,
        cube.position.y,
        cube.position.z
      );
      break;
    case "right":
      face.rotateY(Math.PI / 2);
      face.position.set(
        cube.position.x + cubeSize / 2,
        cube.position.y,
        cube.position.z
      );
      break;
    case "top":
      face.rotateX(Math.PI / 2);
      face.position.set(
        cube.position.x,
        cube.position.y + cubeSize / 2,
        cube.position.z
      );
      break;
    case "bottom":
      face.rotateX(Math.PI / 2);
      face.position.set(
        cube.position.x,
        cube.position.y - cubeSize / 2,
        cube.position.z
      );
      break;
  }
  return face;
}

function createSquare(x, y, z) {
  const cube = createCube(x, y, z, colors[0]);
  // to improve:
  // I don't need to paint all faces of all squares.
  // to solve this I would need a face adjacency map (which I'll probably need in the future anyways)
  const rightFace = setFace(cube, colors.green, "right");
  const leftFace = setFace(cube, colors.blue, "left");
  const topFace = setFace(cube, colors.yellow, "top");
  const backFace = setFace(cube, colors.orange, "back");
  const frontFace = setFace(cube, colors.red, "front");
  const bottomFace = setFace(cube, colors.white, "bottom");
  const group = new THREE.Group();
  group.add(cube);
  group.add(rightFace);
  group.add(leftFace);
  group.add(topFace);
  group.add(backFace);
  group.add(frontFace);
  group.add(bottomFace);
  scene.add(group);
  // const box = new THREE.BoxHelper(group, 0xffff00);
  // scene.add(box);  

  return group;
}

const controls = new OrbitControls(camera, renderer.domElement);
const cubes = [];

const cubeCoordinates = [];
for (let x = -1; x < 2; x++) {
  for (let y = -1; y < 2; y++) {
    for (let z = -1; z < 2; z++) {
      if (x === 0 && y === 0 && z === 0) {
        continue;
      }
      cubeCoordinates.push([x, y, z]);
    }
  }
}

cubeCoordinates.forEach((coordinates) => {
  cubes.push(
    createSquare(
      cubeSize + cubeSize * squaresOffset * coordinates[0],
      cubeSize + cubeSize * squaresOffset * coordinates[1],
      cubeSize + cubeSize * squaresOffset * coordinates[2]
    )
  );
});

cubes.forEach((cube) => {
  scene.add(cube);
});

function splitFaces(cubes) {
  const rightFace = [];
  const leftFace = [];
  const topFace = [];
  const bottomFace = [];
  const frontFace = [];
  const backFace = [];

  cubes.forEach((cube) => {
    if (cube.position.x > 0){
      rightFace.push(cube);
    }
    if (cube.position.x < 0) {
      leftFace.push(cube);
      }
    if (cube.position.y > 0) {
      topFace.push(cube);
    }
    if (cube.position.x < 0) {
      bottomFace.push(cube);
    }
    if (cube.position.z > 0) {
      frontFace.push(cube);
    }
    if (cube.position.z < 0) {
      backFace.push(cube);
    }
  });

  return [rightFace, leftFace, topFace, bottomFace, frontFace, backFace];
}

console.log(splitFaces(cubes));

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
