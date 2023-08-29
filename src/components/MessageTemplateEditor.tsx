// components/MessageTemplateEditor.tsx
import React, {useState, useRef} from 'react';
import MessageVariables from './MessageVariables';
import MessagePreview from './MessagePreview';
import MessageEditorButton from './MessageEditorButton';
import styles from './MessageTemplateEditor.module.css';
import Textarea from "./Textarea";

interface MessageTemplateEditorProps {
    arrVarNames: string[]; // Array of variable names
    template: string; // The current message template
    callbackSave: (template: string) => void; // Callback for saving the template
}

interface TextareaObject {
    style: {};
    parent: number,
    type:string,
    value:string
}

function MessageTemplateEditor({ arrVarNames, template, callbackSave }: MessageTemplateEditorProps) {
    const [showPreview, setShowPreview] = useState(false);
    const textareasRef = useRef<HTMLDivElement | null>(null);

    const [fields , setFields] = useState<TextareaObject[]>([{parent: -1, type:'text', value:'test', style:{divWidth:'100%'}}])
    const [focusedField, setFocusedField] = useState<{ index: number; textarea: HTMLTextAreaElement } | null>(null);


    const handleSave = () => {
        // Converting textarea and other blocks to object and stringifing
        const templateObject = {
            userText: '',
            variables: [] as { position: number; name: string }[],
        };

        let cleanText = "";
        let currentPosition = 0;

        for (const varName of arrVarNames) {
            const variablePattern = new RegExp(`{${varName}}`, '');
            let match = variablePattern.exec(cleanText);

            while (match !== null) {
                templateObject.variables.push({ position: currentPosition + match.index, name: varName });
                match = variablePattern.exec(cleanText);
            }

            cleanText = cleanText.replace(variablePattern, '');
            currentPosition += varName.length + 2;
        }

        templateObject.userText = cleanText;

        const serializedTemplate = JSON.stringify(templateObject);
        callbackSave(serializedTemplate);
    };

    const handlePreview = () =>  {
        handleSave();
        setShowPreview(!showPreview);
    }
    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.target.style.height = 0 + 'px';
        event.target.style.height = event.target.scrollHeight + 'px';

        const updatedFields = [...fields];
        updatedFields[focusedField!.index].value = event.target.value;

        setFields(updatedFields);
    };


    const handleInsertVariable = async (variableName: string) => {

        if (focusedField) {

            const textarea = focusedField.textarea;
            // Delete
            if(textarea.readOnly && textarea.textLength > 0){
                textarea.value = `{${variableName}}`;
                return;
            }
            const startPos = textarea.selectionStart || 0;
            const endPos = textarea.selectionEnd || 0;

            const newTextareaValue = textarea.value.slice(0, startPos) +
                `{${variableName}}` +
                textarea.value.slice(endPos);

            const updatedFields = [...fields];

            updatedFields[focusedField.index].value = newTextareaValue;

            // Set the state using the updatedFields variable
            setFields(updatedFields);

            textarea.focus();

        }
    };

    const handleDeleteCondition = (textareaIdentifier: number) => {

        if (!focusedField || focusedField.textarea.readOnly) return;
        let valueLastTextarea = ''

        // Deleting fields with the same parent
        const newFields = fields.filter(item => {
            if(item.parent === focusedField.index){
                valueLastTextarea = item.value;
            }
            return item.parent !== textareaIdentifier
        })
        // Stiching values before and after the condition
        newFields[focusedField.index].value +=valueLastTextarea;
        setFields(newFields);
    };


    const handleAddTextarea = () => {
        if (!focusedField || focusedField.textarea.readOnly) return;

        const textarea = focusedField.textarea;
        const newTextareaValue = textarea.value.slice(textarea.selectionStart || 0);

        //Percentage of the new text areas - gives a width corresponding to focused textarea
        const percentage = textarea.clientWidth / textareasRef.current!.clientWidth * 100 + '%';

        const newTextaresStyles = {minHeight: '38px', width:'80%', divWidth:percentage};

        const newTextareas:TextareaObject[] = [
            {parent:focusedField.index, type:'if', value:'', style: newTextaresStyles},
            {parent:focusedField.index, type:'then', value:'', style: newTextaresStyles},
            {parent:focusedField.index, type:'else', value:'', style: newTextaresStyles},
            {parent:focusedField.index, type:'text', value:newTextareaValue, style: {...newTextaresStyles, width: '100%'}}
        ];

        const targetIndex = focusedField.index + 1;
        const updatedFields = [
            ...fields.slice(0, targetIndex),
            ...newTextareas,
            ...fields.slice(targetIndex)
        ];
        // Old Textarea value - before the cursor
        updatedFields[focusedField.index].value = textarea.value.slice(0, textarea.selectionStart || 0);

        // Set the state using the updatedFields variable
        setFields(updatedFields);

    };


    return (
        <div className={styles.container} >
            <h2>Message Template Editor</h2>
            <MessageVariables
                arrVarNames={arrVarNames}
                onClick={handleInsertVariable}
            />

            <MessageEditorButton
                name={'Add Condition'}
                onClick={handleAddTextarea}
            />
            <div className={styles.textareas} ref={textareasRef}>
                {fields.map((component, index) => (
                <Textarea key={index}
                          parent={component.parent}
                          value={component.value}
                          type={component.type}
                          style={component.style}
                          index={index}
                          handelDelete={handleDeleteCondition}
                          handleChange={handleTextareaChange}
                          setTextareaRef={setFocusedField}/>
            )) }
            </div>

            <MessageEditorButton
                name={'Save template'}
                onClick={handleSave}
            />
            <MessageEditorButton
                name={'Preview'}
                onClick={handlePreview}
            />


            {showPreview && (
                <MessagePreview
                    arrVarNames={arrVarNames}
                    template={template}
                    onClick={handlePreview}
                />
            )}
        </div>
    );



}

export default MessageTemplateEditor;
