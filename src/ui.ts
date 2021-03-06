'use strict';

import * as vscode from 'vscode';

export function promptPoster() {
    return vscode.window.showInputBox({
        placeHolder: "Poster",
    }).then(poster => {
        if(poster === undefined) {
            throw new Error("Ubuntu Pastebin: Cancelled on poster input.");
        }
        return (poster || "anonymous") as string;
    });
}

export function promptExpiration() {
    var expirations = [
        {name: "A day", delay:"day"},
        {name: "A week", delay:"week"},
        {name: "A month", delay:"month"},
        {name: "A year", delay:"year"},
    ];

    return vscode.window.showQuickPick(expirations.map((e) => e.name) ,{
        placeHolder: "Paste expiration delay",
    }).then(delay => {
        if(delay === undefined || delay === "") {
            throw new Error("Ubuntu Pastebin: Cancelled on delay input.");
        }

        var ret = expirations.find(exp => exp.name === delay);
        if(ret === undefined) {
            throw new Error("Ubuntu Pastebin: Invalid delay");
        }
        return ret.delay;
    });
}

