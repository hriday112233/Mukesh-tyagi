import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Room } from '../types';

interface Room3DViewProps {
  rooms: Room[];
}

const RoomBlock: React.FC<{ room: Room }> = ({ room }) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    if (room.points.length === 0) return s;
    
    // Convert pixels to meters (10px = 1m)
    // Center the rooms by subtracting the first point or a bounding box center
    // For simplicity, let's just scale them
    s.moveTo(room.points[0].x / 10, -room.points[0].y / 10);
    for (let i = 1; i < room.points.length; i++) {
      s.lineTo(room.points[i].x / 10, -room.points[i].y / 10);
    }
    s.lineTo(room.points[0].x / 10, -room.points[0].y / 10);
    return s;
  }, [room.points]);

  const extrudeSettings = {
    steps: 1,
    depth: 3, // 3 meters high walls
    beveled: false,
  };

  // Calculate center for label
  const center = useMemo(() => {
    let x = 0, y = 0;
    room.points.forEach(p => {
      x += p.x;
      y += p.y;
    });
    return { x: (x / room.points.length) / 10, y: -(y / room.points.length) / 10 };
  }, [room.points]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color={room.color} transparent opacity={0.7} metalness={0.2} roughness={0.5} />
      </mesh>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={room.color} metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Label */}
      <Text
        position={[center.x, 3.5, center.y]}
        fontSize={0.5}
        color="#141414"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 4, 0, 0]}
      >
        {room.name}
      </Text>
    </group>
  );
};

export const Room3DView: React.FC<Room3DViewProps> = ({ rooms }) => {
  // Calculate bounding box to center camera
  const center = useMemo(() => {
    if (rooms.length === 0) return [0, 0, 0];
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    rooms.forEach(room => {
      room.points.forEach(p => {
        minX = Math.min(minX, p.x / 10);
        maxX = Math.max(maxX, p.x / 10);
        minZ = Math.min(minZ, p.y / 10);
        maxZ = Math.max(maxZ, p.y / 10);
      });
    });
    return [(minX + maxX) / 2, 0, (minZ + maxZ) / 2];
  }, [rooms]);

  return (
    <div className="w-full h-full bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden shadow-inner relative">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
        <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live 3D Preview (1:10 Scale)
        </p>
      </div>
      
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[center[0] + 20, 20, center[2] + 20]} fov={40} />
        <OrbitControls 
          target={[center[0], 0, center[2]]} 
          makeDefault 
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={100}
        />
        
        <ambientLight intensity={0.7} />
        <pointLight position={[100, 100, 100]} intensity={1} castShadow />
        <spotLight position={[-100, 100, -100]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <group>
          {rooms.map(room => (
            <RoomBlock key={room.id} room={room} />
          ))}
        </group>

        <gridHelper args={[200, 50, 0xcccccc, 0xeeeeee]} position={[0, -0.02, 0]} />
        <ContactShadows position={[0, -0.03, 0]} opacity={0.4} scale={100} blur={2} far={10} />
        <Environment preset="city" />
      </Canvas>

      <div className="absolute bottom-4 right-4 z-10 bg-zinc-900/10 backdrop-blur-sm p-2 rounded-lg text-[9px] text-zinc-500 font-mono">
        LMB: Rotate | RMB: Pan | Scroll: Zoom
      </div>
    </div>
  );
};
