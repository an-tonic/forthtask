import styles from "./Textarea.module.css";
import React from "react";
import MessageEditorButton from "./MessageEditorButton";

interface StyleProps{
    width?:string;
    minHeight?:string;
    divWidth?:string;
}

interface TextareaProps {
    index:number;
    area:{parent: string, type:string, value:string, style:StyleProps};
    handelDelete?: (textareaParents: string) => void;
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setTextareaRef: (editor: { index: number; textarea: HTMLTextAreaElement } | null) => void;
}

const Textarea = ({ index, area, handelDelete, handleChange, setTextareaRef}:TextareaProps) => {
    let {parent, type, value, style} = area;

    const newlineMatches = Array.from(value.matchAll(/\n/g));
    const numberOfRows = newlineMatches.length + 1;
    const showDeleteButton = type === 'if' && handelDelete;
    if(type === 'text'){
        type = '';
    }

    return (
        <div className={styles.condition} style={{width: style?.divWidth, margin:'3px 0'}}>
            <label className={styles.label}> {type?.toUpperCase()} </label>
            {showDeleteButton  && <MessageEditorButton onClick={() => handelDelete(parent)} name={'x'} style={{padding:"5px 9px"}}/> }

            <textarea
                onChange={(e) => handleChange(e)}
                onFocus={(event) => {setTextareaRef({index:index, textarea: event.target})}}
                className={styles.textarea}
                style={{ width: style?.width, minHeight: style?.minHeight}}
                value={value}
                rows={numberOfRows}
            ></textarea>
        </div>

    );
};

export default Textarea;
