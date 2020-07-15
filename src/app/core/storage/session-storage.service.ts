import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {

    private store: IStorage;

    constructor() {
        this.store = this.canUseStorage(sessionStorage) ? sessionStorage : new MemoryStorageService();
    }

    get(key: string): any {
        const item = this.store.getItem(key);
        return (!item || item === 'null') ? null : JSON.parse(item);
    }

    remove(key: string): void {
        this.store.removeItem(key);
    }

    removeAll(): void {
        for (const key in this.store) {
            if (this.store.hasOwnProperty(key)) {
                this.remove(key);
            }
        }
    }

    set(key: string, value: any): any {
        const storageValue = JSON.stringify(value);
        this.store.setItem(key, storageValue);
        return value;
    }

    private canUseStorage(store: IStorage) {
        try {
            const inputTest = `test-storage-${Date.now()}`;
            store.setItem(inputTest, inputTest);
            const outputTest = store.getItem(inputTest);
            store.removeItem(inputTest);
            return (outputTest === inputTest);
        } catch (e) {
            return false;
        }
    }
}

interface IStorage {
    getItem(key: string): string;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
}

class MemoryStorageService implements IStorage {
    inMemoryStorage: any = {};

    getItem(key: string): string {
        return this.inMemoryStorage[key];
    }

    removeItem(key: string): void {
        if (this.inMemoryStorage[key] !== null) {
            this.inMemoryStorage[key] = null;
        }
    }

    setItem(key: string, value: string): void {
        this.inMemoryStorage[key] = value;
    }
}

export class SessionStorageKeys {
    public static PLAYER_STATE = 'player-state';
}
