import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {TextGeometry} from "three/addons/geometries/TextGeometry.js"
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const Texloader = new THREE.CubeTextureLoader();
const texture = Texloader.load([
    './img/nightsky_ft.png',
    './img/nightsky_bk.png',
    './img/nightsky_up.png',
    './img/nightsky_dn.png',
    './img/nightsky_rt.png',
    './img/nightsky_lf.png',
]);
scene.background = texture;
const loader = new FontLoader();
console.log("hi");
let font = await loader.loadAsync( 'helvetika.json', ()=>{
    console.log("something done")
});
console.log("end")
function cylinder(txt) {
    const grp = new THREE.Group();
    const geometry = new THREE.CylinderGeometry(5, 5, 1, 8);
    const material = new THREE.MeshPhongMaterial({ color: 0x61a633 });
    const textMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    material.side = THREE.DoubleSide
    const cube = new THREE.Mesh(geometry, material);
    txt.forEach((e,i) => {
     const textGeo = new TextGeometry(e, {
        font: font,
        size: 8,
        height: 5,
        curveSegments: 12,
    })

    const text = new THREE.Mesh(textGeo,textMat);

    textGeo.computeBoundingBox();
    
    // Calculate the offset
    const centerOffset = new THREE.Vector3();
    centerOffset.x = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    centerOffset.y = -0.5 * (textGeo.boundingBox.max.y - textGeo.boundingBox.min.y);
    centerOffset.z = -0.5 * (textGeo.boundingBox.max.z - textGeo.boundingBox.min.z);
    
    // Apply the offset to all vertices
    textGeo.translate(centerOffset.x, centerOffset.y, centerOffset.z);
    text.rotation.y = Math.PI * i/ textGeo.radialSegments;
    let dir = new THREE.Vector3();
    text.getWorldDirection(dir);
    camera.lookAt(text.position)
    text.position.add(dir)
    text.scale.set(0.15,0.15,0.05)
    grp.add(text)
});
cube.rotation.x = Math.PI / 2;
cube.rotation.z = Math.PI / 2;
grp.add(cube)
return grp;
}
const Amb = new THREE.AmbientLight(0x404040); // soft white Amb
scene.add(Amb);
const light = new THREE.PointLight(0xffffff, 1, 100,0.1);
scene.add(light);

let cys = [];
cys.push(cylinder(["Na"]))
cys.push(cylinder(["Cl"]))
cys.push(cylinder(["Mg"]))

cys.forEach((e, i) => {
    scene.add(e);
    e.position.x = 3 * (i - cys.length / 2)
});
camera.position.set(20, 5, 20);
// camera.lookAt(0, 0, 0)

document.body.addEventListener('keypress', (e) => {
    if (e.key.toLowerCase() == "w") {
        camera.rotation.x += 0.1;
    }
    if (e.key.toLowerCase() == "s") {
        camera.rotation.x -= 0.1;
    }
})
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update()

function animate() {
    renderer.render(scene, camera);
    // controls.update()
    light.position.set(camera.position.x, camera.position.y, camera.position.z);
}
renderer.setAnimationLoop(animate);