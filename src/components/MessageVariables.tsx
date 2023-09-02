// components/VariableButtons.tsx
import React from 'react';
import styles from './MessageVariables.module.css'

interface VariableButtonsProps {
    arrVarNames: string[];
    onClick: (variableName: string) => void; // Click handler for variable buttons
}

function MessageVariables({ arrVarNames, onClick }: VariableButtonsProps) {
    return (
        <div className={styles.container}>
            {arrVarNames.map((varName, index) => (
                <button
                    key={index}
                    onClick={() => onClick(varName)}
                    className={styles.btn}
                >

                    {'{' + varName + '}'}
                </button>
            ))}
        </div>
    );
}




export default MessageVariables;
