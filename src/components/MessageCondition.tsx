import React, { CSSProperties } from 'react';
import styles from './MessageCondition.module.css';
import Textarea from "./Textarea";
import MessageEditorButton from "./MessageEditorButton";

interface MessageConditionProps {
    index:number;
    type: string;
    ReadOnly?:boolean;
    widthStyle: CSSProperties;
    labelStyle?: CSSProperties;
    deleteCondition: ()=> void;
    setTextareaRef: (editor: { index: number; textarea: HTMLTextAreaElement } | null) => void;
}

const MessageCondition = ({index, type, widthStyle, ReadOnly, labelStyle, deleteCondition, setTextareaRef}:MessageConditionProps) => {
    return (
            <div className={styles.condition} style={widthStyle}>
                <label className={styles.label} style={labelStyle}>{type}</label>
                {type === 'IF' && <MessageEditorButton onClick={deleteCondition} name={'x'}/> }
                <Textarea index={index} ReadOnly={ReadOnly} style={{minHeight: '38px', width:'80%'}} setTextareaRef={setTextareaRef}/>
            </div>
    );
};

export default MessageCondition;
