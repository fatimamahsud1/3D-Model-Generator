import React from 'react';
import { Text } from '@react-three/drei';

const ArrayBox = ({ position, text, index, isLast }) => {
  const boxWidth = 0.7;
  const boxHeight = 0.9;
  const boxDepth = 0.9;
  const totalBoxes = 10; // Assuming a total number of boxes for positioning calculation

  // Calculate x position based on index to tightly connect boxes horizontally
  const xPos = index * boxWidth - (totalBoxes * boxWidth) / 2 + boxWidth / 2;

  return (
    <group position={[xPos, position[1], position[2]]}>
      {/* Render the box */}
      <mesh>
        <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
        <meshStandardMaterial color={'purple'} />
        <Text
          position={[0, 0, boxDepth / 2 + 0.05]}
          fontSize={0.2}
          color={'black'}
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </mesh>
      {isLast ? null : (
            <mesh position={[0.35, 0, 0]} scale={[0.02, 0.9, 0.9]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={"black"} />
            </mesh>
          )}
      {/* Render index at the bottom */}
      <Text position={[0, -boxHeight / 2 - 0.15, 0]} fontSize={0.2} color={'white'} anchorX="center">
        {index}
      </Text>
    </group>
  );
};

export default ArrayBox;
