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
  aspectRatio: window.innerWidth / window.innerHeight,
  addHelpers: () => {
    scene.add(
      spotLightHelper,
      pointLightHelper,
      pointLightHelper2,
      directionalLightHelper,
      hemiLightHelper
    );
  },
  removeHelpers: () => {
    scene.remove(
      spotLightHelper,
      pointLightHelper,
      pointLightHelper2,
      directionalLightHelper,
      hemiLightHelper
    );
  },
  lightColors: {
    directionalLight: '#ffffff',
    pointLight: '#ffeeb0',
    pointLight2: '#dc830c',
    spotLight: '#ffffff',
    hemisphere: {
      sky: '#2917d8',
      ground: '#828282',
    },
  },
  sceneBg: '#ffdc5f',
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
loader.load('/scene2.splinecode', (splineScene) => {
  const plane = splineScene.children[0];
  const model = splineScene.children[6];
  scene.add(plane, model);
  updateAllMaterials();
});

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(parameters.screenSize.width, parameters.screenSize.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
scene.background = new THREE.Color(parameters.sceneBg);

const spotlight = new THREE.SpotLight(
  new THREE.Color(parameters.lightColors.spotLight),
  3.16,
  2000,
  Math.PI / 6,
  0.2,
  10.9
);

const pointLight = new THREE.PointLight(
  new THREE.Color(parameters.lightColors.pointLight),
  0.475,
  2583,
  4
);
const pointLight2 = new THREE.PointLight(
  new THREE.Color(parameters.lightColors.pointLight2),
  0.55,
  0,
  10
);

const directionalLight = new THREE.DirectionalLight(
  new THREE.Color(parameters.lightColors.directionalLight),
  0.562
);

const hemiLight = new THREE.HemisphereLight(
  new THREE.Color(parameters.lightColors.hemisphere.sky),
  new THREE.Color(parameters.lightColors.hemisphere.ground),
  0.337
);

spotlight.castShadow = true;
spotlight.shadow.mapSize = new THREE.Vector2(1024, 1024);
spotlight.position.set(0, 180.15, -139.18);

pointLight.castShadow = true;
pointLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
pointLight.position.set(164.17, 237.82, 6.5);

pointLight2.castShadow = true;
pointLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
pointLight2.position.set(-2.05, 136.3, -68.4);

directionalLight.position.set(-145.85, 300, 206.22);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
directionalLight.shadow.camera.left = -1000;
directionalLight.shadow.camera.right = 1000;
directionalLight.shadow.camera.top = 1000;
directionalLight.shadow.camera.bottom = -1000;

hemiLight.position.set(0, 1, 0);

scene.add(
  camera,
  spotlight,
  directionalLight,
  pointLight,
  hemiLight,
  pointLight2
);

const spotLightHelper = new THREE.SpotLightHelper(spotlight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 10);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  10
);
const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
gui
  .addColor(parameters, 'sceneBg')
  .onChange(() => scene.background.set(parameters.sceneBg));
gui.add(parameters, 'addHelpers');
gui.add(parameters, 'removeHelpers');

gui.addColor(parameters.lightColors, 'directionalLight').onChange(() => {
  directionalLight.color.set(parameters.lightColors.directionalLight);
  directionalLightHelper.update();
});
gui
  .add(directionalLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Directional Light Intensity');
gui
  .add(directionalLight.position, 'x')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Directional Light Position X')
  .onChange(() => directionalLightHelper.update());
gui
  .add(directionalLight.position, 'y')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Directional Light Position Y')
  .onChange(() => directionalLightHelper.update());
gui
  .add(directionalLight.position, 'z')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Directional Light Position Z')
  .onChange(() => directionalLightHelper.update());
gui.add(directionalLight, 'castShadow').name('Directional Light Shadows');

gui.addColor(parameters.lightColors, 'spotLight').onChange(() => {
  spotlight.color.set(parameters.lightColors.spotLight);
  spotLightHelper.update();
});

gui
  .add(spotlight, 'intensity')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Spot Light Intensity');
gui
  .add(spotlight.position, 'x')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Spot Light Position X')
  .onChange(() => spotLightHelper.update());
gui
  .add(spotlight.position, 'y')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Spot Light Position Y')
  .onChange(() => spotLightHelper.update());
gui
  .add(spotlight.position, 'z')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Spot Light Position Z')
  .onChange(() => spotLightHelper.update());
gui.add(spotlight, 'castShadow').name('Spot Light Shadows');

gui.addColor(parameters.lightColors, 'pointLight').onChange(() => {
  pointLight.color.set(parameters.lightColors.pointLight);
  pointLightHelper.update();
});
gui
  .add(pointLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Point Light Intensity');
gui
  .add(pointLight.position, 'x')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Point Light Position X')
  .onChange(() => pointLightHelper.update());
gui
  .add(pointLight.position, 'y')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Point Light Position Y')
  .onChange(() => pointLightHelper.update());
gui
  .add(pointLight.position, 'z')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Point Light Position Z')
  .onChange(() => pointLightHelper.update());
gui.add(pointLight, 'castShadow').name('Point Light Shadows');

gui.addColor(parameters.lightColors, 'pointLight2').onChange(() => {
  pointLight2.color.set(parameters.lightColors.pointLight2);
  pointLightHelper2.update();
});
gui
  .add(pointLight2, 'intensity')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Point Light 2 Intensity');
gui
  .add(pointLight2.position, 'x')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Point Light Position X')
  .onChange(() => pointLightHelper2.update());
gui
  .add(pointLight2.position, 'y')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Point Light Position Y')
  .onChange(() => pointLightHelper2.update());
gui
  .add(pointLight2.position, 'z')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Point Light Position Z')
  .onChange(() => pointLightHelper2.update());
gui.add(pointLight2, 'castShadow').name('Point Light 2 Shadows');

gui.addColor(parameters.lightColors.hemisphere, 'sky').onChange(() => {
  hemiLight.color.set(parameters.lightColors.hemisphere.sky);
  hemiLightHelper.update();
});
gui.addColor(parameters.lightColors.hemisphere, 'ground').onChange(() => {
  hemiLight.groundColor.set(parameters.lightColors.hemisphere.ground);
  hemiLightHelper.update();
});
gui
  .add(hemiLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Hemisphere Light Intensity');
gui
  .add(hemiLight.position, 'x')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Hemisphere Light Position X')
  .onChange(() => hemiLightHelper.update());
gui
  .add(hemiLight.position, 'y')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Hemisphere Light Position Y')
  .onChange(() => hemiLightHelper.update());
gui
  .add(hemiLight.position, 'z')
  .min(-1000)
  .max(1000)
  .step(1)
  .name('Hemisphere Light Position Z')
  .onChange(() => hemiLightHelper.update());

window.addEventListener('resize', () => {
  // Update sizes
  parameters.screenSize.width = window.innerWidth;
  parameters.screenSize.height = window.innerHeight;
  parameters.aspectRatio =
    parameters.screenSize.width / parameters.screenSize.height;

  // Update camera
  camera.left = window.innerWidth / -2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / -2;
  camera.aspect = window.innerWidth / window.innerHeight;
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
