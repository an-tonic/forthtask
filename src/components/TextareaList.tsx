import styles from "./MessageTemplateEditor.module.css";
import Textarea from "./Textarea";
import React, {forwardRef} from "react";
import {TextareaObject} from "../utils/helpers";

interface TextareaListProps{
    fields: TextareaObject[];
    handleCursorChange: any;
    handleDeleteCondition: any;
    handleTextareaChange: any;
    setFocusedField: any;
}

function TextareaList({fields, handleCursorChange, handleDeleteCondition, handleTextareaChange, setFocusedField}:TextareaListProps, ref: React.LegacyRef<HTMLDivElement> | undefined){

    return <div className={styles.textareas} ref={ref}>
        {fields.map((component, index) => (
            <Textarea key={index}
                      index={index}
                      area={component}
                      handleCursorChange={handleCursorChange}
                      handelDelete={handleDeleteCondition}
                      handleChange={handleTextareaChange}
                      setTextareaRef={setFocusedField}/>
        )) }
    </div>
}

export default forwardRef(TextareaList);