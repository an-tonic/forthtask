// components/MessageTemplateEditor.tsx
import React, {useState} from 'react';
import MessageVariables from './MessageVariables';
import MessagePreview from './MessagePreview';
import MessageEditorButton from './MessageEditorButton';
import MessageCondition from "./MessageCondition";
import styles from './MessageTemplateEditor.module.css';
import Textarea from "./Textarea";

interface MessageTemplateEditorProps {
    arrVarNames: string[]; // Array of variable names
    template: string; // The current message template
    callbackSave: (template: string) => void; // Callback for saving the template
}


function MessageTemplateEditor({ arrVarNames, template, callbackSave }: MessageTemplateEditorProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [activeTextareaRef, setActiveTextareaRef] = useState<{ index: number; textarea: HTMLTextAreaElement } | null>(null);
    const [textareas, setTextareas] = useState<{index:number, node:React.ReactNode}[]>([{index: 0, node: <Textarea index={0} setTextareaRef={setActiveTextareaRef}/>}]);

    const [fields , setFields] = useState<{index:number, parent: [], type:string, value:string}[]>([{index: 0, parent: [], type:'text', value:'test'}])


    //*
    //
    // 0 [] ""
    //  1 [0]
    //  2 [0]
    //  3 [0]
    //    4 [0, 3]
    //    5 [0, 3]
    //  4 [0]
    //   6 [4, 0]
    //   7 [4, 0]
    //   8 [4, 0]
    //      10 [4, 0, 8]
    //  9 [4, 0]
    // */

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

    const handleInsertVariable = async (variableName: string) => {
        // Insert the selected variable at the cursor position in the editor field

        if (activeTextareaRef) {

            const textarea = activeTextareaRef.textarea;
            // Delete
            if(textarea.readOnly && textarea.textLength > 0){
                textarea.value = `{${variableName}}`;
                return;
            }
            const startPos = textarea.selectionStart || 0;
            const endPos = textarea.selectionEnd || 0;

            textarea.value = textarea.value.slice(0, startPos) +
                `{${variableName}}` +
                textarea.value.slice(endPos);

            textarea.focus();
            const cursorPos = endPos + variableName.length + 2;
            textarea.setSelectionRange(cursorPos, cursorPos);
        }
    };

    const handleDeleteCondition = () => {
        console.log(textareas);
        if(activeTextareaRef){

            // activeTextareaRef.textarea.value += textareas[conditionIndex+2]?.node?.toString();
        }
        // setTextareas(textareas);
        // setTextareas(prevTextareas =>
        //     prevTextareas.filter(textarea => !([conditionIndex, conditionIndex + 1, conditionIndex + 2].includes(textarea.index)))
        // );
    }


    const handleAddTextarea = () => {
        if (!activeTextareaRef || activeTextareaRef.textarea.readOnly) return;

        const textarea = activeTextareaRef.textarea;
        const newTextareaValue = textarea.value.slice(textarea.selectionStart || 0);
        // Old Textarea value - before the cursor
        textarea.value = textarea.value.slice(0, textarea.selectionStart || 0);


        // const conditionsWidth = textarea.clientWidth / 458.4 * 100;
        // const createCondition = (index: number, type: string, color: string, readOnly: boolean = false) => {
        //     return (
        //         <MessageCondition
        //             index={index}
        //             type={type}
        //             ReadOnly={readOnly}
        //             widthStyle={{width: `${conditionsWidth}%`}}
        //             labelStyle={{color}}
        //             deleteCondition={handleDeleteCondition}
        //             setTextareaRef={setActiveTextareaRef}
        //         />
        //     );
        // };
        //
        // const thisConditionIndex = textareas.length;
        // const newIFCondition = createCondition(thisConditionIndex, 'IF', '#5785EEFF', true);
        // const newTHENCondition = createCondition(thisConditionIndex + 1, 'THEN', '#a6409f');
        // const newELSECondition = createCondition(thisConditionIndex + 2, 'ELSE', '#6fa5d3');
        //
        // const thisTextareaIndex = textareas.length;
        // const newTextarea = (
        //     <Textarea
        //         value={newTextareaValue}
        //         index={thisTextareaIndex + 3}
        //         style={{minHeight: '38px', width: '100%'}}
        //         setTextareaRef={setActiveTextareaRef}
        //     />
        // );
        //
        // const targetIndex = textareas.findIndex(obj => obj.index === activeTextareaRef.index);
        // const newTextareas = [
        //     ...textareas.slice(0, targetIndex + 1),
        //     {index: thisConditionIndex, node: newIFCondition},
        //     {index: thisConditionIndex + 1, node: newTHENCondition},
        //     {index: thisConditionIndex + 2, node: newELSECondition},
        //     {index: thisTextareaIndex + 3, node: newTextarea},
        //     ...textareas.slice(targetIndex + 1)
        // ];
        //
        // setTextareas(newTextareas);


    };



    return (
        <div className={styles.container}>
            <h2>Message Template Editor</h2>
            <MessageVariables
                arrVarNames={arrVarNames}
                onClick={handleInsertVariable}
            />

            <MessageEditorButton
                name={'Add Condition'}
                onClick={handleAddTextarea}
            />

            {/*{textareas.map((Textarea) => (*/}
            {/*    <div key={Textarea.index}>{Textarea.node}</div>*/}
            {/*))}*/}

            {fields.map((component) => (
                <Textarea index={0} value={component.value} setTextareaRef={setActiveTextareaRef}/>
            )) }

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
