import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0x444444));
const sunlight = new THREE.PointLight(0xffffee, 2, 1000, 2);
sunlight.position.set(0, 0, 0);
scene.add(sunlight);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffffee })
);
scene.add(sun);

const planetsData = [
  { name: 'Mercury', size: 0.8, distance: 10, speed: 0.04 },
  { name: 'Venus', size: 1.2, distance: 15, speed: 0.015 },
  { name: 'Earth', size: 1.3, distance: 20, speed: 0.01 },
  { name: 'Mars', size: 1.1, distance: 25, speed: 0.008 },
  { name: 'Jupiter', size: 2.5, distance: 35, speed: 0.002 },
  { name: 'Saturn', size: 2.2, distance: 45, speed: 0.0018 },
  { name: 'Uranus', size: 1.9, distance: 55, speed: 0.0012 },
  { name: 'Neptune', size: 1.8, distance: 65, speed: 0.001 }
];

const textureLoader = new THREE.TextureLoader();
const planetTextures = {
  Mercury: textureLoader.load('./public/2k_mercury.jpg'),
  Venus: textureLoader.load('./public/2k_venus_surface.jpg'),
  Earth: textureLoader.load('./public/2k_earth_daymap.jpg'),
  Mars: textureLoader.load('./public/2k_mars.jpg'),
  Jupiter: textureLoader.load('./public/2k_jupiter.jpg'),
  Saturn: textureLoader.load('./public/2k_saturn.jpg'),
  Uranus: textureLoader.load('./public/2k_uranus.jpg'),
  Neptune: textureLoader.load('./public/2k_neptune.jpg')
};

const planetMeshes = [];
planetsData.forEach((planet) => {
  const geo = new THREE.SphereGeometry(planet.size, 32, 32);
  const mat = new THREE.MeshPhongMaterial({ map: planetTextures[planet.name], shininess: 10 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = { angle: Math.random()*Math.PI*2, name: planet.name };
  scene.add(mesh);

  if(planet.name === 'Saturn'){
    const ringTex = textureLoader.load('./public/2k_saturn_ring_alpha.png');
    const ringGeo = new THREE.RingGeometry(3,5.5,64);
    const uv = ringGeo.attributes.uv;
    for(let i=0; i<uv.count; i++){
      const x = uv.getX(i)-0.5, y = uv.getY(i)-0.5;
      uv.setXY(i, Math.sqrt(x*x+y*y), 0);
    }
    const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, side: THREE.DoubleSide, transparent: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.userData.name = planet.name;
    ring.rotation.x = Math.PI/2;
    ring.renderOrder = 1;
    mesh.add(ring);
  }

  planetMeshes.push({ mesh, ...planet });
});

const starGeom = new THREE.BufferGeometry();
const starVerts = new Float32Array(1000*3);
for(let i=0; i<starVerts.length; i++){
  starVerts[i] = (Math.random()-0.5)*2000;
}
starGeom.setAttribute('position', new THREE.BufferAttribute(starVerts,3));
const starMat = new THREE.PointsMaterial({
  size:2, map: textureLoader.load('https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp2.png'),
  transparent:true, depthWrite:false
});
scene.add(new THREE.Points(starGeom, starMat));

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight),1.5,0.4,0.85);
bloomPass.threshold=0; bloomPass.strength=2; bloomPass.radius=1;
composer.addPass(bloomPass);

window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Controls UI
const controlPanel = document.getElementById('controlPanel');
planetMeshes.forEach((p,i)=>{
  const div = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = `${p.name}:`;
  const slider = document.createElement('input');
  slider.type='range'; slider.min=0.0005; slider.max=0.05; slider.step=0.0005; slider.value=p.speed;
  slider.addEventListener('input', e=>{ p.speed = parseFloat(e.target.value) });
  div.append(label, slider);
  controlPanel.append(div);
});

// Pause button
let isPaused = false;
const toggleBtn = document.getElementById('toggleBtn');
toggleBtn.addEventListener('click', ()=>{
  isPaused = !isPaused;
  toggleBtn.textContent = isPaused ? 'Resume' : 'Pause';
});

// Tooltip setup
const tooltip = document.getElementById('tooltip');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e)=>{
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planetMeshes.map(p=>p.mesh));
  if(intersects.length > 0){
    const name = intersects[0].object.userData.name;
    tooltip.style.display = 'block';
    tooltip.innerText = name;
    tooltip.style.left = `${e.clientX+10}px`;
    tooltip.style.top = `${e.clientY+10}px`;
  } else {
    tooltip.style.display = 'none';
  }
});

function animate(){
  requestAnimationFrame(animate);
  if(!isPaused){
    planetMeshes.forEach(p=>{
      p.mesh.userData.angle += p.speed;
      p.mesh.position.set(
        Math.cos(p.mesh.userData.angle)*p.distance,
        0,
        Math.sin(p.mesh.userData.angle)*p.distance
      );
      p.mesh.rotation.y += 0.01;
    });
  }
  controls.update();
  composer.render();
}

animate();
