'use strict';

import * as vscode from 'vscode';
import * as ubuntuPastebin from './ubuntuPastebin';

export function activate(context: vscode.ExtensionContext) {

	let upSelection = vscode.commands.registerCommand('extension.ubuntuPastebin.uploadSelection', () => {
        ubuntuPastebin.uploadMain(true);
    });

    let upFile = vscode.commands.registerCommand('extension.ubuntuPastebin.uploadFile', () => {
        ubuntuPastebin.uploadMain(false);
    });

	context.subscriptions.push(upSelection, upFile);
}

// this method is called when your extension is deactivated
export function deactivate() {}
