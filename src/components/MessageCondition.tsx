import React, { CSSProperties } from 'react';
import styles from './MessageCondition.module.css';
import Textarea from "./Textarea";

interface MessageConditionProps {
    index:number;
    type: string;
    ReadOnly?:boolean;
    widthStyle: CSSProperties;
    labelStyle?: CSSProperties;
    setTextareaRef: (editor: { index: number; textarea: HTMLTextAreaElement } | null) => void;
}

const MessageCondition = ({index, type, widthStyle, ReadOnly, labelStyle, setTextareaRef}:MessageConditionProps) => {
    return (
            <div className={styles.condition} style={widthStyle}>
                <label className={styles.label} style={labelStyle}>{type}</label>
                <Textarea index={index} ReadOnly={ReadOnly} style={{minHeight: '38px', width:'80%'}} setTextareaRef={setTextareaRef}/>
            </div>
    );
};

export default MessageCondition;
