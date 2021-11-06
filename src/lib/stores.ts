import { readable } from "svelte/store";

export var winSize = {
    width: window.innerWidth,
    height: window.innerHeight
};

export const windowSize = readable(
    {
        width: window.innerWidth,
        height: window.innerHeight
    },
    set => {
        window.addEventListener("resize", () => {
            set(winSize = {
                width: window.innerWidth,
                height: window.innerHeight
            });
        }, true);
    }
);