// premium-portfolio/src/components/skills-sphere.tsx
"use client"

import React, { useRef, useState, useEffect, Suspense } from 'react' // Added React, Suspense
import { Canvas, useFrame, useThree } from '@react-three/fiber' // Added useThree
import { Text, Billboard, OrbitControls, PerspectiveCamera, Preload } from '@react-three/drei' // Added Preload
import { generateSkillsPositions, type Skill } from '@/lib/skills-data'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import * as THREE from 'three'; // Import THREE

interface SkillSphereProps {
  skills: Skill[]
}

function SkillsCloud({ skills }: SkillSphereProps) {
  const positionedSkills = React.useMemo(() => generateSkillsPositions(skills), [skills]); // Memoize positions
  const groupRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { size } = useThree(); // Get canvas size for responsiveness
  const isMobile = size.width < 768; // Basic mobile check

  // Adjust rotation speed based on interaction or preferences
  const rotationSpeed = useRef(0.0005); // Slower base rotation

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Simple mouse follow effect (subtle)
      const targetRotationY = state.pointer.x * 0.1;
      const targetRotationX = state.pointer.y * 0.1;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY + groupRef.current.rotation.y, 0.02);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX + groupRef.current.rotation.x, 0.02);

      // Add constant slow rotation
      groupRef.current.rotation.y += rotationSpeed.current * delta * 60; // Normalize speed with delta
    }
  });

  return (
    <group ref={groupRef}>
      {positionedSkills.map((skill, index) => (
        <SkillNode
          key={skill.name + index} // Use index for potentially duplicate names
          skill={skill}
          position={skill.position as [number, number, number]}
          isDarkMode={isDarkMode}
          delay={index * 0.03} // Slightly faster stagger
          isMobile={isMobile}
        />
      ))}
    </group>
  );
}

interface SkillNodeProps {
  skill: Skill;
  position: [number, number, number];
  isDarkMode: boolean;
  delay: number;
  isMobile: boolean; // Pass mobile flag
}

function SkillNode({ skill, position, isDarkMode, delay, isMobile }: SkillNodeProps) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const sphereRef = useRef<THREE.Mesh>(null!); // Use non-null assertion
  const textRef = useRef<any>(null!); // Ref for text

  // Animate in after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((state) => {
    // Billboard makes text always face camera, but we can add subtle hover effect
    if (textRef.current) {
        textRef.current.material.opacity = THREE.MathUtils.lerp(
            textRef.current.material.opacity,
            hovered ? 1 : 0.8, // Fade slightly when not hovered
            0.1
        );
    }

    // Scale sphere on hover
    if (sphereRef.current) {
      const targetScale = hovered ? 1.3 : 1; // Smaller hover scale
      sphereRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Handle pointer events
  const handlePointerOver = (e: any) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'};
  const handlePointerOut = (e: any) => { setHovered(false); document.body.style.cursor = 'default'};

  if (!visible) return null;

  const sphereSize = isMobile ? 0.15 + (skill.level / 25) : 0.2 + (skill.level / 20); // Smaller spheres on mobile
  const fontSize = isMobile ? 0.18 : 0.25; // Smaller font on mobile
  const textPositionOffset: [number, number, number] = isMobile ? [0, 0.3, 0] : [0, 0.4, 0]; // Adjust text position for smaller spheres
  const textColor = isDarkMode ? '#E5E7EB' : '#1F2937'; // Use Tailwind gray colors for consistency
  const sphereColor = skill.color || (isDarkMode ? '#A78BFA' : '#8B5CF6'); // Default to purple tones

  return (
    <motion.group // Wrap in motion.group for entry animation
       position={position}
       initial={{ scale: 0, opacity: 0 }}
       animate={{ scale: 1, opacity: 1 }}
       transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      {/* Billboard ensures the text always faces the camera */}
      <Billboard>
        <Text
          ref={textRef}
          position={textPositionOffset}
          fontSize={fontSize}
          color={textColor}
          font="/fonts/GeistVariableVF.woff2" // Use Geist font if available
          anchorX="center"
          anchorY="middle"
          material-transparent={true} // Enable opacity changes
          material-opacity={0.8} // Initial opacity
        >
          {skill.name}
        </Text>
      </Billboard>

      <mesh
        ref={sphereRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow // Allow sphere to cast shadow if lights are configured
      >
        <sphereGeometry args={[sphereSize, 32, 32]} />
        <meshStandardMaterial
          color={sphereColor}
          emissive={sphereColor}
          emissiveIntensity={hovered ? 0.5 : 0.15} // Adjusted intensity
          roughness={0.6}
          metalness={0.1} // Add slight metalness
          transparent // Needed if you want fade effects later
          opacity={0.95} // Slightly transparent
        />
      </mesh>
    </motion.group>
  );
}

export function SkillsSphere({ skills }: SkillSphereProps) {
  return (
    <motion.div
      className="w-full h-[450px] md:h-[600px] cursor-grab active:cursor-grabbing" // Adjusted height and cursor
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0, delay: 0.2 }} // Longer fade-in
    >
      <Canvas shadows> {/* Enable shadows */}
        {/* Adjust lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
        />
         <pointLight position={[-5, -5, -10]} intensity={0.3} />


        <Suspense fallback={null}> {/* Suspense for async operations like font loading */}
           <SkillsCloud skills={skills} />
        </Suspense>

        <OrbitControls
          enableZoom={false} // Keep zoom disabled
          enablePan={false}
          enableRotate={true} // Allow user rotation
          rotateSpeed={0.4} // Slightly slower user rotation
          autoRotate={true} // Keep auto-rotate
          autoRotateSpeed={0.3} // Slower auto-rotate
          minPolarAngle={Math.PI / 4} // Limit vertical rotation
          maxPolarAngle={3 * Math.PI / 4}
        />
        {/* Use default camera or adjust if needed */}
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
        <Preload all /> {/* Preload assets */}
      </Canvas>
    </motion.div>
  );
}