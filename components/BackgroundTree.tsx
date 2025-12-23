
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState, OrnamentType } from '../types';
import { randomPointInSphere } from '../utils/math';

const NEEDLE_COUNT = 180000; 
const ORNAMENT_COUNT = 550; 
const TREE_HEIGHT = 19.0;
const TREE_RADIUS = 9.0;
const CHAOS_RADIUS = 18; 
const TREE_TIERS = 9; 
const TREE_TOP_Y = 0.8 * TREE_HEIGHT; 

const createHammeredBumpMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const r = Math.random() * 20 + 5;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(255, 255, 255, 0.3)'); 
        g.addColorStop(1, 'rgba(128, 128, 128, 0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
};

const createGoldLeafMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0,0,512,512);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    for(let i=0; i<1000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x + (Math.random()-0.5)*20, y + (Math.random()-0.5)*20);
        ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
};

const createVelvetBumpMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const imgData = ctx.createImageData(512, 512);
    for (let i = 0; i < imgData.data.length; i += 4) {
        const val = Math.random() * 255;
        imgData.data[i] = val;
        imgData.data[i+1] = val;
        imgData.data[i+2] = val;
        imgData.data[i+3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
};

const SantaHat = () => {
    const velvetMap = useMemo(() => createVelvetBumpMap(), []);
    const whiteTrimMap = useMemo(() => createVelvetBumpMap(), []);
    const redFabricMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#D40000",
        roughness: 0.9,
        bumpMap: velvetMap,
        bumpScale: 0.05,
    }), [velvetMap]);
    const whiteFabricMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 1.0,
        bumpMap: whiteTrimMap,
        bumpScale: 0.1,
    }), [whiteTrimMap]);
    return (
        <group position={[0, TREE_TOP_Y + 0.4, 0]} rotation={[0.1, 0, 0.1]} scale={[2.5, 2.5, 2.5]}>
            <mesh position={[0, 0, 0]} material={whiteFabricMat}>
                <torusGeometry args={[0.5, 0.2, 16, 32]} />
            </mesh>
            <mesh position={[0, 0.8, 0]} material={redFabricMat}>
                <coneGeometry args={[0.45, 1.8, 64]} /> 
            </mesh>
            <mesh position={[0, 1.7, 0]} material={whiteFabricMat}>
                <sphereGeometry args={[0.22, 32, 32]} />
            </mesh>
        </group>
    );
};

const randomPointInPineTree = (height: number, maxRadius: number, tiers: number): THREE.Vector3 => {
    const normalizedH = Math.random(); 
    const y = (normalizedH - 0.2) * height; 
    const overallTaper = 1 - normalizedH; 
    const tierPos = normalizedH * tiers;
    const tierProgress = tierPos % 1; 
    const tierFlare = (1 - tierProgress); 
    const currentMaxRadius = maxRadius * (overallTaper * 0.7 + tierFlare * 0.3 * overallTaper);
    const r = Math.sqrt(Math.random()) * currentMaxRadius;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    return new THREE.Vector3(x, y, z);
};

