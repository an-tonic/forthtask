// components/MessagePreview.tsx
import React, {useState} from 'react';
import styles from './MessagePreview.module.css';
import MessageEditorButton from "./MessageEditorButton";
import {renderMessage} from '../utils/helpers'
import {TextareaObject} from "../utils/helpers";

interface MessagePreviewProps {
    arrVarNames: string[];
    template: TextareaObject[];
    onClick: () => void;
}


function MessagePreview({ arrVarNames, template, onClick }: MessagePreviewProps) {
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>(
        Object.fromEntries(arrVarNames.map(key => [key, '']))
    );

    const [message, setMessage] = useState<string>(renderMessage(template, inputValues));


    const handleInputChange = (varName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedValues = { ...inputValues, [varName]: event.target.value };
        setInputValues(updatedValues);
        const result = renderMessage(template, updatedValues);
        setMessage(result);
    };

    return (
        <div className={styles.preview} >
            <div className={styles.previewContent}>
                <h2 className={styles.previewHeader}>Preview</h2>
                <pre className={styles.previewText}>{message}</pre>
                <div className={styles.inputContainer} >
                    {arrVarNames.map((varName) => (
                    <div key={varName} className={styles.inputContainer}>
                        <input
                            className={styles.inputField}
                            type="text"
                            value={inputValues[varName]}
                            onChange={handleInputChange(varName)}
                            placeholder=' '
                        />
                        <label className={styles.inputLabel}>{varName}</label>
                    </div>
                ))}
                </div>
                <MessageEditorButton
                    onClick={onClick}
                    name={'Close'}
                />
            </div>
        </div>
    );
}

export default MessagePreview;
