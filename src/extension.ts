import * as vscode from 'vscode';
import { generateCppAddin, generatePythonAddin } from './Addin/createAddins';
import { getPythonLib } from './PythonPathing/findPython';
import { configureDocumentionLinker } from './DocLinker/contextLinkers';
import {launchFusion360} from './processLauncher';
import {checkFusionOpen} from './processLauncher';
import { DocumentationPanel } from './DocLinker/docsPanel';

export let fusionMenuItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	let config = vscode.workspace.getConfiguration('fusion-360-helper');
	const enabled = config.get("enabled");
	
	if (enabled === null){
		vscode.window
			.showInformationMessage("This looks like a Fusion 360 Addin Directory. Would you like to configure it for development?", 'yes','no')
			.then(value => {
				if (value === "yes"){
					// set it to enabled
					config.update("enabled", true);
					firstStart(context);
				}else if(value === "no"){
					// in this scenario we don't bother the user
					// should add a command to re-enable it tho
					config.update("enabled", false);
				}
			}
		);
	}else if(enabled){
		firstStart(context);
	}
}

export function deactivate() {

}

function firstStart(context: vscode.ExtensionContext){
	getPythonLib();
	start(context);
}

function start(context: vscode.ExtensionContext){
	// Addin Creation
	let pythonAddin = vscode.commands.registerCommand('fusion-360-helper.createPythonAddin', generatePythonAddin);
	let cppAddin = vscode.commands.registerCommand('fusion-360-helper.createCppAddin', generateCppAddin);

	// Intellisense Linking
	let linkPython = vscode.commands.registerCommand('fusion-360-helper.linkPython', getPythonLib);

	const fusionMenuItemID = "fusion-360-helper.fusionMenuItem";
	fusionMenuItem = createStatusBarItem(fusionMenuItemID);
	let fusionMenuItemClick = vscode.commands.registerCommand(fusionMenuItemID, launchFusion360);

	let eventUpdate = vscode.window.onDidChangeWindowState(windowStateChange);

	// this will automagically add the context
	configureDocumentionLinker(context);

	context.subscriptions.push(pythonAddin, cppAddin, linkPython, fusionMenuItem, fusionMenuItemClick, eventUpdate);

	fusionMenuItem.show();

	// set the status of the fusion menu text
	checkFusionOpen(false);
}

function createStatusBarItem(commandID: string): vscode.StatusBarItem {
	const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
	myStatusBarItem.command = commandID;
	myStatusBarItem.text = "$(extensions-refresh) Finding Fusion 360";
	return myStatusBarItem;
}

/**
 * Function to tell me if the user is currently looking at the window.
 * Useful for updating UI elements so as to not constantly poll to see if fusion is open.
 * @param e Window State Event
 */
function windowStateChange(e: vscode.WindowState){
	// console.log(e);

	if (e.focused === true){
		checkFusionOpen(false);
		// I added a process callback in the spawnProcess code
		// leaving this here for now just in case
	}
}