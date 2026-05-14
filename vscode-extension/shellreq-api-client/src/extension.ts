import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand(
        'shellreq-api-client.runRequest',
        async () => {

            const url = await vscode.window.showInputBox({
                placeHolder: 'Enter API URL'
            });

            if (!url) {
                return;
            }

            exec(`shellreq get ${url}`, (error, stdout, stderr) => {

                if (error) {
                    vscode.window.showErrorMessage(stderr);
                    return;
                }

                vscode.workspace.openTextDocument({
                    content: stdout,
                    language: 'json'
                }).then(doc => {
                    vscode.window.showTextDocument(doc);
                });

            });
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}