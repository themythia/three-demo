import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js';
import SplineLoader from '@splinetool/loader';

const parameters = {
  screenSize: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
};

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const gui = new GUI();
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  1,
  100000
);
camera.position.set(553.79, 636.29, 541.97);
camera.quaternion.setFromEuler(new THREE.Euler(-0.48, 0.71, 0.33));
const controls = new OrbitControls(camera, canvas);

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

const loader = new SplineLoader();
loader.load('/scene.splinecode', (splineScene) => {
  const model = splineScene.children[2];
  scene.add(model);
  updateAllMaterials();
});

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(parameters.screenSize.width, parameters.screenSize.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.physicallyCorrectLights = true;
// renderer.useLegacyLights = true;
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.LinearToneMapping;
// renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const spotlight = new THREE.SpotLight(
  new THREE.Color(1, 1, 1),
  1,
  2000,
  Math.PI / 6,
  0,
  1
);

const pointLight = new THREE.PointLight(
  new THREE.Color(1, 0.934, 0.691),
  0.475,
  2583,
  4
);

const directionalLight = new THREE.DirectionalLight(
  new THREE.Color(1, 1, 1),
  0.562
);

const hemiLight = new THREE.HemisphereLight(
  new THREE.Color(0.159, 0.089, 0.845),
  new THREE.Color(0.509, 0.509, 0.509),
  0.337
);

spotlight.castShadow = true;
spotlight.shadow.mapSize = new THREE.Vector2(1024, 1024);
spotlight.position.set(0, 180.15, -139.18);
pointLight.castShadow = true;
pointLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
pointLight.position.set(164.17, 237.82, 6.5);
directionalLight.position.set(-145.85, 300, 206.22);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
hemiLight.position.set(0, 1, 0);

scene.add(camera, spotlight, directionalLight, pointLight, hemiLight);

window.addEventListener('resize', () => {
  // Update sizes
  parameters.screenSize.width = window.innerWidth;
  parameters.screenSize.height = window.innerHeight;

  // Update camera
  camera.aspect = parameters.screenSize.width / parameters.screenSize.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(parameters.screenSize.width, parameters.screenSize.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const tick = () => {
  // Update controls
  controls.update();

  stats.begin();

  // monitored code goes here

  stats.end();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
