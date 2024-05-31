import React, { useRef, useEffect } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export function CustomBox({
  position,
  shouldRotate,
  number,
  text,
  linkedListName,
  isFirst,
  isLast,
}) {
  const groupRef = useRef();

  useEffect(() => {
    const animateRotation = () => {
      if (shouldRotate && groupRef.current) {
        groupRef.current.rotation.y += 0.01; // Rotate the box group
      }
      requestAnimationFrame(animateRotation);
    };

    console.log("linkedListName:", linkedListName); // Check if prop is received correctly

    console.log("linkedListName:", linkedListName); // Check if prop is received correctly

    // Start rotation animation loop
    // animateRotation();

    return () => {
      // Cleanup function (optional)
    };
  }, [linkedListName]);

  return (
    <group ref={groupRef} position={position}>
      {/* Render different box structures based on linkedListName */}
      {linkedListName.toLowerCase() === "doubly" && (
        // Doubly linked list box structure
        <>
          <mesh position={[-0.7, 0, 0]}>
            <boxGeometry args={[0.7, 0.9, 0.9]} />
            <meshStandardMaterial color={"blue"} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.7, 0.9, 0.9]} />
            <meshStandardMaterial color={"orange"} />
          </mesh>
          <mesh position={[0.7, 0, 0]}>
            <boxGeometry args={[0.7, 0.9, 0.9]} />
            <meshStandardMaterial color={"green"} />
          </mesh>
          <Text position={[-0.7, 0, 0.6]} fontSize={0.17} color={"black"}>
            {isFirst ? "Null" : "prev"}
          </Text>
          <Text position={[0, 0, 0.6]} fontSize={0.2} color={"black"}>
            {text}
          </Text>
          <Text position={[0.7, 0, 0.6]} fontSize={0.17} color={"black"}>
            {isLast ? "Null" : "next"}
          </Text>
        </>
      )}

      {linkedListName.toLowerCase() === "singly" && (
        // Singly linked list box structure (similar to doubly for this example)
        <>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.7, 0.9, 0.9]} />
            <meshStandardMaterial color={"orange"} />
          </mesh>
          <mesh position={[0.7, 0, 0]}>
            <boxGeometry args={[0.7, 0.9, 0.9]} />
            <meshStandardMaterial color={"green"} />
          </mesh>
          <Text position={[0, 0, 0.6]} fontSize={0.2} color={"black"}>
            {text}
          </Text>
          <Text position={[0.7, 0, 0.6]} fontSize={0.17} color={"black"}>
            {isLast ? "Null" : "next"}
          </Text>
        </>
      )}

      {linkedListName.toLowerCase() === "queue" && (
        // Queue box structure (simplified for queue items)
        <>
          {/* Box representing the main content */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.7, 0.9, 0.9]} />
            <meshStandardMaterial
              color={isFirst ? "orange" : isLast ? "green" : "purple"}
            />
          </mesh>

          {/* Vertical black line to separate boxes */}
          {isLast ? null : (
            <mesh position={[0.35, 0, 0]} scale={[0.02, 0.9, 0.9]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={"black"} />
            </mesh>
          )}

          {/* Text on top of the box */}
          <Text position={[0, 0, 0.6]} fontSize={0.2} color={"black"}>
            {text}
          </Text>
        </>
      )}
      
    </group>
  );
}

export default CustomBox;

export function Arrow({ start, end, color }) {
  const arrow = useRef();

  useEffect(() => {
    const updateArrow = () => {
      if (arrow.current) {
        const dir = new THREE.Vector3();
        const distance = end.clone().sub(start);
        const length = distance.length();
        dir.copy(distance).normalize();
        arrow.current.setDirection(dir);
        arrow.current.position.copy(start).add(distance.multiplyScalar(0.5)); // Position arrow midway
        arrow.current.setLength(length * 0.3, 0.1, 0.1); // Set arrow length
      }
      requestAnimationFrame(updateArrow);
    };

    updateArrow(); // Start arrow update loop

    return () => {
      // Cleanup function (optional)
    };
  }, [start, end]);

  return (
    <arrowHelper
      ref={arrow}
      args={[new THREE.Vector3(), new THREE.Vector3(0, 1, 0), color]}
    />
  );
}

export function DoubleArrow({ start, end, color }) {
  const arrow1 = useRef();
  const arrow2 = useRef();

  useEffect(() => {
    const updateArrows = () => {
      if (arrow1.current && arrow2.current) {
        const direction = new THREE.Vector3().copy(end).sub(start).normalize();
        const length = new THREE.Vector3().copy(end).sub(start).length();

        // Calculate offset vector (adjust as needed)
        const offset = new THREE.Vector3(0.1, 0.1, 0.1); // Offset to position arrows away from box sides

        // Position Arrow 1
        const arrow1Position = new THREE.Vector3().copy(start).add(offset);
        arrow1.current.setDirection(direction);
        arrow1.current.position.copy(arrow1Position);
        arrow1.current.setLength(length * 0.6, 0.1, 0.1);

        // Position Arrow 2 (opposite direction)
        const arrow2Position = new THREE.Vector3().copy(end).sub(offset);
        arrow2.current.setDirection(direction.clone().negate());
        arrow2.current.position.copy(arrow2Position);
        arrow2.current.setLength(length * 0.7, 0.1, 0.1);
      }

      requestAnimationFrame(updateArrows);
    };

    updateArrows();

    return () => {
      // Cleanup function
    };
  }, [start, end]);

  return (
    <>
      {/* Arrow 1 */}
      <arrowHelper
        ref={arrow1}
        args={[new THREE.Vector3(), new THREE.Vector3(1, 0, 0), color]}
      />

      {/* Arrow 2 (opposite direction) */}
      <arrowHelper
        ref={arrow2}
        args={[new THREE.Vector3(), new THREE.Vector3(1, 0, 0), color]}
      />
    </>
  );
}
