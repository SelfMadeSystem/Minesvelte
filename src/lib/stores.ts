// I don't know why, but the "readable" store built-in with svelte wasn't working properly.

const windowSizeSubscripters: (({width, height}: {width: number, height: number}) => void)[] = [];

export const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight,
    subscribe: (s: ({width, height}: {width: number, height: number}) => void) => {
        windowSizeSubscripters.push(s);
        s(windowSize);
    }
}

function resize() {
    windowSize.width = window.innerWidth;
    windowSize.height = window.innerHeight;
    windowSize.width = window.innerWidth;
    windowSize.height = window.innerHeight; 
    windowSizeSubscripters.forEach(s => s(windowSize));
}

window.addEventListener("resize", () => {
    resize();
}, true);