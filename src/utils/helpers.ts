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

export function renderMessage(template:string, values: { [name: string]: string }): string {
    const deserializedTemplate = JSON.parse(template);
    let renderedText = '';
    let childrenNotToEvaluate:{ [type: string]: string[] } = {'if':[], 'then':[], 'else':[], 'text':[]};

    deserializedTemplate.forEach((area:any) => {
        const { type, parent, id, value } = area;

        // Check if the current area should be rendered based on its type and parent
        if(!childrenNotToEvaluate[type]?.includes(parent)){
            let newArea = value;
            // Process non-if type areas by replacing variable placeholders with values
            for (const val in values) {
                const searchVal = `{${val}}`;
                newArea = newArea.replaceAll(searchVal, values[val]);
            }

            if (type === 'if') {
                // const conditionMet = values[value.slice(1, -1)] === '';
                const conditionMet = newArea === '';

                // Push children of the if-condition that we do not need to render
                childrenNotToEvaluate[conditionMet ? 'then' : 'else'].push(parent);
            } else if (type !== 'if') {
                renderedText += newArea;
            }

        } else {
            // If the area should not be rendered, its children should also not be
            childrenNotToEvaluate['if'].push(id);
            childrenNotToEvaluate['then'].push(id);
            childrenNotToEvaluate['else'].push(id);
            childrenNotToEvaluate['text'].push(parent);

        }
    })
    return renderedText;
}
