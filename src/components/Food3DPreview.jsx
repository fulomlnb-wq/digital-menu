import { Component, memo, Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { TextureLoader } from 'three'
import MenuImage from './MenuImage'
import { resolveImageSrc } from '../utils/images'

function FoodPlate({ imageUrl }) {
  const groupRef = useRef()
  const texture = useLoader(TextureLoader, imageUrl)

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35
  })

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial color="#1a1a1c" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.55, 0.5, 0.06, 24]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.12, 24]} />
        <meshStandardMaterial map={texture} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.15, 12, 12]} />
      <meshStandardMaterial color="#e85d04" wireframe />
    </mesh>
  )
}

class PreviewErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

function Scene({ imageUrl }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.2, 2.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      frameloop="always"
    >
      <color attach="background" args={['#0a0a0b']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 2]} intensity={0.9} />
      <Suspense fallback={<Loader />}>
        <FoodPlate imageUrl={imageUrl} />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  )
}

function Food3DPreview({ item }) {
  const imageUrl = resolveImageSrc(item)
  const fallback = (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-elevated">
      <MenuImage item={item} className="h-full w-full object-cover" />
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[10px] text-muted">
        Dish preview
      </p>
    </div>
  )

  return (
    <PreviewErrorBoundary fallback={fallback}>
      <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900 to-black">
        <Scene imageUrl={imageUrl} />
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[10px] text-white/50">
          Drag to rotate · Table preview
        </p>
      </div>
    </PreviewErrorBoundary>
  )
}

export default memo(Food3DPreview)
