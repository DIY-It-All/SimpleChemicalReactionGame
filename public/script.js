import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.min.js"
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
    './img/nightsky_ft.png',
    './img/nightsky_bk.png',
    './img/nightsky_up.png',
    './img/nightsky_dn.png',
    './img/nightsky_rt.png',
    './img/nightsky_lf.png',
]);
scene.background = texture;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

document.body.addEventListener('keypress', (e)=>{
    if(e.key.toLowerCase() == "w"){
        camera.rotation.x += 0.1;
    }
    if(e.key.toLowerCase() == "s"){
        camera.rotation.x -= 0.1;
    }
})

function animate() {
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);