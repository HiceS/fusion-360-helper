// This is the functions to generate and modify the settings panel
import { window, workspace } from 'vscode';
import { getPythonAutoCompleteLibs } from './findPython';

/**
 * Sets the PythonPath for Fusion 360 in settings.json
 * Sets the settings for the current workfolder
 * @param pythonPath Full Python Path for Fusion
 */
export function setPythonPath(pythonPath: string): void{
    if (workspace !== undefined) {
        const settings = workspace.getConfiguration('python');

        let extraPaths = [];
        extraPaths.push(getPythonAutoCompleteLibs());
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