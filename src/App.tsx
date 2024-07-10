import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { Cylinder, Box } from "@react-three/drei";
import * as THREE from "three";
// EB984E
//
const colorList = {
  Na: "#AED6F1",
  H: "#EB984E",
  Cl: "#AED6F1",
  Zn: "#34eb30",
  O: "#40E0D0",
  C: "#40E0D0",
  H2: "#34eb60",
  O2: "#EB984E",
  Cl2: "#34eb00",
  N2: "#34eb90",
  F2: "#344bb0",
  Br2: "#34eba0",
  H2O: "#EB984E",
  NaCl: "#AED6F1",
  CO2: "#111be0",
  NH3: "#34eb4f",
  CH4: "#34f000",
  HCl: "#34efc4",
};
const ChemicalRing = ({ position, elements, setRotation, index, rotation }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((the) => {
    ref.current.rotation.x = rotation;
    ref.current.children.forEach((e, i) => {
      if (i == 0) {
        return;
      }
      e.children[0].lookAt(the.camera.position);
    });
  });

  const rotate = () => {
    setRotation(index, (rotation - Math.PI / 3 + 2 * Math.PI) % (2 * Math.PI));
  };

  const selectedIndex = (elements.length - Math.round(rotation / (Math.PI / (elements.length / 2)))) % elements.length;

  return (
    <group ref={ref} position={position}>
      <Cylinder
        args={[0.8, 0.8, 0.4, elements.length]}
        rotation-z={Math.PI / 2}
        onClick={rotate}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={
            hovered
              ? new THREE.Color("#40E0D0").lerp(new THREE.Color(0, 0, 0), 0.5)
              : new THREE.Color("#40E0D0").lerp(new THREE.Color(0, 0, 0), 0.3)
          }
        />
      </Cylinder>
      {elements.map((element, i) => (
        <group key={i} rotation-x={(i * Math.PI) / (elements.length / 2)}>
          <Text
            position={[0, 0.9, 0]}
            rotation-y={-Math.PI / 2}
            fontSize={0.2}
            color={colorList[element]}
          >
            {element}
          </Text>

          <Box args={[0.4, 0.1, 0.1]} position={[0, 1.1, 0]}>
            <meshBasicMaterial
              color={colorList[element]}
              opacity={i === selectedIndex ? 1 : 0.2}
              transparent
            />
          </Box>
        </group>
      ))}
    </group>
  );
};

const EquationSign = ({ position, sign }) => {
  const ref = useRef();
  useFrame(({ gl, scene, camera }) => {
    ref.current.lookAt(camera.position);
  });
  return (
    <Text ref={ref} position={position} fontSize={0.5} color="white">
      {sign}
    </Text>
  );
};
const Scene = ({ setEquationMessage }) => {
  const [rotations, setRotations] = useState([0, 0, 0]);
  // useThree((ther) => {
  //   const Texloader = new THREE.CubeTextureLoader();
  //   const texture = Texloader.load([
  //     "./img/night_ft.png",
  //     "./img/night_bk.png",
  //     "./img/night_up.png",
  //     "./img/night_dn.png",
  //     "./img/night_rt.png",
  //     "./img/night_lf.png",
  //   ]);
  //   ther.scene.background = texture;
  // });
  const setRotation = (index, angle) => {
    const newRotations = [...rotations];
    newRotations[index] = angle;
    setRotations(newRotations);
  };

  useEffect(() => {
    checkEquation();
  }, [rotations]);

  const elements = [
    ["CaO", "Ca(OH)2", "C", "Fe", "N2", "2Na"],
    ["H2O", "O2", "CO2", "S", "3H2", "Cl2"],
    ["Ca(OH)2", "CO2", "CaCO3", "FeS", "2NH3", "2NaCl"],
  ];
  const checkEquation = () => {
    const getSelectedElement = (rotation, elements) => {
      const index =
        (elements.length -
          Math.round(rotation / (Math.PI / (elements.length / 2)))) %
        elements.length;
      return elements[index];
    };

    const leftElement = getSelectedElement(rotations[0], elements[0]);
    const middleElement = getSelectedElement(rotations[1], elements[1]);
    const rightElement = getSelectedElement(rotations[2], elements[2]);

    const equations = {
      "Na+Cl2=NaCl":
        "2Na + Cl2 → 2NaCl (Sodium chloride formation)\nSodium metal reacts vigorously with chlorine gas to form sodium chloride, common table salt.",
      "H+O2=H2O":
        "2H2 + O2 → 2H2O (Water formation)\nHydrogen gas combusts in oxygen to form water. This reaction releases a large amount of energy.",
      "C+O2=CO2":
        "C + O2 → CO2 (Carbon dioxide formation)\nCarbon burns in oxygen to form carbon dioxide. This is a common combustion reaction.",
      "Zn+O2=ZnO":
        "2Zn + O2 → 2ZnO (Zinc oxide formation)\nZinc metal reacts with oxygen in the air to form zinc oxide, a white powder used in many products.",
    };

    const equationKey = `${leftElement}+${middleElement}=${rightElement}`;
    const message =
      equations[equationKey] || "No valid equation formed yet. Keep trying!";
    setEquationMessage(message);
  };

  let dist = 0.4;
  return (
    <>
      <ambientLight intensity={1.3} />
      {/* <Box args={[1000,0.1,1000]}
      position={[0,-4,0]}>
        <meshBasicMaterial color="#222c36"></meshBasicMaterial>
      </Box> */}
      <pointLight position={[10, 10, 10]} />
      <Cylinder args={[0.2, 0.2, dist * 4, 32]} rotation-z={Math.PI / 2}>
        <meshBasicMaterial color="orange"></meshBasicMaterial>
      </Cylinder>
      <ChemicalRing
        position={[dist * -2, 0, 0]}
        elements={elements[0]}
        setRotation={setRotation}
        index={0}
        rotation={rotations[0]}
      />
      <EquationSign position={[dist * -1, 0.9, 0]} sign="+" />
      <ChemicalRing
        position={[dist * 0, 0, 0]}
        elements={elements[1]}
        setRotation={setRotation}
        index={1}
        rotation={rotations[1]}
      />
      <EquationSign position={[dist * 1, 0.9, 0]} sign="=" />
      <ChemicalRing
        position={[dist * 2, 0, 0]}
        elements={elements[2]}
        setRotation={setRotation}
        index={2}
        rotation={rotations[2]}
      />
      <OrbitControls />
    </>
  );
};

const ChemistryPuzzleGame = () => {
  const [equationMessage, setEquationMessage] = useState(
    "Rotate the rings to form a chemical equation!"
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <Scene setEquationMessage={setEquationMessage} />
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          color: "white",
          maxWidth: "300px",
        }}
      >
        <h1>Chemistry Equation Puzzle</h1>
        <p>Click on the rings to rotate and form correct chemical equations!</p>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          color: "white",
          maxWidth: "300px",
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <p style={{ whiteSpace: "pre-line" }}>{equationMessage}</p>
      </div>
    </div>
  );
};

export default ChemistryPuzzleGame;
