// components/MessagePreview.tsx
import React, { useState} from 'react';
import styles from './MessagePreview.module.css';
import MessageEditorButton from "./MessageEditorButton";

interface MessagePreviewProps {
    arrVarNames: string[];
    template: string;
    onClick: () => void;
}


/* Accepts a template in this format:
*
* const templateObject = {
    userText: '',
    variables: [] as { position: number; name: string }[],
};
* */
const renderMessage = (template:string, values: { [name: string]: string }): string => {
    const deserializedTemplate = JSON.parse(template);

    const { userText, variables } = deserializedTemplate;

    let renderedText = userText;

    for (const variable of variables.sort((a: { position: number; }, b: { position: number; }) => b.position - a.position)) {
        if(variable.name in values){
            renderedText = [
                renderedText.slice(0, variable.position),
                values[variable.name],
                renderedText.slice(variable.position),
            ].join('');
        }
    }

    return renderedText;

}



function MessagePreview({ arrVarNames, template, onClick }: MessagePreviewProps) {
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const [message, setMessage] = useState<string>(JSON.parse(template)?.userText || null);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>, varName: string) => {
        const updatedValues = {...inputValues, [varName]: event.target.value};
        setInputValues(updatedValues);

        const result = renderMessage(template, updatedValues);
        setMessage(result);
    };

    return (
        <div className={styles.preview}>
            <div className={styles.previewContent}>
                <h2 className={styles.previewHeader}>Preview</h2>
                <p className={styles.previewText}>{message}</p>
                <div className={styles.inputContainer} >
                    {arrVarNames.map((varName) => (
                    <div key={varName} className={styles.inputContainer}>
                        <input
                            className={styles.inputField}
                            type="text"
                            value={inputValues[varName]}
                            onChange={(e) => handleInputChange(e, varName)}
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
