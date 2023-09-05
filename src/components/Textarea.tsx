import styles from "./Textarea.module.css";
import React from "react";
import MessageEditorButton from "./MessageEditorButton";

interface StyleProps{
    divWidth?:string;
}

interface TextareaProps {
    index:number;
    area:{parent: string, type:string, value:string, style:StyleProps};
    handleCursorChange: any;
    handelDelete?: (textareaParents: string) => void;
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setTextareaRef: (editor: { index: number; textarea: HTMLTextAreaElement } | null) => void;
}

const Textarea = ({ index, area, handleCursorChange, handelDelete, handleChange, setTextareaRef}:TextareaProps) => {
    let {parent, type, value, style} = area;

    const newlineMatches = Array.from(value.matchAll(/\n/g));
    const numberOfRows = newlineMatches.length + 1;
    const showDeleteButton = type === 'if' && handelDelete;
    // Calculate height of the textarea based on the amount of text
    const textareaHeight = numberOfRows*22.4;
    return (
        <div className={styles.condition} style={{width: style?.divWidth}}>
            <label className={styles.label}> {type !== 'text' ? type.toUpperCase() : ''} </label>
            {showDeleteButton  && <MessageEditorButton onClick={() => handelDelete(parent)} name={'x'} style={{padding:"5px 9px"}}/> }

            <textarea
                onChange={(e) => handleChange(e)}
                onKeyUp={(e) => handleCursorChange(e)}
                onMouseUp={(e) => handleCursorChange(e)}
                onFocus={(event) => {setTextareaRef({index:index, textarea: event.target})}}
                className={styles.textarea}
                style={type === 'text' ? {width: '100%', minHeight: '112px', height:`${textareaHeight}px`} : {}}

                value={value}
                rows={numberOfRows}
            ></textarea>
        </div>

    );
};

export default Textarea;
