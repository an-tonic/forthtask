import styles from "./Textarea.module.css";
import React, {CSSProperties} from "react";

const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target.style.height = 0 + 'px' ;
    event.target.style.height = event.target.scrollHeight + "px";

};
interface TextareaProps {
    value?: string;
    ReadOnly?:boolean;
    index:number;
    style?: CSSProperties;
    setTextareaRef: (editor: { index: number; textarea: HTMLTextAreaElement } | null) => void;
}
const Textarea = ({ value, index, style, ReadOnly, setTextareaRef}:TextareaProps) => {

    return (
        <textarea
            onChange={handleTextareaChange}
            onFocus={(event) => {setTextareaRef({index:index, textarea: event.target})}}
            className={styles.textarea}
            style={style}
            defaultValue={value}
            rows={1}
            readOnly={ReadOnly}
        ></textarea>
    );
};

export default Textarea;
