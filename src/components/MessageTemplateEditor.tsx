// components/MessageTemplateEditor.tsx
import React, {useState, useRef} from 'react';
import MessageVariables from './MessageVariables';
import MessagePreview from './MessagePreview';
import MessageEditorButton from './MessageEditorButton';
import styles from './MessageTemplateEditor.module.css';
import Textarea from "./Textarea";
import { nanoid } from 'nanoid'

interface MessageTemplateEditorProps {
    arrVarNames: string[]; // Array of variable names
    template: string; // The current message template
    callbackSave: (template: string) => void; // Callback for saving the template
}

interface TextareaObject {
    id: string,
    parent: string,
    type:string,
    style: {};
    value:string
}

function MessageTemplateEditor({ arrVarNames, template, callbackSave }: MessageTemplateEditorProps) {
    const [showPreview, setShowPreview] = useState(false);
    const textareasRef = useRef<HTMLDivElement | null>(null);


    const [fields , setFields] = useState<TextareaObject[]>([{id:nanoid(4), parent:'', type:'text', value:'test', style:{divWidth:'100%'}}])
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

            setFields(updatedFields);

            textarea.focus();

        }
    };

    const handleDeleteCondition = (textareaParent: string) => {
        const childrenToDelete = [textareaParent];
        let lastChildIndex = 0;

        fields.forEach((field, index) => {
            if (childrenToDelete.includes(field.parent)) {
                childrenToDelete.push(field.id);
                lastChildIndex = index;
            }
        });

        let firstChildIndex = childrenToDelete.length - lastChildIndex;
        // Merging values from the two adjustment fields
        fields[firstChildIndex-1].value += fields[lastChildIndex+1].value;
        // Deleting the area after the last child: i.e. merging the fields
        childrenToDelete.push(fields[lastChildIndex+1].id);
        // Making sure the parent is not deleted - the fields above the delete if condition
        childrenToDelete.splice(0,1);
        const filteredFields = fields.filter(field => !childrenToDelete.includes(field.id));
        // Attaching children of the bottom area to the top area, need to be done after filter, or the top area will delete
        filteredFields[firstChildIndex-1].id = childrenToDelete.pop()!;

        setFields(filteredFields);
    };



    const handleAddTextarea = () => {
        if (!focusedField || focusedField.textarea.readOnly) return;

        const textarea = focusedField.textarea;
        const newTextareaValue = textarea.value.slice(textarea.selectionStart || 0);

        //Percentage of the new text areas - gives a width corresponding to focused textarea
        const percentage = textarea.clientWidth / textareasRef.current!.clientWidth * 100 + '%';

        const newTextaresStyles = {minHeight: '38px', width:'80%', divWidth:percentage};
        const parentId = fields[focusedField.index].id;
        const grandParentId = fields[focusedField.index].parent;

        const newTextareas:TextareaObject[] = [
            {id:nanoid(4), parent:parentId, type:'if', value:'', style: newTextaresStyles},
            {id:nanoid(4), parent:parentId, type:'then', value:'', style: newTextaresStyles},
            {id:nanoid(4), parent:parentId, type:'else', value:'', style: newTextaresStyles},
            {id:nanoid(4), parent:grandParentId, type:'text', value:newTextareaValue, style: {...newTextaresStyles, width: '100%'}}
        ];

        const targetIndex = focusedField.index + 1;


        const updatedFields = [
            ...fields.slice(0, targetIndex),
            ...newTextareas,
            ...fields.slice(targetIndex)
        ];
        // Old Textarea value - before the cursor
        updatedFields[focusedField.index].value = textarea.value.slice(0, textarea.selectionStart || 0);

        // Reattaching all children to a newly created field, so they would not be deleted
        for (let i = focusedField.index+4; i < updatedFields.length; i++){
            if(updatedFields[i].parent === parentId){
                updatedFields[i].parent = newTextareas[3].id;
            }
        }

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
                          index={index}
                          parent={component.parent}
                          value={component.value}
                          type={component.type}
                          style={component.style}
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
