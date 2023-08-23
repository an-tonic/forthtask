import styles from './MessageEditorButton.module.css'; // Import the CSS module

interface MessageEditorButtonProps {
    onClick: () => void; // This will be the click handler for opening the message editor
    name : string;

}

function MessageEditorButton({ onClick, name}: MessageEditorButtonProps) {
    return (
        <button
            className={styles.btn}
            onClick={onClick}
        >{name}
        </button>
    );
}

export default MessageEditorButton;
