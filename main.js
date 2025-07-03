import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

scene.add(new THREE.AmbientLight(0x444444));

const sunlight = new THREE.PointLight(0xffffee, 2, 1000, 2);
sunlight.position.set(0, 0, 0);
scene.add(sunlight);

const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffee });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const planetsData = [
    { name: 'Mercury', color: 0xaaaaaa, size: 0.8, distance: 10, speed: 0.04 },
    { name: 'Venus', color: 0xffcc66, size: 1.2, distance: 15, speed: 0.015 },
    { name: 'Earth', color: 0x3366ff, size: 1.3, distance: 20, speed: 0.01 },
    { name: 'Mars', color: 0xff3300, size: 1.1, distance: 25, speed: 0.008 },
    { name: 'Jupiter', color: 0xff9966, size: 2.5, distance: 35, speed: 0.002 },
    { name: 'Saturn', color: 0xffffcc, size: 2.2, distance: 45, speed: 0.0018 },
    { name: 'Uranus', color: 0x66ffff, size: 1.9, distance: 55, speed: 0.0012 },
    { name: 'Neptune', color: 0x3333ff, size: 1.8, distance: 65, speed: 0.001 }
];

const textureLoader = new THREE.TextureLoader();
const planetTextures = {
    Mercury: textureLoader.load("./public/2k_mercury.jpg"),
    Venus: textureLoader.load("./public/2k_venus_surface.jpg"),
    Earth: textureLoader.load("./public/2k_earth_daymap.jpg"),
    Mars: textureLoader.load("./public/2k_mars.jpg"),
    Jupiter: textureLoader.load("./public/2k_jupiter.jpg"),
    Saturn: textureLoader.load("./public/2k_saturn.jpg"),
    Uranus: textureLoader.load("./public/2k_uranus.jpg"),
    Neptune: textureLoader.load("./public/2k_neptune.jpg")
};


const planetMeshes = [];

planetsData.forEach((planet) => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        map: planetTextures[planet.name],
        shininess: 10
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { angle: Math.random() * Math.PI * 2 };
    scene.add(mesh);
    if (planet.name === 'Saturn') {
        const ringTexture = textureLoader.load('./public/2k_saturn_ring_alpha.png');

        const ringGeometry = new THREE.RingGeometry(3, 5.5, 64);

        const uv = ringGeometry.attributes.uv;
        for (let i = 0; i < uv.count; i++) {
            const x = uv.getX(i) - 0.5;
            const y = uv.getY(i) - 0.5;
            const len = Math.sqrt(x * x + y * y);
            uv.setXY(i, len, 0);
        }

        const ringMaterial = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true
        });

        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.renderOrder = 1;
        mesh.add(ring);
    }
    planetMeshes.push({ mesh, ...planet });
});

let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const starGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const starVertices = [];

for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starVertices, 3)
);

const starTexture = new THREE.TextureLoader().load(
    "https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp2.png"
);
const starMaterial = new THREE.PointsMaterial({
    size: 2,
    map: starTexture,
    transparent: true,
    depthWrite: false
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
);
bloomPass.threshold = 0.0;
bloomPass.strength = 2;
bloomPass.radius = 1;
composer.addPass(bloomPass);

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
});

function animate() {
    requestAnimationFrame(animate);

    planetMeshes.forEach((planet) => {
        planet.mesh.userData.angle += planet.speed;
        const x = Math.cos(planet.mesh.userData.angle) * planet.distance;
        const z = Math.sin(planet.mesh.userData.angle) * planet.distance;
        planet.mesh.position.set(x, 0, z);
        planet.mesh.rotation.y += 0.01;
    });

    stars.rotation.x = mouseY * 0.00005;
    stars.rotation.y = mouseX * 0.00005;

    controls.update();
    composer.render();
}
animate();
