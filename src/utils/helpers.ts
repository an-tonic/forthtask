export interface TextareaObject {
    id: string,
    parent: string,
    type:string,
    value:string,
    style: {};
}

export function isTextareaObjectArray(data: any): data is TextareaObject[] {
    if (!Array.isArray(data)) {
        return false;
    }

    for (const item of data) {
        if (
            typeof item !== 'object' ||
            typeof item.id !== 'string' ||
            typeof item.parent !== 'string' ||
            typeof item.type !== 'string' ||
            typeof item.style !== 'object' ||
            typeof item.value !== 'string'
        ) {
            return false;
        }
    }

    return true;
}