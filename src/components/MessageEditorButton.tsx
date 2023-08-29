import styles from './MessageEditorButton.module.css';
import {CSSProperties} from "react"; // Import the CSS module

interface MessageEditorButtonProps {
    onClick: () => void;
    name : string;
    style?: CSSProperties;
}

function MessageEditorButton({ onClick, name, style}: MessageEditorButtonProps) {
    return (
        <button
            className={styles.btn}
            onClick={onClick}
            style={style}
        >{name}
        </button>
    );
}

export default MessageEditorButton;
