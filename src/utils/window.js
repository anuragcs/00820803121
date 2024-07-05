const windowSize = 10;
let window = [];

function updateWindow(newNumbers) {
    if (!newNumbers || !Array.isArray(newNumbers)) {
        throw new Error('Invalid newNumbers input');
    }
    
    window.push(...newNumbers);
    window = Array.from(new Set(window));
    if (window.length > windowSize) {
        window = window.slice(-windowSize);
    }
    const avg = window.reduce((sum, num) => sum + num, 0) / window.length;
    return {
        windowPrevState: window.slice(0, -newNumbers.length),
        windowCurrState: window,
        avg: avg.toFixed(2)
    };
}

module.exports = { updateWindow };
