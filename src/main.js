import * as THREE from 'three';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js';

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

const camera = new THREE.PerspectiveCamera(
  75,
  parameters.screenSize.width / parameters.screenSize.height,
  0.1,
  100
);
camera.position.set(4, 1, 2);

const controls = new OrbitControls(camera, canvas);

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

const gltfLoader = new GLTFLoader();
gltfLoader.load('/model.glb', (gltf) => {
  const model = gltf.scene.children[0].children[0];
  model.position.set(0, 0, 0);
  model.scale.set(0.1, 0.1, 0.1);
  scene.add(model);
  updateAllMaterials();
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.6);

directionalLight.position.set(5.5, 3, 4.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(512, 512);
directionalLight.shadow.normalBias = 0.05;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(parameters.screenSize.width, parameters.screenSize.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//helpers
// y green
// x red
// z blue
const axesHelper = new THREE.AxesHelper(5);
axesHelper.position.set(0, 0, 0);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);

const splineSpotLight = new THREE.SpotLight({
  color: new THREE.Color(1, 1, 1),
  intensity: 1,
  distance: 2000,
  angle: 0.523,
  penumbra: 0,
  decay: 1,
});

splineSpotLight.castShadow = true;
splineSpotLight.position.set(0, 180.15, -139.18);

const splinePointLight = new THREE.PointLight({
  color: new THREE.Color(1, 0.934, 0.691),
  intensity: 0.475,
  distance: 2583,
  decay: 4,
});

splinePointLight.castShadow = true;
splinePointLight.position.set(164.17, 237.82, 6.5);

scene.add(
  camera,
  ambientLight,
  directionalLight,
  axesHelper,
  directionalLightHelper
);

gui
  .add(directionalLight.position, 'x')
  .min(-10)
  .max(10)
  .step(0.1)
  .name('Directional Light Position X')
  .onChange(() => directionalLightHelper.update());
gui
  .add(directionalLight.position, 'y')
  .min(-10)
  .max(10)
  .step(0.1)
  .name('Directional Light Position Y')
  .onChange(() => directionalLightHelper.update());
gui
  .add(directionalLight.position, 'z')
  .min(-10)
  .max(10)
  .step(0.1)
  .name('Directional Light Position Z')
  .onChange(() => directionalLightHelper.update());
gui
  .add(directionalLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Directional Light Intensity');
gui
  .add(ambientLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.01)
  .name('Ambient Light Intensity');
gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

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
//

tick();
