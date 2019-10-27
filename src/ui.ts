'use strict';

import * as vscode from 'vscode';

export function promptPoster() {
    return vscode.window.showInputBox({
        placeHolder: "Poster",
        prompt: ""
    }).then(poster => {
        if(poster === undefined || poster === "") {
            throw new Error("Cancelled on poster input.");
        }
        return poster as string;
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
            throw new Error("Cancelled on delay input.");
        }

        var ret = expirations.find(exp => exp.name === delay);
        if(ret === undefined) {
            throw new Error("Invalid delay");
        }
        return ret.delay;
    });
}

