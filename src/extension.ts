'use strict';

import * as vscode from 'vscode';
import * as ubuntuPastebin from './ubuntuPastebin';

export function activate(context: vscode.ExtensionContext) {

	let upSelection = vscode.commands.registerCommand('extension.ubuntuPastebin.uploadSelection', () => {
        ubuntuPastebin.uploadMain(true, false);
    });

    let upFile = vscode.commands.registerCommand('extension.ubuntuPastebin.uploadFile', () => {
        ubuntuPastebin.uploadMain(false, false);
    });

	let upSelectionWithPoster = vscode.commands.registerCommand('extension.ubuntuPastebin.uploadSelectionWithPoster', () => {
        ubuntuPastebin.uploadMain(true, true);
    });

	let upFileWithPoster = vscode.commands.registerCommand('extension.ubuntuPastebin.uploadFileWithPoster', () => {
        ubuntuPastebin.uploadMain(false, true);
    });

    context.subscriptions.push(upSelection, upFile);
    context.subscriptions.push(upSelectionWithPoster, upFileWithPoster);
}

// this method is called when your extension is deactivated
export function deactivate() {}
