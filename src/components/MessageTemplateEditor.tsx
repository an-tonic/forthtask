// components/MessageTemplateEditor.tsx
import React, { useState, useRef } from 'react';
import MessageVariables from './MessageVariables';
import MessagePreview from './MessagePreview';
import MessageEditorButton from './MessageEditorButton';
import styles from './MessageTemplateEditor.module.css';

interface MessageTemplateEditorProps {
    arrVarNames: string[]; // Array of variable names
    template: string; // The current message template
    callbackSave: (template: string) => void; // Callback for saving the template
}

function MessageTemplateEditor({ arrVarNames, template, callbackSave }: MessageTemplateEditorProps) {
    const [editorContent, setEditorContent] = useState<string>(template || '');
    const [showPreview, setShowPreview] = useState(false);
    const editorRef = useRef<HTMLTextAreaElement | null>(null);

    const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {

        setEditorContent(event.target.value);

        if (editorRef.current){
            editorRef.current.style.height = 50 + 'px' ;
            editorRef.current.style.height = editorRef.current.scrollHeight + "px";
        }


    };

    const handleSave = () => {
        // Converting textarea and other blocks to object and stringifing
        const templateObject = {
            userText: '',
            variables: [] as { position: number; name: string }[],
        };

        let cleanText = editorContent;
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



    const handleInsertVariable = async (variableName: string) => {
        // Insert the selected variable at the cursor position in the editor filed
        if (editorRef.current) {
            const editor = editorRef.current;
            const startPos = editor.selectionStart || 0;
            const endPos = editor.selectionEnd || 0;

            const updatedContent =
                editorContent.slice(0, startPos) +
                '{' + variableName + '}' +
                editorContent.slice(endPos);

            await setEditorContent(updatedContent);

            editor.focus();
            const cursorPos = endPos + variableName.length + 3;
            editor.setSelectionRange(cursorPos, cursorPos);

        }
    };

    const handlePreview = () =>  {
        handleSave();
        setShowPreview(!showPreview);
    }

    return (
        <div className={styles.container}>
            <h2>Message Template Editor</h2>
            <MessageVariables
                arrVarNames={arrVarNames}
                onClick={handleInsertVariable} />

            <textarea
                ref={editorRef}
                value={editorContent}
                onChange={handleEditorChange}
                rows={5}
                className={styles.textarea} />

            <MessageEditorButton
                onClick={handleSave}
                name={'Save template'}

            />
            <MessageEditorButton
                onClick={handlePreview}
                name={'Preview'}

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
