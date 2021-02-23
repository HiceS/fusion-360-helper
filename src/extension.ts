import * as vscode from 'vscode';
import { generateCppAddin, generatePythonAddin } from './Addin/createAddins';
import { forceCheckPythonSync } from './Intellisense/findPython';

export function activate(context: vscode.ExtensionContext) {
	// This can be active by having a .manifest file in your folders

	vscode.window
		.showInformationMessage("This looks like a Fusion 360 Addin Directory, would you like to configure it for development?", 'yes','no')
		.then(value => {
			if (value === "yes"){
				// Addin Creation
				let pythonAddin = vscode.commands.registerCommand('fusion-360-helper.createPythonAddin', generatePythonAddin);
				let cppAddin = vscode.commands.registerCommand('fusion-360-helper.createCppAddin', generateCppAddin);

				// Intellisense Linking
				let linkPython = vscode.commands.registerCommand('fusion-360-helper.linkPython', forceCheckPythonSync);

				// Subscribing to UI
				context.subscriptions.push(pythonAddin, cppAddin, linkPython);

				vscode.window.showInformationMessage(`Setting up fusion development environment`);
			}
			
		});
}

export function deactivate() {}