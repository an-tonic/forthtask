// components/MessageTemplateEditor.tsx
import React, { useState, useRef } from 'react';
import MessageVariables from './MessageVariables'; // Import the VariableButtons component
import MessagePreview from './MessagePreview';

interface MessageTemplateEditorProps {
    arrVarNames: string[]; // Array of variable names
    template: string | null; // The current message template
    callbackSave: (template: string) => void; // Callback for saving the template
}

function MessageTemplateEditor({ arrVarNames, template, callbackSave }: MessageTemplateEditorProps) {
    const [editorContent, setEditorContent] = useState<string>(template || '');
    const [showPreview, setShowPreview] = useState(false);

    const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditorContent(event.target.value);
    };

    const handleSave = () => {
        callbackSave(editorContent);
    };

    const editorRef = useRef<HTMLTextAreaElement | null>(null);
    const handleInsertVariable = async (variableName: string) => {
        // Insert the selected variable at the cursor position in the editor filed
        if (editorRef.current) {
            const editor = editorRef.current;
            const startPos = editor.selectionStart || 0;
            const endPos = editor.selectionEnd || 0;

            const updatedContent =
                editorContent.slice(0, startPos) +
                `{${variableName}}` +
                editorContent.slice(endPos);

            await setEditorContent(updatedContent);

            editor.focus();
            const cursorPos = endPos + variableName.length + 3;
            editor.setSelectionRange(cursorPos, cursorPos);

        }
    };

    function handlePreview() {
        setShowPreview(!showPreview)
    }

    return (
        <div>
            <h2>Message Template Editor</h2>
            <MessageVariables
                arrVarNames={arrVarNames}
                onClick={handleInsertVariable} />

            <textarea
                ref={editorRef}
                value={editorContent}
                onChange={handleEditorChange}
                rows={10}
                cols={40} />
            <div>
                {/* Render buttons for variables and other functionalities */}
            </div>
            <button onClick={handleSave}>Save Template</button>
            <button onClick={handlePreview}>Preview</button>
            {showPreview && (
                <MessagePreview
                    arrVarNames={arrVarNames}
                    template={template}
                    onClose={handlePreview}
                    className={"overlay"}
                />
            )}
        </div>
    );



}

export default MessageTemplateEditor;
