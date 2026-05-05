// 3D Car Racing Game with AI Cars, Lanes, and Rankings

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Track
const trackGeometry = new THREE.PlaneGeometry(20, 200);
const trackMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
const track = new THREE.Mesh(trackGeometry, trackMaterial);
track.rotation.x = -Math.PI / 2;
track.position.z = -50;
scene.add(track);

// Lane lines
for (let i = -2; i <= 2; i += 2) {
    const lineGeometry = new THREE.PlaneGeometry(0.2, 200);
    const lineMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.rotation.x = -Math.PI / 2;
    line.position.set(i, 0.01, -50);
    scene.add(line);
}

// Finish line
const finishGeometry = new THREE.PlaneGeometry(20, 2);
const finishMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const finish = new THREE.Mesh(finishGeometry, finishMaterial);
finish.rotation.x = -Math.PI / 2;
finish.position.z = 50;
scene.add(finish);

// Cars
const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
const carMaterials = [
    new THREE.MeshLambertMaterial({ color: 0xff0000 }),
    new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
    new THREE.MeshLambertMaterial({ color: 0x0000ff }),
    new THREE.MeshLambertMaterial({ color: 0xffff00 })
];

const cars = [];
const lanes = [-3, -1, 1, 3];
const speeds = [0.1, 0.12, 0.08, 0.15]; // Different speeds for AI

for (let i = 0; i < 4; i++) {
    const car = new THREE.Mesh(carGeometry, carMaterials[i]);
    car.position.set(lanes[i], 0.25, -90);
    scene.add(car);
    cars.push({ mesh: car, speed: speeds[i], finished: false });
}

// Camera position
camera.position.set(0, 5, -10);
camera.lookAt(0, 0, 0);

// Rankings
function updateRankings() {
    const sortedCars = cars.slice().sort((a, b) => b.mesh.position.z - a.mesh.position.z);
    let rankingsHtml = '<h2>Rankings</h2>';
    sortedCars.forEach((car, index) => {
        const rank = index + 1;
        const color = car.mesh.material.color.getHexString();
        rankingsHtml += `<div>${rank}. Car ${color.toUpperCase()}</div>`;
    });
    document.getElementById('rankings').innerHTML = rankingsHtml;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move AI cars
    cars.forEach(car => {
        if (!car.finished && car.mesh.position.z < 50) {
            car.mesh.position.z += car.speed;
        } else if (!car.finished) {
            car.finished = true;
        }
    });

    // Update camera to follow the leading car
    const leadingCar = cars.reduce((prev, current) => (prev.mesh.position.z > current.mesh.position.z) ? prev : current);
    camera.position.z = leadingCar.mesh.position.z - 10;
    camera.lookAt(leadingCar.mesh.position.x, 0, leadingCar.mesh.position.z);

    updateRankings();

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});