import React, { useState } from 'react';
import MessageEditorButton from './components/MessageEditorButton';
import MessageTemplateEditor from './components/MessageTemplateEditor';

function App() {
    const [showEditor, setShowEditor] = useState(false);
    
    const [template, setTemplate] = useState<string | null>(localStorage.getItem('template'));


    const arrVarNames = localStorage.getItem('arrVarNames') !== null
        ? JSON.parse(localStorage.arrVarNames)
        : ['firstname', 'lastname', 'company', 'position'];

    const handleOpenEditor = () => {
        setShowEditor(true);
    };

    const handleCloseEditor = () => {
        setShowEditor(false);
    };

    const handleSaveTemplate = (newTemplate: string) => {
        setTemplate(newTemplate);
        // You can also save the template to localStorage or perform any other necessary actions.
    };


    return (
        <div className="App">

            { !showEditor && (<MessageEditorButton
                onClick={handleOpenEditor}
                name={'Message Editor'}/>
            )}

            {showEditor && (<>
                    <MessageTemplateEditor
                    arrVarNames={arrVarNames}
                    template={template}
                    callbackSave={handleSaveTemplate}/>

                    <MessageEditorButton
                    onClick={handleCloseEditor}
                    name={'Close'}/>
                </>
            )}

        </div>
    );
}

export default App;
