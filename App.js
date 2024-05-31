import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { FIRESTORE_DB } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CustomBox, Arrow, DoubleArrow } from "./3DLinkedList"; // Import DoubleArrow for doubly linked list
import * as THREE from "three";
import VerticalStackBox from "./VerticalStackBox";
import QueueBox from "./QueueBox";
import ArrayBox from "./ArrayBox";
import { Text } from "@react-three/drei";

export default function App() {
  const [linkedListName, setLinkedListName] = useState("");
  const [totalBoxes, setTotalBoxes] = useState(0);
  const [boxValues, setBoxValues] = useState([]);

  const fetchData = async () => {
    try {
      const docRef = doc(FIRESTORE_DB, "model", "123456");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { data } = docSnap.data();
        const { linkedListName, totalBoxes, values } = extractDataValues(data);
        setLinkedListName(linkedListName);
        setTotalBoxes(totalBoxes);
        setBoxValues(values);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  const extractDataValues = (data) => {
    const regex =
      /Linked_List_name[:=]\s*([^,]+),?\s*Total_boxes[:=]\s*(\d+),?\s*(Value_\d+[:=]\s*\d+,?)*/gi;
    const match = regex.exec(data);

    if (!match) {
      throw new Error("Invalid data format");
    }

    const linkedListName = match[1].trim();
    const totalBoxes = parseInt(match[2]);

    const values = [];
    for (let i = 1; i <= totalBoxes; i++) {
      const valueMatch = data.match(
        new RegExp(`Value_${i}[:=]\\s*(\\d+)`, "i")
      );
      const value = valueMatch ? parseInt(valueMatch[1]) : 0;
      values.push(value);
    }

    return { linkedListName, totalBoxes, values };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderBoxesAndArrows = () => {
    const elements = [];

    const boxWidth = linkedListName.toLowerCase() === "queue" ? 0.7 : 3.5;
    const lineThickness = linkedListName.toLowerCase() === "queue" ? 0.02 : 0.1;
    const xOffset = -7;
    for (let i = 0; i < totalBoxes; i++) {
      const xPos = i * boxWidth + xOffset;

      const isFirst = i === 0;
      const isLast = i === totalBoxes - 1;
      const boxValue = boxValues[i];
      const boxColor = isFirst ? "orange" : isLast ? "green" : "purple"; // Set box color based on position

      // Render custom box
      elements.push(
        <CustomBox
          linkedListName={linkedListName}
          key={`box-${i}`}
          position={[xPos, 0, 0]}
          shouldRotate={true}
          text={`${boxValue}`}
          color={boxColor}
          isFirst={isFirst}
          isLast={isLast}
        />
      );

      // Render line to separate boxes (except for the last box)
      if (!isLast) {
        const lineXPos = xPos + boxWidth / 2;
        elements.push(
          <mesh
            key={`line-${i}`}
            position={[lineXPos, 0, 0]}
            scale={[lineThickness, 1, 1]}
          >
            <boxGeometry args={[1, lineThickness, lineThickness]} />
            <meshBasicMaterial color="black" />
          </mesh>
        );
      }

      // Render arrows for linked lists (not for the last box)
      if (!isLast && linkedListName.toLowerCase() !== "queue") {
        const arrowX = xPos + boxWidth;

        elements.push(
          linkedListName.toLowerCase() === "singly" ? (
            <Arrow
              key={`arrow-${i}`}
              start={new THREE.Vector3(xPos + 0.3, 0, 0)}
              end={new THREE.Vector3(arrowX, 0, 0)}
              color={i % 2 === 0 ? 0xff0000 : 0x00ff00}
            />
          ) : (
            <DoubleArrow
              key={`double-arrow-${i}`}
              start={new THREE.Vector3(xPos + 0.5, 0, 0)}
              end={new THREE.Vector3(arrowX, 0, 0)}
              color={i % 2 === 0 ? 0xff0000 : 0x00ff00}
            />
          )
        );
      }
    }

    return elements;
  };

  const renderBoxes = () => {
    const elements = [];

    // Determine box dimensions based on linkedListName
    const boxWidth = linkedListName.toLowerCase() === "queue" ? 0.7 : 3.5;

    // Calculate total height of the stack
    const stackHeight = totalBoxes * 0.7; // Use a fixed height for each box (adjust as needed)

    // Position for the first box at the bottom of the stack
    const yPosStart = -stackHeight / 2;

    // Create VerticalStackBox components for each box
    for (let i = 0; i < totalBoxes; i++) {
      const yPos = yPosStart + i * 0.7; // Position each box directly above the previous one

      const isFirst = i === 0;
      const isLast = i === totalBoxes - 1;
      const boxValue = boxValues[i];
      const boxColor = isFirst ? "purple" : isLast ? "green" : "purple";

      // Render VerticalStackBox component
      elements.push(
        <VerticalStackBox
          key={`box-${i}`}
          position={[0, yPos, 0]}
          text={`${boxValue}`}
          isFirst={isFirst}
          isLast={isLast}
          totalBoxes={totalBoxes}
        />
      );
    }

    return elements;
  };

  const renderQueue = () => {
    const elements = [];

    for (let i = 0; i < totalBoxes; i++) {
      const isFirst = i === 0;
      const isLast = i === totalBoxes - 1;
      const boxValue = boxValues[i];

      // Determine position for each box
      const xPos = i * 0.7; // Adjust based on desired spacing

      // Render QueueBox component
      elements.push(
        <QueueBox
          key={`box-${i}`}
          position={[xPos, 0, 0]}
          text={`${boxValue}`}
          isFirst={isFirst}
          isLast={isLast}
        />
      );
    }

    return elements;
  };

  const renderArray = () => {
    const elements = [];

    // Calculate total width of the array
    const totalWidth = totalBoxes * 0.7; // Use a fixed width for each box (adjust as needed)

    // Create ArrayBox components for each box
    for (let i = 0; i < totalBoxes; i++) {
      const boxValue = boxValues[i];

      // Calculate the x-position for each box to ensure they are tightly connected
      const xPos = i * (totalWidth / totalBoxes) - totalWidth / 2;

      // Render ArrayBox component
      elements.push(
        <ArrayBox
          key={`box-${i}`}
          position={[xPos, 0, 0]}
          text={`${boxValue}`}
          index={i}
        />
      );
    }

    return elements;
  };

  return (
    <View style={styles.container}>
      <Canvas
        style={{ height: "100vh", width: "100vw" }}
        camera={{ position: [0, 0, 7] }}
      >
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />

        {/* Render boxes and arrows based on the fetched linkedListName */}
        {linkedListName.toLowerCase() === "stack" && renderBoxes()}
        {linkedListName.toLowerCase() === "singly" && renderBoxesAndArrows()}
        {linkedListName.toLowerCase() === "doubly" && renderBoxesAndArrows()}
        {linkedListName.toLowerCase() === "queue" && renderQueue()}
        {linkedListName.toLowerCase() === "array" && renderArray()}

        <OrbitControls />

        <Text
          fontSize={0.4}
          color={"white"}
          anchorX="left"
          position={[-1, -3, 0]}
        >
          {linkedListName.toLowerCase() === "singly"
            ? "Singly Linked List"
            : linkedListName.toLowerCase() === "doubly"
            ? "Doubly Linked List"
            : linkedListName.toLowerCase() === "queue"
            ? "Queue Data Structure"
            : linkedListName.toLowerCase() === "stack"
            ? "Stack Data Structure"
            : "Array Data Structure"}
        </Text>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
