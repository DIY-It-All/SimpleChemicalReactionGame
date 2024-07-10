import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

const ChemicalRing = ({ position, elements, setRotation, index, rotation }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    ref.current.rotation.x = rotation;
  });

  const rotate = () => {
    setRotation(index, (rotation - Math.PI / 3 + 2 * Math.PI) % (2 * Math.PI));
  };

  const selectedIndex = (6 - Math.round(rotation / (Math.PI / 3))) % 6;

  return (
    <group ref={ref} position={position}>
      <Cylinder 
        args={[0.8, 0.8, 0.2, 32]} 
        rotation-z={Math.PI / 2}
        onClick={rotate}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </Cylinder>
      {elements.map((element, i) => (
        <group key={i} rotation-x={i * Math.PI / 3}>
          <Text
            position={[0, 0.9, 0]}
            rotation-y={-Math.PI / 2}
            fontSize={0.2}
            color={i === selectedIndex ? 'yellow' : 'white'}
          >
            {element}
          </Text>
          {i === selectedIndex && (
            <Box args={[0.4, 0.1, 0.1]} position={[0, 1.1, 0]}>
              <meshBasicMaterial color="yellow" />
            </Box>
          )}
        </group>
      ))}
    </group>
  );
};

const EquationSign = ({ position, sign }) => (
  <Text position={position} fontSize={0.5} color="white">
    {sign}
  </Text>
);

const Scene = ({ setEquationMessage }) => {
  const [rotations, setRotations] = useState([0, 0, 0]);

  const setRotation = (index, angle) => {
    const newRotations = [...rotations];
    newRotations[index] = angle;
    setRotations(newRotations);
  };

  useEffect(() => {
    checkEquation();
  }, [rotations]);

  const checkEquation = () => {
    const getSelectedElement = (rotation, elements) => {
      const index = (6 - Math.round(rotation / (Math.PI / 3))) % 6;
      return elements[index];
    };

    const leftElement = getSelectedElement(rotations[0], ['Na', 'H', 'Cl', 'Zn', 'O', 'C']);
    const middleElement = getSelectedElement(rotations[1], ['H2', 'O2', 'Cl2', 'N2', 'F2', 'Br2']);
    const rightElement = getSelectedElement(rotations[2], ['H2O', 'NaCl', 'CO2', 'NH3', 'CH4', 'HCl']);

    const equations = {
      'Na+Cl2=NaCl': "2Na + Cl2 → 2NaCl (Sodium chloride formation)\nSodium metal reacts vigorously with chlorine gas to form sodium chloride, common table salt.",
      'H+O2=H2O': "2H2 + O2 → 2H2O (Water formation)\nHydrogen gas combusts in oxygen to form water. This reaction releases a large amount of energy.",
      'C+O2=CO2': "C + O2 → CO2 (Carbon dioxide formation)\nCarbon burns in oxygen to form carbon dioxide. This is a common combustion reaction.",
      'Zn+O2=ZnO': "2Zn + O2 → 2ZnO (Zinc oxide formation)\nZinc metal reacts with oxygen in the air to form zinc oxide, a white powder used in many products.",
    };

    const equationKey = `${leftElement}+${middleElement}=${rightElement}`;
    const message = equations[equationKey] || "No valid equation formed yet. Keep trying!";
    setEquationMessage(message);
  };

  const elements = [
    ['Na', 'H', 'Cl', 'Zn', 'O', 'C'],
    ['H2', 'O2', 'Cl2', 'N2', 'F2', 'Br2'],
    ['H2O', 'NaCl', 'CO2', 'NH3', 'CH4', 'HCl']
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ChemicalRing position={[-2.5, 0, 0]} elements={elements[0]} setRotation={setRotation} index={0} rotation={rotations[0]} />
      <EquationSign position={[-1.25, 0, 0]} sign="+" />
      <ChemicalRing position={[0, 0, 0]} elements={elements[1]} setRotation={setRotation} index={1} rotation={rotations[1]} />
      <EquationSign position={[1.25, 0, 0]} sign="=" />
      <ChemicalRing position={[2.5, 0, 0]} elements={elements[2]} setRotation={setRotation} index={2} rotation={rotations[2]} />
      <OrbitControls />
    </>
  );
};

const ChemistryPuzzleGame = () => {
  const [equationMessage, setEquationMessage] = useState("Rotate the rings to form a chemical equation!");

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 7] }}>
        <Scene setEquationMessage={setEquationMessage} />
      </Canvas>
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', maxWidth: '300px' }}>
        <h1>Chemistry Equation Puzzle</h1>
        <p>Click on the rings to rotate and form correct chemical equations!</p>
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'white', maxWidth: '300px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '5px' }}>
        <p style={{ whiteSpace: 'pre-line' }}>{equationMessage}</p>
      </div>
    </div>
  );
};

export default ChemistryPuzzleGame;