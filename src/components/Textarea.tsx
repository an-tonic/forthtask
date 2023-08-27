import styles from "./Textarea.module.css";
import React, {CSSProperties} from "react";

const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target.style.height = 0 + 'px' ;
    event.target.style.height = event.target.scrollHeight + "px";

};
interface TextareaProps {
    value?: string;
    ReadOnly?:boolean;
    parent:number[];
    style?: CSSProperties;
    setTextareaRef: (editor: { parent: number[]; textarea: HTMLTextAreaElement } | null) => void;
}
const Textarea = ({ value, parent, style, ReadOnly, setTextareaRef}:TextareaProps) => {

    return (
        <textarea
            onChange={handleTextareaChange}
            onFocus={(event) => {setTextareaRef({parent:parent, textarea: event.target})}}
            className={styles.textarea}
            style={style}
            defaultValue={value}
            rows={1}
            readOnly={ReadOnly}
        ></textarea>
    );
};

export default Textarea;
