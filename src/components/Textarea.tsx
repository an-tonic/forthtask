import styles from "./Textarea.module.css";
import React from "react";
import MessageEditorButton from "./MessageEditorButton";


interface TextareaProps {
    index:number;
    value?: string;
    type?:string
    parent:string;
    style?: {
        width?:string;
        minHeight?:string;
        divWidth?:string;
    };
    handelDelete?: (textareaParents: string) => void;
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setTextareaRef: (editor: { index: number; textarea: HTMLTextAreaElement } | null) => void;
}
const Textarea = ({ index, value, parent, style, type, handelDelete, handleChange, setTextareaRef}:TextareaProps) => {
    let readOnly = false;


    if(type === 'text'){
        type = '';
    } else if(type === 'if'){
        readOnly = true;
    }

    return (
        <div className={styles.condition} style={{width: style?.divWidth, margin:'3px 0'}}>
            <label className={styles.label}> {type?.toUpperCase()} </label>
            {type === 'if' && handelDelete && <MessageEditorButton onClick={() => handelDelete(parent)} name={'x'} style={{padding:"5px 9px"}}/> }

            <textarea
                onChange={(e) => handleChange(e)}
                onFocus={(event) => {setTextareaRef({index:index, textarea: event.target})}}
                className={styles.textarea}
                style={{ width: style?.width, minHeight: style?.minHeight}}
                value={value}
                rows={1}
                readOnly={readOnly}
            ></textarea>
        </div>

    );
};

export default Textarea;
