import * as vscode from 'vscode';
import { generateCppAddin, generatePythonAddin } from './Addin/createAddins';

export function activate(context: vscode.ExtensionContext) {

	let pythonAddin = vscode.commands.registerCommand('fusion-360-helper.createPythonAddin', generatePythonAddin);
	let cppAddin = vscode.commands.registerCommand('fusion-360-helper.createCppAddin', generateCppAddin);

	context.subscriptions.push(pythonAddin, cppAddin);
}

export function deactivate() {}
