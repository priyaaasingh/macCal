import React, { useState } from 'react';
import './App.css';
import ConfettiExplosion from 'react-confetti-explosion';

const App = () => {
  // State variables
  const [input, setInput] = useState(''); // Input string
  const [result, setResult] = useState(''); // Result of evaluation
  const [showConfetti, setShowConfetti] = useState(false); // Whether to show confetti animation
  const [memory, setMemory] = useState(0); // Memory storage
  const [radians, setRadians] = useState(true); // Whether in radians mode
  const [toggleSecond, setToggleSecond] = useState(false); // Second function mode toggle

  // Handle button click events
  const handleButtonClick = (value) => {
    if (value === 'AC') {
      // Clear input and result
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      // Delete the last character from input
      setInput(input.slice(0, -1));
    } else if (value === '=') {
      try {
        // Evaluate the input expression
        const res = evaluate(input);
        setResult(res.toString());
        // Show confetti if the input includes '3' and '4'
        if (input.includes('3') && input.includes('4')) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
        }
      } catch (error) {
        setResult('Error');
      }
    } else if (value === '+/-') {
      setInput((parseFloat(input) * -1).toString());
    } else if (value === '%') {
      setInput((parseFloat(input) / 100).toString());
    } else if (value === 'MC') {
      // Clear memory
      setMemory(0);
    } else if (value === 'M+') {
      setMemory(memory + parseFloat(result || input));
    } else if (value === 'M-') {
      setMemory(memory - parseFloat(result || input));
    } else if (value === 'MR') {
      setInput(memory.toString());
    } else if (value === 'Rand') {
      const randomValue = Math.random().toFixed(4); // Limit to 4 decimal places
      setInput(input + randomValue);
    } else if (value === 'Rad') {
      setRadians(!radians);
    } else if (value === '2^nd') {
      setToggleSecond(!toggleSecond);
    } else {
      setInput(input + value);
    }
  };

  // Evaluate the input expression
  const evaluate = (expression) => {
    // Replace symbols and functions with JavaScript equivalents
    expression = expression.replace(/÷/g, '/').replace(/X/g, '*');
    expression = expression.replace(/sin/g, radians ? 'Math.sin' : 'Math.sinDeg')
      .replace(/cos/g, radians ? 'Math.cos' : 'Math.cosDeg')
      .replace(/tan/g, radians ? 'Math.tan' : 'Math.tanDeg')
      .replace(/log₁₀/g, 'Math.log10')
      .replace(/ln/g, 'Math.log')
      .replace(/√/g, 'Math.sqrt')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/Rand/g, 'Math.random()')
      .replace(/\^/g, '**')
      .replace(/xʸ/g, '**');

    // Define functions for degree-based trigonometric functions
    const sinDeg = (x) => Math.sin(x * (Math.PI / 180));
    const cosDeg = (x) => Math.cos(x * (Math.PI / 180));
    const tanDeg = (x) => Math.tan(x * (Math.PI / 180));

    // Evaluate the expression using JavaScript's Function constructor
    return Function('"use strict";return (' + expression + ')')();
  };

  // Buttons layout
  const buttons = [
    ['(', ')', 'MC', 'M+', 'M-', 'MR', 'AC', '+/-', '%', '/'],
    ['2^nd', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ', '7', '8', '9', '*'],
    ['¹/x', '²√x', '³√x', 'ʸ√x', 'ln', 'log₁₀', '4', '5', '6', '-'],
    ['x!', 'sin', 'cos', 'tan', 'e', 'EE', '1', '2', '3', '+'],
    ['Rad', 'sinh', 'cosh', 'tanh', 'π', 'Rand', '0', '0', '.', '='],
  ];

  // Render the calculator UI
  return (
    <div className="calculator">
      <div className="display">
        <div className="mac-buttons">
          <button className="mac-button red"></button>
          <button className="mac-button yellow"></button>
          <button className="mac-button green"></button>
        </div>
        <div>{result !== '' ? result : (input || "0")}</div>
      </div>
      <div className="buttons">
        {buttons.map((row, rowIndex) => (
          <div key={rowIndex} className="button-row">
            {row.map((btn, index) => {
              let buttonClass = 'button';
              // Set button class based on type
              if (['/', '*', '-', '+', '='].includes(btn)) {
                buttonClass += ' orange'; // Operator buttons
              } else if (/^[0-9.]$/.test(btn)) {
                buttonClass += ' light'; // Numeric buttons
              }

              return (
                <button
                  key={btn + index} // Unique key for React
                  className={buttonClass}
                  onClick={() => handleButtonClick(btn)} // Handle click event
                >
                  {btn}
                </button>
              );
            })}
          </div>
        ))}
        {showConfetti && <ConfettiExplosion />} {}
      </div>
    </div>
  );
};

export default App;
