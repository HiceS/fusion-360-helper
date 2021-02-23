import * as types from './types';
import os = require('os');
import {window} from 'vscode';
import {deactivate} from './extension';

/**
 * Function to return what kind of OS this is currently running on,
 * Simplified to use just OSX WINDOWS LINUX for my ease
 */
export function getOS(): types.OS {
    switch (os.platform()) {
        case "darwin":
            return types.OS.osx;
            break;
        case "win32":
            return types.OS.windows;
            break;
        default:
            window.showErrorMessage("This operating system is not supported for developing Addins");
            return types.OS.linux;
            break;
    }
}

export function fusionNotInstalledError(): void {
    window.showErrorMessage("Cannot locate Autodesk Fusion 360\nIs it installed?", "yes", "no").then(value => {
        if (value === "yes"){
            window.showWarningMessage("This is most likely a bug, please submit a bug report if possible and extension will deactivate");
            deactivate();
        }else{
            window.showWarningMessage("Please install Fusion 360");
            deactivate();
        }
    });
}