// components/MessagePreview.tsx
import React, {useEffect, useState} from 'react';
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
    conditions: ...
};
* */
const renderMessage = (template:string, values: { [name: string]: string }): string => {
    const deserializedTemplate = JSON.parse(template);

    let renderedText = '';
    let childrenNotToRender:{ [type: string]: string[] } = {'if':[], 'then':[], 'else':[], 'text':[]};

    deserializedTemplate.map((area:any) => {
        const { type, parent, id, value } = area;

        if(!childrenNotToRender[type]?.includes(parent)){
            let newArea = '';
            // True
            if(type === 'if' && values[value.slice(1, -1)] !== ''){
                childrenNotToRender['else'].push(parent);
            }
            // False
            else if(type === 'if' && values[value.slice(1, -1)] === ''){
                childrenNotToRender['then'].push(parent);
            }
            else if( type !== 'if'){
                newArea = area.value;
                for (let val in values){
                    const searchVal = `{${val}}`;
                    newArea = newArea.replaceAll(searchVal, values[val]);

                }
                renderedText += newArea;
            }

        } else {
            childrenNotToRender['if'].push(id);
            childrenNotToRender['then'].push(id);
            childrenNotToRender['else'].push(id);
            childrenNotToRender['text'].push(parent);

        }

    })


    return renderedText;

}



function MessagePreview({ arrVarNames, template, onClick }: MessagePreviewProps) {
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>(
        Object.fromEntries(arrVarNames.map(key => [key, '']))
    );

    const [message, setMessage] = useState<string>();
    useEffect(() => {
        setMessage(renderMessage(template, inputValues));
    }, []);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>, varName: string) => {
        const updatedValues = {...inputValues, [varName]: event.target.value};
        setInputValues(updatedValues);

        const result = renderMessage(template, updatedValues);
        console.log(result);
        setMessage(result);
    };

    return (
        <div className={styles.preview}>
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
