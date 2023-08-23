import React, { useState } from 'react';
import MessageEditorButton from './components/MessageEditorButton';
import MessageTemplateEditor from './components/MessageTemplateEditor';


function App() {
    const [showEditor, setShowEditor] = useState(false);
    const [template, setTemplate] = useState<string>(localStorage.getItem('template')!);
    const arrVarNames = localStorage.getItem('arrVarNames') !== null
        ? JSON.parse(localStorage.arrVarNames)
        : ['firstname', 'lastname', 'company', 'position'];


    const handleOpenEditor = () => {
        setShowEditor(true);
    };

    const handleCloseEditor = () => {
        setShowEditor(false);
    };

    const handleSaveTemplate = async (newTemplate: string) => {
        await localStorage.setItem('template', newTemplate);
        await setTemplate(newTemplate);
    };


    return (
        <>

            { !showEditor && (<MessageEditorButton
                onClick={handleOpenEditor}
                name={'Message Editor'}
                />
            )}

            {showEditor && (<>
                    <MessageTemplateEditor
                    arrVarNames={arrVarNames}
                    template={template}
                    callbackSave={handleSaveTemplate}/>

                    <MessageEditorButton
                    onClick={handleCloseEditor}
                    name={'Close'}

                    />
                </>
            )}

        </>
    );
}

export default App;
