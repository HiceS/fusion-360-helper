import { window } from 'vscode';
import { checkPathExistsSync, forceCheckPythonSync } from './findPython';
import { setPythonPath } from './envFiles';

/**
 * Singleton to control the PythonPath and keep it updated
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
        forceCheckPythonSync();
    }

    public setPath(path: string){
        if (checkPathExistsSync(path)){
            window.showInformationMessage("Updated Fusion 360 Python Path");
            this.path = path;
            setPythonPath(path);
        }
    }

    public getPath(){
        return this.path;
    }
} 