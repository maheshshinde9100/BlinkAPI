import * as vscode from 'vscode';
import { exec } from 'child_process';
import { ShellReqViewProvider } from './ShellReqViewProvider';

export function activate(context: vscode.ExtensionContext) {

    const provider = new ShellReqViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ShellReqViewProvider.viewType, provider)
    );

    const disposable = vscode.commands.registerCommand(
        'shellreq-api-client.runRequest',
        async () => {

            const url = await vscode.window.showInputBox({
                placeHolder: 'Enter API URL'
            });

            if (!url) {
                return;
            }

            // Still provide quick execution via CLI if installed
            exec(`shellreq get ${url}`, (error, stdout, stderr) => {

                if (error) {
                    vscode.window.showErrorMessage(stderr || error.message);
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

    context.subscriptions.push(
        vscode.commands.registerCommand('shellreq.focus', () => {
            vscode.commands.executeCommand('shellreq.clientView.focus');
        })
    );
}

export function deactivate() {}