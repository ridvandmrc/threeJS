import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export const ThreeJS = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fff");

    // add a camera
    const camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.5,
      20
    );
    camera.position.z = 4;

    // crate and add an object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#000" });

    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = 0.5;
    cube.rotation.y = 0.1;
    cube.rotation.z = 0.1;
    scene.add(cube);

    // Add Light

    const light = new THREE.DirectionalLight(0x123123, 100);
    light.position.set(1, 1, 1);
    scene.add(light);

    // add a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;

    function animate() {
      requestAnimationFrame(animate);
      controls.update();

      renderer.render(scene, camera);
    }
    animate();
  }, []);
  return <></>;
};
