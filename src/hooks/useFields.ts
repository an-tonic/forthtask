import {useEffect, useState} from "react";
import {isTextareaObjectArray, TextareaObject} from "../utils/helpers";
import {nanoid} from "nanoid";


export function useFields(template: string) {
    const [fields, setFields] = useState<TextareaObject[]>([{
        id: nanoid(4),
        parent: '',
        type: 'text',
        value: '',
        style: {divWidth: '100%'}
    }]);

    useEffect(() => {
        let parsedFields;
        try {
            parsedFields = JSON.parse(template);
        } catch (error) {
            console.error('Error parsing JSON template:', error);
        }

        if (isTextareaObjectArray(parsedFields)) {
            setFields(parsedFields);
        } else {
            console.error('Invalid JSON data format');
        }
    }, [template]);

    return {fields, setFields};
}
