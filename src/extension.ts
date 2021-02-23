import * as vscode from 'vscode';
import { generateCppAddin, generatePythonAddin } from './Addin/createAddins';
import { getPythonLib } from './Intellisense/findPython';

export function activate(context: vscode.ExtensionContext) {
	// This can be active by having a .manifest file in your folders

	vscode.window
		.showInformationMessage("This looks like a Fusion 360 Addin Directory. Would you like to configure it for development?", 'yes','no')
		.then(value => {
			if (value === "yes"){
				// Addin Creation
				let pythonAddin = vscode.commands.registerCommand('fusion-360-helper.createPythonAddin', generatePythonAddin);
				let cppAddin = vscode.commands.registerCommand('fusion-360-helper.createCppAddin', generateCppAddin);

				// Intellisense Linking
				let linkPython = vscode.commands.registerCommand('fusion-360-helper.linkPython', getPythonLib);

				// Subscribing to UI
				context.subscriptions.push(pythonAddin, cppAddin, linkPython);
			}
			
		});
}

export function deactivate() {}