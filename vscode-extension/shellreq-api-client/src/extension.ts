import * as vscode from 'vscode';
import { exec } from 'child_process';
import { ShellReqViewProvider } from './ShellReqViewProvider';

export function activate(context: vscode.ExtensionContext) {

    const provider = new ShellReqViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ShellReqViewProvider.viewType, provider)
    );

    // Initial state sync
    const syncState = () => {
        const collections = context.globalState.get<any[]>('shellreq.collections', []);
        const history = context.globalState.get<any[]>('shellreq.history', []);
        provider.updateState({ collections, history });
    };

    // Handle state updates from Webview
    provider.onDidUpdateState((state: any) => {
        if (state.collections) {
            context.globalState.update('shellreq.collections', state.collections);
        }
        if (state.history) {
            context.globalState.update('shellreq.history', state.history);
        }
    });

    // Sync state when view becomes visible
    provider.onDidReady(() => {
        syncState();
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