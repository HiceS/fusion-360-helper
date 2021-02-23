// This is the functions to generate and modify the settings panel
import { window, workspace } from 'vscode';

/**
 * Sets the PythonPath for Fusion 360 in settings.json
 * Sets the settings for the current workfolder
 * @param pythonPath Full Python Path for Fusion
 */
export function setPythonPath(pythonPath: string, libraryPath: string): void{
    if (workspace !== undefined) {
        const settings = workspace.getConfiguration('python');

        // This must be the order of operations for some reason
        // The expand macro might work ...[libraryPath] ?
        let extraPaths = [];
        extraPaths.push(libraryPath);
        settings.update("autoComplete.extraPaths", extraPaths);

        settings.update("pythonPath", pythonPath);
    }else{
        const newLaunch = window.showErrorMessage("Cannot find the Python Settings folders.\nWould you like to create them?", "Yes", "No");
        newLaunch.then(value => {
            if ("Yes"){
                // create a new .vscode folder
                // copy the defaults file into it
                // set the python path
            }
        });
    }
}

/**
 * This function checks the current python settings and likely bleongs in another file
 */
export function checkPythonSettings(): boolean {
    if (workspace !== undefined) {
        const settings = workspace.getConfiguration('python');
        // check if the found path equals the current one?
        // update the refs if non exist ?
        // add extra command to do it automatically
        return true;
    }else{
        const newLaunch = window.showErrorMessage("Cannot find the Python Settings folders.\nWould you like to create them?", "Yes", "No");
        newLaunch.then(value => {
            if ("Yes"){
                // create a new .vscode folder
                // copy the defaults file into it
                // set the python path
            }
        });
        return false;
    }
}