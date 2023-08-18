
import React from 'react';

interface MessageEditorButtonProps {
    name : string;
    onClick: () => void; // This will be the click handler for opening the message editor
}

function MessageEditorButton({ onClick, name }: MessageEditorButtonProps) {
    return (
        <button onClick={onClick}>{name}</button>
    );
}

export default MessageEditorButton;
