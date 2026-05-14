import * as vscode from 'vscode';
import { exec } from 'child_process';
import { ShellReqViewProvider } from './ShellReqViewProvider';

export function activate(context: vscode.ExtensionContext) {

    const provider = new ShellReqViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ShellReqViewProvider.viewType, provider)
    );

    // Sync state with Webview
    provider.onDidSaveCollection((item: any) => {
        const collections = context.globalState.get<any[]>('shellreq.collections', []);
        // Check if already exists (by name or URL)
        const exists = collections.findIndex(c => c.url === item.url && c.method === item.method);
        if (exists > -1) {
            collections[exists] = item;
        } else {
            collections.push(item);
        }
        context.globalState.update('shellreq.collections', collections);
    });

    // Handle focus command
    context.subscriptions.push(
        vscode.commands.registerCommand('shellreq.focus', () => {
            vscode.commands.executeCommand('shellreq.clientView.focus');
        })
    );

    // Legacy/Quick command
    context.subscriptions.push(
        vscode.commands.registerCommand('shellreq-api-client.runRequest', async () => {
            const url = await vscode.window.showInputBox({ placeHolder: 'Enter API URL' });
            if (!url) { return; }

            exec(`shellreq get ${url}`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(stderr || error.message);
                    return;
                }
                vscode.workspace.openTextDocument({ content: stdout, language: 'json' })
                    .then(doc => vscode.window.showTextDocument(doc));
            });
        })
    );
}

export function deactivate() {}