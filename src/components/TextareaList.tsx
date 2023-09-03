import styles from "./MessageTemplateEditor.module.css";
import Textarea from "./Textarea";
import React, {forwardRef} from "react";
import {TextareaObject} from "../utils/helpers";

interface TextareaListProps{
    fields: TextareaObject[];
    handleDeleteCondition: any;
    handleTextareaChange: any;
    setFocusedField: any;
}

function TextareaList({fields, handleDeleteCondition, handleTextareaChange, setFocusedField}:TextareaListProps, ref: React.LegacyRef<HTMLDivElement> | undefined){

    return <div className={styles.textareas} ref={ref}>
        {fields.map((component, index) => (
            <Textarea key={index}
                      index={index}
                      area={component}
                      handelDelete={handleDeleteCondition}
                      handleChange={handleTextareaChange}
                      setTextareaRef={setFocusedField}/>
        )) }
    </div>
}

export default forwardRef(TextareaList);