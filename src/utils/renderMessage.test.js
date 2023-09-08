
const myModule = require('./helpers.ts');


const { renderMessage } = myModule; // Import your function

// Test case 1: Simple Replacement
test('Simple replacement', () => {
    const template = JSON.parse('[{"id":"dLTb","parent":"","type":"text","value":"Hello, {firstname}","style":{"divWidth":"100%"}}]');
    const values = { firstname: 'Alice' };
    const expected = 'Hello, Alice';
    const view = renderMessage(template, values);
    expect(view).toBe(expected);
});
