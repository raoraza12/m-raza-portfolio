import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './Scene3D.css';

export default function Scene3D() {
  const containerRef = useRef(null);
  const [wireframeMode, setWireframeMode] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Main 3D Interactive Group
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Complex 3D Geometry: Torus Knot + Icosahedron
    const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.4, 120, 24, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xff6200,
      emissive: 0xaa3300,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    group.add(knotMesh);

    // 2. Inner Glowing Core
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff5500,
      emissiveIntensity: 0.9,
      wireframe: false,
      transparent: true,
      opacity: 0.45,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 3. Orbiting 3D Particle Cloud
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xff6200); // Electric Solar Orange
    const c2 = new THREE.Color(0xffb703); // Golden Amber
    const c3 = new THREE.Color(0xff3300); // Deep Crimson Ember

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.8 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() > 0.5 ? c1 : Math.random() > 0.5 ? c2 : c3;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    group.add(particleCloud);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff6200, 35, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffb703, 25, 50);
    pointLight2.position.set(-5, -4, 3);
    scene.add(pointLight2);

    // Mouse and Scroll Reactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    let scrollProgress = 0;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = window.scrollY / (maxScroll || 1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Render loop
    let animId;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Continuous organic rotation
      knotMesh.rotation.x = elapsedTime * 0.25;
      knotMesh.rotation.y = elapsedTime * 0.35;
      coreMesh.rotation.x = -elapsedTime * 0.3;
      coreMesh.rotation.y = -elapsedTime * 0.4;
      particleCloud.rotation.y = elapsedTime * 0.08;

      // Mouse inertia tracking
      targetRotationY = mouseX * 0.8;
      targetRotationX = -mouseY * 0.6;
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;

      // Dynamic scroll reaction
      group.position.y = -scrollProgress * 2.2;
      group.scale.setScalar(1 + scrollProgress * 0.3);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      knotGeo.dispose();
      knotMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="scene-3d-wrapper" aria-hidden="true">
      <div ref={containerRef} className="scene-3d-canvas-container" />
      <div className="scene-3d-hud">
        <span className="hud-badge font-mono">
          <span className="hud-pulse"></span>
          <span>WebGL 3D ENGINE // LIVE TORUS KNOT</span>
        </span>
      </div>
    </div>
  );
}
