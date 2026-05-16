import { Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, useTexture } from '@react-three/drei'

/** Rotating plate with food texture — pseudo-AR table preview */
function FoodPlate({ imageUrl }) {
  const groupRef = useRef()
  const texture = useTexture(imageUrl)

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4
  })

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} receiveShadow>
        <circleGeometry args={[1.8, 64]} />
        <meshStandardMaterial color="#1a1a1c" roughness={0.85} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.5, 0.06, 48]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.12, 48]} />
        <meshStandardMaterial map={texture} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.008, 16, 64]} />
        <meshBasicMaterial color="#e85d04" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#e85d04" wireframe />
    </mesh>
  )
}

export default function Food3DPreview({ imageUrl }) {
  return (
    <motion.div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900 to-black">
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 2.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a0a0b']} />
        <ambientLight intensity={0.4} />
        <spotLight position={[3, 5, 2]} intensity={1.2} castShadow angle={0.4} penumbra={0.5} />
        <pointLight position={[-2, 2, -1]} intensity={0.5} color="#ff8c42" />
        <Suspense fallback={<Loader />}>
          <FoodPlate imageUrl={imageUrl} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[10px] text-white/40">
        Drag to rotate · Table preview
      </p>
    </motion.div>
  )
}
