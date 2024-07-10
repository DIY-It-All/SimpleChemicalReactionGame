import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { Cylinder, Box } from "@react-three/drei";
import * as THREE from "three"; 
import styles from './app.module.css'; 

const colorList = {
  CaO: "#2ECC71",
  H2O: "#2ECC71",
  "Ca(OH)2": "#2ECC71",

  C: "#ABB2B9",
  O2: "#ABB2B9",
  CO2: "#ABB2B9",

  Fe: "#F5B041",
  S: "#F5B041",
  FeS: "#F5B041",

  N2: "#8E44AD",
  "3H2": "#8E44AD",
  "2NH3": "#8E44AD",

  "2Na": "#2471A3",
  Cl2: "#2471A3",
  "2NaCl": "#2471A3",

  O: "#E74C3C",
  "4K": "#E74C3C",
  "2K2O": "#E74C3C",
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

  const selectedIndex =
    (elements.length -
      Math.round(rotation / (Math.PI / (elements.length / 2)))) %
    elements.length;

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
    ["CaO", "C", "Fe", "N2", "2Na","4K"],
    ["H2O", "CO2", "S", "3H2", "Cl2","O"],
    ["Ca(OH)2", "CaCO3", "FeS", "2NH3", "2NaCl","2K2O"],
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
      "CaO+H2O=Ca(OH)2":
        "CaO + H2O → Ca(OH)2 (Calcium hydroxide formation)\nCalcium oxide reacts with water to form calcium hydroxide, also known as slaked lime.",
      "C+O2=CO2":
        "C + O2 → CO2 (Carbon dioxide formation)\nCarbon burns in oxygen to form carbon dioxide. This is a common combustion reaction.",
      "Fe+S=FeS":
        "Fe + S → FeS (Iron sulfide formation)\nIron reacts with sulfur to form iron sulfide, a compound commonly found in minerals like pyrite.",
      "N2+3H2=2NH3":
        "N2 + 3H2 → 2NH3 (Ammonia formation)\nNitrogen gas reacts with hydrogen gas under high pressure and temperature to form ammonia.",
      "2Na+Cl2=2NaCl":
        "2Na + Cl2 → 2NaCl (Sodium chloride formation)\nSodium metal reacts vigorously with chlorine gas to form sodium chloride, common table salt.",
      "4K+O=2K2O":
        "4K + O → 2K2O (Potassium oxide formation)\nPotassium metal reacts with oxygen gas to form potassium oxide, a basic compound used in glass production."
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
        <span className={styles.heading}>Chemistry Equation Puzzle</span>
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
