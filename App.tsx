
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { BackgroundTree } from './components/BackgroundTree';
import { AnnouncementBoard } from './components/AnnouncementBoard';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-[#050505]">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 45], fov: 40 }}
          dpr={[1, 2]}
          shadows
        >
          <color attach="background" args={['#050505']} />
          
          <ambientLight intensity={0.4} />
          <spotLight position={[20, 20, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <pointLight position={[10, 5, 10]} color="#FFD700" intensity={1.5} />

          <Suspense fallback={null}>
            <BackgroundTree />
            <ContactShadows opacity={0.4} scale={50} blur={2.5} far={40} />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10">
        <AnnouncementBoard />
      </div>

      {/* Subtle vignettes / glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
    </div>
  );
};

export default App;
