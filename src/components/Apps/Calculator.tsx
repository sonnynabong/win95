import React, { useState } from 'react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const sqrt = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.sqrt(value)));
    setWaitingForOperand(true);
  };

  const inverse = () => {
    const value = parseFloat(display);
    setDisplay(String(1 / value));
    setWaitingForOperand(true);
  };

  const Button = ({ 
    label, 
    onClick, 
    className = '',
    wide = false 
  }: { 
    label: string; 
    onClick: () => void; 
    className?: string;
    wide?: boolean;
  }) => (
    <button
      className={`win95-button ${wide ? 'flex-1' : 'w-10'} h-8 text-sm font-bold ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-2">
      {/* Display */}
      <div className="win95-border-sunken bg-white p-2 mb-3 text-right">
        <div className="font-mono text-2xl truncate">{display}</div>
      </div>

      {/* Keypad */}
      <div className="flex flex-col gap-1">
        {/* Row 1 */}
        <div className="flex gap-1">
          <Button label="MC" onClick={clear} />
          <Button label="7" onClick={() => inputNumber('7')} />
          <Button label="8" onClick={() => inputNumber('8')} />
          <Button label="9" onClick={() => inputNumber('9')} />
          <Button label="/" onClick={() => performOperation('/')} />
          <Button label="sqrt" onClick={sqrt} />
        </div>

        {/* Row 2 */}
        <div className="flex gap-1">
          <Button label="MR" onClick={clearEntry} />
          <Button label="4" onClick={() => inputNumber('4')} />
          <Button label="5" onClick={() => inputNumber('5')} />
          <Button label="6" onClick={() => inputNumber('6')} />
          <Button label="*" onClick={() => performOperation('*')} />
          <Button label="%" onClick={() => performOperation('%')} />
        </div>

        {/* Row 3 */}
        <div className="flex gap-1">
          <Button label="MS" onClick={() => {}} />
          <Button label="1" onClick={() => inputNumber('1')} />
          <Button label="2" onClick={() => inputNumber('2')} />
          <Button label="3" onClick={() => inputNumber('3')} />
          <Button label="-" onClick={() => performOperation('-')} />
          <Button label="1/x" onClick={inverse} />
        </div>

        {/* Row 4 */}
        <div className="flex gap-1">
          <Button label="M+" onClick={() => {}} />
          <Button label="0" onClick={() => inputNumber('0')} />
          <Button label="+/-" onClick={() => setDisplay(String(-parseFloat(display)))} />
          <Button label="." onClick={inputDecimal} />
          <Button label="+" onClick={() => performOperation('+')} />
          <Button label="=" onClick={performCalculation} />
        </div>
      </div>
    </div>
  );
};
