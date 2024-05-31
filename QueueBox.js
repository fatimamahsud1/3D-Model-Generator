import React from 'react';
import { Text } from '@react-three/drei';

const QueueBox = ({ position, text, isFirst, isLast }) => {
  const boxWidth = 0.7;
  const boxHeight = 0.9;
  const boxDepth = 0.9;
  const lineThickness = 0.02;

  return (
    <group position={position}>
      {/* Render the box */}
      <mesh>
        <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
        <meshStandardMaterial color={isFirst ? 'orange' : isLast ? 'green' : 'purple'} />
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

      {/* Render "head" on top of the first box */}
      {isFirst && (
        <Text position={[0, boxHeight / 2 + 0.3, 0]} fontSize={0.27} color={'white'} anchorX="center">
          Head
        </Text>
      )}

      {/* Render "tail" on top of the last box */}
      {isLast && (
        <Text position={[0, boxHeight / 2 + 0.3, 0]} fontSize={0.27} color={'white'} anchorX="center">
          Tail
        </Text>
      )}
    </group>
  );
};

export default QueueBox;
