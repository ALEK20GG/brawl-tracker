import { writable } from 'svelte/store';

export function localStorageStore<T>(key: string, initial: T) {
    const stored = localStorage.getItem(key);
    const data = stored ? JSON.parse(stored) as T : initial;

    const store = writable<T>(data);
    
    store.subscribe((value) => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

export const max_score = localStorageStore<number>("max_score", 0);
export const skin_in_use = localStorageStore<string>("skin_in_use", "flappy.png");
export const background_in_use = localStorageStore<string[]>("background_in_use", 
[
    "standard/1.png",
    "standard/6.png",
    "standard/ae.png",
    "standard/origbig.png",
    "standard/sfdgh.png",
    "standard/tsrh.png"
])
export const coins = localStorageStore<number>("coins", 0);
export const owned_skins = localStorageStore<string[]>("owned_skins", ["flappy.png"]);
export type Backgrounds = {
    standard: string[];
    city: string[];
    clouds: string[];
    nature: string[];
    night: string[];
};
export const owned_backgrounds = localStorageStore<Backgrounds>("owned_backgrounds", {
    standard:
    [
        "standard/1.png",
        "standard/6.png",
        "standard/ae.png",
        "standard/origbig.png",
        "standard/sfdgh.png",
        "standard/tsrh.png"
    ],
    city: [],
    clouds: [],
    nature: [],
    night: []
});
export const settings = localStorageStore("settings", {
    jump_volume: 0.1,
    death_volume: 0.1,
    coins_volume: 0.1,
    hitboxshown: false
});