const createHeptagramShape = () => {
    const shape = new THREE.Shape();
    const points = 7;
    const outerRadiusBase = 1.0;
    const innerRadiusBase = 0.5;
    for (let i = 0; i < points * 2; i++) {
        const angle = (i / (points * 2)) * Math.PI * 2;
        const isTip = i % 2 === 0;
        const variance = Math.sin(i * 123.45) * 0.15; 
        const r = isTip ? outerRadiusBase + variance : innerRadiusBase + variance * 0.5;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
};

export const BackgroundTree: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const needlesRef = useRef<THREE.Points>(null);
  const sphereMeshRef = useRef<THREE.InstancedMesh>(null);
  const heptagramMeshRef = useRef<THREE.InstancedMesh>(null);
  
  const sphereBumpMap = useMemo(() => createHammeredBumpMap(), []);
  const starBumpMap = useMemo(() => createGoldLeafMap(), []);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.clearRect(0,0,64,64);
        ctx.beginPath(); ctx.arc(32, 32, 28, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff'; ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const needleData = useMemo(() => {
    const positions = new Float32Array(NEEDLE_COUNT * 3);
    const colors = new Float32Array(NEEDLE_COUNT * 3);
    const randoms = new Float32Array(NEEDLE_COUNT); 
    const c1 = new THREE.Color("#4ade80"); const c2 = new THREE.Color("#22c55e"); const c3 = new THREE.Color("#15803d");
    const tmp = new THREE.Color();
    for (let i = 0; i < NEEDLE_COUNT; i++) {
      const tPos = randomPointInPineTree(TREE_HEIGHT, TREE_RADIUS, TREE_TIERS);
      positions[i*3] = tPos.x; positions[i*3+1] = tPos.y; positions[i*3+2] = tPos.z;
      const r = Math.random();
      if (r < 0.33) tmp.copy(c1); else if (r < 0.66) tmp.copy(c2); else tmp.copy(c3);
      tmp.offsetHSL(0, 0.05, (Math.random() - 0.5) * 0.1);
      colors[i*3] = tmp.r; colors[i*3+1] = tmp.g; colors[i*3+2] = tmp.b;
      randoms[i] = Math.random();
    }
    return { positions, colors, randoms };
  }, []);

  const heptagramGeometry = useMemo(() => {
    const shape = createHeptagramShape();
    const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const heptagramMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#FFD700", metalness: 1.0, roughness: 0.3, bumpMap: starBumpMap, bumpScale: 0.02,
    emissive: "#FF6600", emissiveIntensity: 1.0, toneMapped: false, envMapIntensity: 2.0
  }), [starBumpMap]);

  const sphereMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#FFD700", metalness: 1.0, roughness: 0.12, clearcoat: 1.0, clearcoatRoughness: 0.05,
    bumpMap: sphereBumpMap, bumpScale: 0.03, envMapIntensity: 2.5
  }), [sphereBumpMap]);

  const { ornamentData } = useMemo(() => {
    const data = [];
    const goldColor = new THREE.Color("#FFD700");
    const redColor = new THREE.Color("#D40000");
    let sCount = 0; let hCount = 0;

    for (let i = 0; i < ORNAMENT_COUNT; i++) {
      let tPos = randomPointInPineTree(TREE_HEIGHT, TREE_RADIUS * 0.95, TREE_TIERS);
      let type = OrnamentType.SPHERE;
      const rand = Math.random();
      if (rand < 0.1) { type = OrnamentType.HEPTAGRAM; hCount++; }
      else { type = OrnamentType.SPHERE; sCount++; }

      let color = new THREE.Color();
      const baseScale = 0.45 + Math.random() * 0.35;
      if (type === OrnamentType.SPHERE) color.copy(Math.random() > 0.5 ? goldColor : redColor);
      
      data.push({
        id: i,
        tPos,
        type,
        color: color.clone(),
        scale: new THREE.Vector3().setScalar(baseScale),
        phase: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 2.0,
        rotationAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
        localIndex: type === OrnamentType.SPHERE ? sCount - 1 : hCount - 1
      });
    }
    return { ornamentData: data, sCount, hCount };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y += 0.002;
    if (heptagramMaterial) heptagramMaterial.emissiveIntensity = 2.0 + Math.sin(time * 2) * 1.0;

    ornamentData.forEach((orn) => {
      dummy.position.copy(orn.tPos);
      if (orn.type === OrnamentType.SPHERE) {
        dummy.rotateOnAxis(orn.rotationAxis, time * orn.rotSpeed + orn.phase);
        dummy.scale.copy(orn.scale).multiplyScalar(1 + Math.sin(time * 2 + orn.phase) * 0.05);
        dummy.updateMatrix();
        sphereMeshRef.current?.setMatrixAt(orn.localIndex, dummy.matrix);
      } else {
        dummy.lookAt(0, orn.tPos.y, 0);
        dummy.rotateY(Math.PI);
        dummy.scale.copy(orn.scale).multiplyScalar(1.2);
        dummy.updateMatrix();
        heptagramMeshRef.current?.setMatrixAt(orn.localIndex, dummy.matrix);
      }
    });

    if (sphereMeshRef.current) sphereMeshRef.current.instanceMatrix.needsUpdate = true;
    if (heptagramMeshRef.current) heptagramMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  const needleUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uTexture: { value: particleTexture }
  }), [particleTexture]);

  useFrame((state) => {
    needleUniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group ref={groupRef} position={[0, -8, 0]}>
      <SantaHat />
      <points ref={needlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={NEEDLE_COUNT} array={needleData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={NEEDLE_COUNT} array={needleData.colors} itemSize={3} />
          <bufferAttribute attach="attributes-aRandom" count={NEEDLE_COUNT} array={needleData.randoms} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={needleUniforms}
          vertexShader={`
            uniform float uTime;
            attribute vec3 color;
            attribute float aRandom;
            varying vec3 vColor;
            varying float vSparkle;
            void main() {
              vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * mvPos;
              gl_PointSize = 0.12 * (250.0 / -mvPos.z);
              vColor = color;
              float sh = sin(uTime * 3.0 + aRandom * 20.0);
              vSparkle = pow(max(0.0, sh), 4.0);
            }
          `}
          fragmentShader={`
            uniform sampler2D uTexture;
            varying vec3 vColor;
            varying float vSparkle;
            void main() {
              vec4 tex = texture2D(uTexture, gl_PointCoord);
              if (tex.a < 0.5) discard;
              gl_FragColor = vec4(mix(vColor, vec3(1.0, 1.0, 0.8), vSparkle * 0.6), 0.9);
            }
          `}
        />
      </points>
      <instancedMesh ref={sphereMeshRef} args={[undefined, undefined, ORNAMENT_COUNT]} material={sphereMaterial}>
        <sphereGeometry args={[1, 32, 32]} />
      </instancedMesh>
      <instancedMesh ref={heptagramMeshRef} args={[undefined, undefined, ORNAMENT_COUNT]} geometry={heptagramGeometry} material={heptagramMaterial} />
    </group>
  );
};
