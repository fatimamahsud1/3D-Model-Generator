import React from 'react';
import { Text } from '@react-three/drei';

const VerticalStackBox = ({ position, text, isLast, totalBoxes }) => {
  const boxWidth = 0.9;
  const boxHeight = 0.7;
  const boxDepth = 0.9;
  const lineThickness = 0.02; // Thickness of the separator line

  return (
    <group position={position}>
      {/* Render the box index outside the box on the left side */}
      {/* Render the box */}
      <mesh>
        <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
        <meshStandardMaterial color={'purple'} /> {/* Customize color as needed */}

        {/* Render the text inside the box at the center */}
        <Text
          position={[0, 0, boxDepth / 2 + 0.05]}
          fontSize={0.29}
          color={'black'}
          anchorX="center" // Center align text horizontally
          anchorY="middle" // Center align text vertically
        >
          {text}
        </Text>
      </mesh>

      {/* Render the separator line at the bottom of the box */}
      <mesh position={[0, -boxHeight / 2, 0]}>
        <boxGeometry args={[boxWidth, lineThickness, boxDepth]} />
        <meshBasicMaterial color={'black'} />
      </mesh>

      {/* Conditionally render "Top" text on the right side of the last box */}
      {isLast && (
        <Text
          position={[boxWidth / 2 + 0.3, 0, boxDepth / 2 + 0.05]}
          fontSize={0.25}
          color={'white'}
          anchorX="left" // Align text to the left
        >
          Top
        </Text>
      )}
     
      
    </group>
  );
};

export default VerticalStackBox;
