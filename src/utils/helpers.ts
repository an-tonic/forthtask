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
export function replaceVariables(areaValue: string, values: { [x: string]: string }): string {
    // Use a regex to find all variable placeholders like {variableName}
    const variableRegex = /\{([^{}]+)}/g;
    let result = areaValue.trim();
    if(result === '') return '';

    // Use the regex to find and replace all variable placeholders
    result = result.replace(variableRegex, (match, variableName) => {
        // Check if the variableName exists in the values object
        if (values.hasOwnProperty(variableName)) {
            return values[variableName]; // Replace with the corresponding value
        } else {
            return match; // Variable not found, so keep the original placeholder
        }
    });

    return result;
}

function findLastChildIndex(template:TextareaObject[], startIndex:number, parentId:string) {
    for (let i = template.length - 1; i >= startIndex; i--) {
        if (template[i].parent === parentId) {
            return i;
        }
    }
    return -1;
}
export function renderMessage(template:TextareaObject[], values: { [name: string]: string }): string {

    let renderedText = '';
    let childrenNotToEvaluate:{ [type: string]: string[] } = {'if':[], 'then':[], 'else':[], 'text':[]};

    template.forEach((area:any, index:number) => {
        const { type, parent, id, value } = area;


        // Check if the current area should be rendered based on its type and parent
        if(childrenNotToEvaluate[type].includes(parent)){
            // If the area should not be rendered, its children should also not be rendered
            childrenNotToEvaluate['if'].push(id);
            childrenNotToEvaluate['then'].push(id);
            childrenNotToEvaluate['else'].push(id);
            childrenNotToEvaluate['text'].push(parent);
            return;
        }

        let newArea = replaceVariables(value, values);

        if (type === 'if') {
            // The children of this particular 'if' should not be rendered, since they will be, in the recursion call
            childrenNotToEvaluate['if'].push(id);
            childrenNotToEvaluate['then'].push(id);
            childrenNotToEvaluate['else'].push(id);
            childrenNotToEvaluate['text'].push(parent);

            // Find lastChild index

            let conditionMet;

            // If the 'if' has already some text, the consecutive children are absolite
            if(newArea){
                conditionMet = newArea;
            } else {
                // If there are children we try to render them
                let lastChildIndex = findLastChildIndex(template, index, id);
                if(lastChildIndex > -1) conditionMet = renderMessage(template.slice(index+1, lastChildIndex+2), values);
            }
            // Push children of the if-condition that we do not need to render (i.e. choosing 'else' or 'then')
            childrenNotToEvaluate[conditionMet ? 'else' : 'then'].push(parent);
        } else if (type !== 'if') {
            renderedText += newArea;
        }
    })
    return renderedText;
}
