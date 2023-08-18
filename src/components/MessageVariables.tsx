// components/VariableButtons.tsx
import React from 'react';

interface VariableButtonsProps {
    arrVarNames: string[];
    onClick: (variableName: string) => void; // Click handler for variable buttons
}

function MessageVariables({ arrVarNames, onClick }: VariableButtonsProps) {
    return (
        <div>
            {arrVarNames.map((varName) => (
                <button key={varName} onClick={() => onClick(varName)}>
                    {'{' + varName + '}'}
                </button>
            ))}
        </div>
    );
}




export default MessageVariables;
