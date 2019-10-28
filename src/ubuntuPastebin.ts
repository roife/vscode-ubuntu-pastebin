'use strict';

import axios from 'axios';
import * as vscode from 'vscode';
import * as ui from './ui';

export function getLang(lang: string): string {
    switch (lang) {
        case "plaintext":
        case "git-commit":
        case "git-rebase":
        case "hlsl":
        case "ingore":
        case "lyric":
        case "log":
            lang = "text";
            break;
        case "bibtex":
            lang = "bib";
            break;
        case "latex":
        case "latex-expl3":
        case "doctex":
            lang = "tex";
            break;
        case "dockerfile":
            lang = "docker";
            break;
        case "jsonc":
            lang = "json";
            break;
        case "javascriptreact":
        case "javascript":
            lang = "js";
            break;
        case "jinja":
            lang = "django";
            break;
        case "jupyter":
            lang = "python";
            break;
        case "makefile":
            lang = "make";
            break;
        case "markdown":
            lang = "md";
            break;
        case "jade":
            lang = "pag";
            break;
        case "typescript":
            lang = "ts";
            break;
    }
    return lang;
}

export function upload(poster: string, syntax: string, expiration: string, content: string): Promise < string > {
    let postData = {
        poster: poster,
        syntax: syntax,
        expiration: expiration,
        content: content
    };

    let headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
    };

    const querystring = require('querystring');
    var p = new Promise < string > ((resolve, reject) => {
        axios.post("https://paste.ubuntu.com/", querystring.stringify(postData), {
                headers: headers,
                maxRedirects: 1
            })
            .then(response => {
                console.log(response.request.path);
                resolve("https://paste.ubuntu.com" + response.request.path);
            })
            .catch(error => reject(error));
    });

    return p;
}

export function uploadMain(selectionOrFile: boolean, customPoster: boolean) {
    let editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        vscode.window.showErrorMessage("Ubuntu Pastebin: There is no active text buffer.");
        return;
    }

    // Get content
    let content = editor.document.getText();

    if (selectionOrFile) {
        let selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showErrorMessage("Ubuntu Pastebin: There is no selection.");
            return;
        }
        content = editor.document.getText(selection);
    }

    if (content === "") {
        vscode.window.showErrorMessage("Ubuntu Pastebin: There is no content.");
        return;
    }

    let p: Thenable < any > = Promise.resolve();

    // Set poster
    let poster = "anonymous";
    if (!customPoster) {
        // Ask for poster if not defined
        let config = vscode.workspace.getConfiguration('vscode-ubuntuPastebin');
        if (config.get("poster") === undefined || config.get("poster") === "") {
            p = ui.promptPoster()
                .then(key => config.update("poster", key, vscode.ConfigurationTarget.Global));
        }
    } else {
        p = ui.promptPoster()
            .then(key => poster = key);
    }

    // Get language
    let lang = editor.document.languageId;
    lang = getLang(lang);

    p.then(() => ui.promptExpiration())
        .then(delay => {
            if (!customPoster) {
                let config = vscode.workspace.getConfiguration("vscode-ubuntuPastebin");
                poster = config.get("poster") as string;
            }
            return upload(poster, lang, delay, content);
        })
        .then((url) => {
            // Write url to clipboard
            vscode.env.clipboard.writeText(url)
                .then(() => vscode.window.showInformationMessage("Ubuntu Pastebin: Pastebin url copied to clipboard"));
        }, error => {
            vscode.window.showErrorMessage(error.message || error);
        });
}