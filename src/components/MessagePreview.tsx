// components/MessagePreview.tsx
import React from 'react';

interface MessagePreviewProps {
    arrVarNames: string[]; // Array of variable names
    template: string | null; // The current message template
    onClose: () => void; // Close button click handler
    className: string;
}

function MessagePreview({arrVarNames, template, onClose, className }: MessagePreviewProps) {
    return (
        <div className={className}>
            <h2>Preview</h2>
            <p>{template}</p>
            {arrVarNames.map((varName) => (
                <div key={varName}>
                    <label>{varName}:</label>
                    <input type="text" value="" />
                </div>
            ))}
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default MessagePreview;
