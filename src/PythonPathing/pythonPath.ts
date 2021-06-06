import { window } from 'vscode';
import { setPythonPath } from './envFiles';

/**
 * Singleton to control the PythonPath and keep it updated
 * This wouldn't work and as such isn't used
 * @NOTE NOT IN USE
 */
export class PythonPath {
    private static instance: PythonPath;
    private path: string;

    private constructor(){
        // get this from env .vscode / launch ideally
        this.path = "";
    }

    public static getInstance(): PythonPath {
        if (!PythonPath.instance) {
            PythonPath.instance = new PythonPath();
        }

        return PythonPath.instance;
    }

    public isPathEmpty(): boolean {
        return this.path === "";
    }

    public getPathSync(){
    }

    public getPath(){
        return this.path;
    }
} 