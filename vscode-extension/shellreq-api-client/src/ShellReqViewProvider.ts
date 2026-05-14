import * as vscode from 'vscode';
import axios from 'axios';

export class ShellReqViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'shellreq.clientView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'runRequest':
                    {
                        this._handleRequest(data.value);
                        break;
                    }
            }
        });
    }

    private async _handleRequest(requestConfig: any) {
        if (!this._view) {
            return;
        }

        try {
            this._view.webview.postMessage({ type: 'status', value: 'Sending request...' });
            
            const startedAt = Date.now();
            let parsedBody = undefined;
            if (requestConfig.body) {
                try {
                    parsedBody = JSON.parse(requestConfig.body);
                } catch (e) {
                    parsedBody = requestConfig.body;
                }
            }

            const response = await axios({
                method: requestConfig.method,
                url: requestConfig.url,
                headers: this._parseHeaders(requestConfig.headers),
                data: parsedBody,
                validateStatus: () => true,
                transformResponse: [(data) => data] // Keep as string for formatting
            });

            const duration = Date.now() - startedAt;

            this._view.webview.postMessage({
                type: 'response',
                value: {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    data: response.data,
                    duration: duration,
                    size: this._estimateSize(response.data)
                }
            });
        } catch (error: any) {
            this._view.webview.postMessage({
                type: 'error',
                value: error.message || 'An error occurred'
            });
        }
    }

    private _parseHeaders(headersString: string): Record<string, string> {
        const headers: Record<string, string> = {};
        if (!headersString) { return headers; }

        const lines = headersString.split('\n');
        for (const line of lines) {
            const index = line.indexOf(':');
            if (index > -1) {
                const key = line.substring(0, index).trim();
                const value = line.substring(index + 1).trim();
                if (key) {
                    headers[key] = value;
                }
            }
        }
        return headers;
    }

    private _estimateSize(data: any): string {
        const bytes = typeof data === 'string' ? data.length : JSON.stringify(data).length;
        if (bytes < 1024) { return `${bytes} B`; }
        return `${(bytes / 1024).toFixed(2)} KB`;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>ShellReq API Client</title>
				<style>
					:root {
						--primary-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                        --bg-dark: #0f172a;
                        --border-color: rgba(255, 255, 255, 0.1);
					}
					body {
						padding: 0;
						margin: 0;
						color: var(--vscode-foreground);
						font-family: var(--vscode-font-family);
                        font-size: 13px;
                        background: var(--vscode-sideBar-background);
					}
					.app-container {
						display: flex;
						flex-direction: column;
						height: 100vh;
					}
					.header {
						padding: 16px;
						background: var(--primary-gradient);
						color: white;
						display: flex;
						align-items: center;
						gap: 10px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                        z-index: 10;
					}
                    .header h1 {
                        margin: 0;
                        font-size: 16px;
                        font-weight: 800;
                        letter-spacing: 0.5px;
                    }
                    .header .v {
                        font-size: 10px;
                        opacity: 0.8;
                        background: rgba(255,255,255,0.2);
                        padding: 1px 5px;
                        border-radius: 4px;
                    }
                    .main-content {
                        flex: 1;
                        overflow-y: auto;
                        padding: 16px;
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
					.input-row {
						display: flex;
						gap: 2px;
                        background: var(--vscode-input-background);
                        border: 1px solid var(--vscode-input-border);
                        border-radius: 6px;
                        overflow: hidden;
                        transition: border-color 0.2s;
					}
                    .input-row:focus-within {
                        border-color: var(--vscode-focusBorder);
                    }
					select, input, textarea {
						background: transparent;
						color: var(--vscode-input-foreground);
						border: none;
						padding: 8px 10px;
						outline: none;
					}
					.method-select {
						width: 90px;
                        font-weight: bold;
                        color: #a855f7;
                        border-right: 1px solid var(--vscode-input-border);
                        cursor: pointer;
					}
					.url-input {
						flex-grow: 1;
                        font-family: var(--vscode-editor-font-family);
					}
					
                    .tabs {
                        display: flex;
                        border-bottom: 1px solid var(--border-color);
                        margin-bottom: 8px;
                    }
                    .tab {
                        padding: 8px 12px;
                        cursor: pointer;
                        opacity: 0.6;
                        border-bottom: 2px solid transparent;
                        font-weight: 500;
                    }
                    .tab.active {
                        opacity: 1;
                        border-bottom-color: #6366f1;
                        color: #6366f1;
                    }
                    .tab-content {
                        display: none;
                    }
                    .tab-content.active {
                        display: block;
                    }

					textarea {
						width: 100%;
						resize: vertical;
						min-height: 120px;
						font-family: var(--vscode-editor-font-family);
                        background: var(--vscode-input-background);
                        border: 1px solid var(--vscode-input-border);
                        border-radius: 6px;
                        padding: 8px;
					}
                    
                    .actions {
                        display: flex;
                        justify-content: flex-end;
                    }

					.btn-send {
						background: var(--primary-gradient);
						color: white;
						border: none;
						padding: 10px 24px;
						cursor: pointer;
						font-weight: 700;
                        border-radius: 6px;
                        transition: transform 0.1s, opacity 0.2s;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        width: 100%;
					}
					.btn-send:hover {
						opacity: 0.9;
                        transform: translateY(-1px);
					}
                    .btn-send:active {
                        transform: translateY(0);
                    }

					.response-section {
						margin-top: 8px;
						display: none;
                        background: var(--vscode-editor-background);
                        border-radius: 8px;
                        border: 1px solid var(--border-color);
                        overflow: hidden;
					}
					.response-header {
						display: flex;
						justify-content: space-between;
                        align-items: center;
						padding: 10px 14px;
                        background: rgba(255,255,255,0.03);
                        border-bottom: 1px solid var(--border-color);
					}
					.status-badge {
						padding: 3px 8px;
						border-radius: 4px;
						font-weight: 700;
                        font-size: 11px;
					}
					.status-2xx { background: #10b981; color: white; }
					.status-4xx, .status-5xx { background: #ef4444; color: white; }
					
                    .response-info {
                        display: flex;
                        gap: 12px;
                        font-size: 11px;
                        opacity: 0.6;
                    }

					.response-body {
						padding: 12px;
						overflow: auto;
						max-height: 500px;
						white-space: pre-wrap;
						font-family: var(--vscode-editor-font-family);
                        font-size: 12px;
					}
                    
                    .loading {
                        display: none;
                        text-align: center;
                        padding: 20px;
                    }
                    .spinner {
                        width: 24px;
                        height: 24px;
                        border: 3px solid rgba(255,255,255,0.3);
                        border-radius: 50%;
                        border-top-color: #6366f1;
                        animation: spin 1s ease-in-out infinite;
                        margin: 0 auto 10px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }

                    .error-box {
                        background: rgba(239, 68, 68, 0.1);
                        border-left: 3px solid #ef4444;
                        padding: 12px;
                        color: #ef4444;
                        margin-top: 10px;
                        display: none;
                        font-size: 12px;
                        border-radius: 4px;
                    }

                    ::-webkit-scrollbar { width: 8px; }
                    ::-webkit-scrollbar-track { background: transparent; }
                    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
				</style>
			</head>
			<body>
				<div class="app-container">
                    <div class="header">
                        <h1>SHELLREQ</h1>
                        <span class="v">v0.2.0</span>
                    </div>

                    <div class="main-content">
                        <div class="input-row">
                            <select id="method" class="method-select">
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="PATCH">PATCH</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                            <input type="text" id="url" class="url-input" placeholder="Enter API URL..." value="https://jsonplaceholder.typicode.com/todos/1">
                        </div>
                        
                        <div>
                            <div class="tabs">
                                <div class="tab active" data-target="headers-tab">Headers</div>
                                <div class="tab" id="body-tab-btn" data-target="body-tab">Body</div>
                                <div class="tab" data-target="auth-tab">Auth</div>
                            </div>

                            <div id="headers-tab" class="tab-content active">
                                <textarea id="headers" placeholder="Key: Value&#10;Authorization: Bearer ..."></textarea>
                            </div>

                            <div id="body-tab" class="tab-content">
                                <textarea id="body" placeholder='{ "key": "value" }'></textarea>
                            </div>

                            <div id="auth-tab" class="tab-content">
                                <p style="opacity: 0.6; font-style: italic;">Auth presets coming soon...</p>
                            </div>
                        </div>

                        <div class="actions">
                            <button id="sendBtn" class="btn-send">Send Request</button>
                        </div>

                        <div id="loading" class="loading">
                            <div class="spinner"></div>
                            <div>Executing Request...</div>
                        </div>

                        <div id="error" class="error-box"></div>

                        <div id="response" class="response-section">
                            <div class="response-header">
                                <div>
                                    <span id="resStatus" class="status-badge">200 OK</span>
                                </div>
                                <div class="response-info">
                                    <span id="resTime">0ms</span>
                                    <span id="resSize">0 B</span>
                                </div>
                            </div>
                            <div id="resBody" class="response-body"></div>
                        </div>
                    </div>
                </div>

				<script>
					const vscode = acquireVsCodeApi();
					
                    // State preservation
                    let state = vscode.getState() || {
                        method: 'GET',
                        url: 'https://jsonplaceholder.typicode.com/todos/1',
                        headers: '',
                        body: ''
                    };

                    function updateState() {
                        vscode.setState({
                            method: document.getElementById('method').value,
                            url: document.getElementById('url').value,
                            headers: document.getElementById('headers').value,
                            body: document.getElementById('body').value
                        });
                    }

					const methodSelect = document.getElementById('method');
					const urlInput = document.getElementById('url');
					const headersInput = document.getElementById('headers');
					const bodyInput = document.getElementById('body');
					const sendBtn = document.getElementById('sendBtn');
					const responseContainer = document.getElementById('response');
                    const loadingIndicator = document.getElementById('loading');
                    const errorDisplay = document.getElementById('error');
                    
                    // Initialization
                    methodSelect.value = state.method;
                    urlInput.value = state.url;
                    headersInput.value = state.headers;
                    bodyInput.value = state.body;

                    // Tab System
                    document.querySelectorAll('.tab').forEach(tab => {
                        tab.addEventListener('click', () => {
                            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                            
                            tab.classList.add('active');
                            document.getElementById(tab.dataset.target).classList.add('active');
                        });
                    });

					sendBtn.addEventListener('click', () => {
						const url = urlInput.value;
						if (!url) return;

                        updateState();
                        loadingIndicator.style.display = 'block';
                        errorDisplay.style.display = 'none';
                        responseContainer.style.display = 'none';

						vscode.postMessage({
							type: 'runRequest',
							value: {
								method: methodSelect.value,
								url: url,
								headers: headersInput.value,
								body: bodyInput.value
							}
						});
					});

					window.addEventListener('message', event => {
						const message = event.data;
						switch (message.type) {
							case 'response':
								showResponse(message.value);
								break;
                            case 'error':
                                showError(message.value);
                                break;
						}
					});

                    function showError(err) {
                        loadingIndicator.style.display = 'none';
                        errorDisplay.innerText = err;
                        errorDisplay.style.display = 'block';
                    }

					function showResponse(res) {
						loadingIndicator.style.display = 'none';
						responseContainer.style.display = 'block';
						
						const statusBadge = document.getElementById('resStatus');
						statusBadge.innerText = res.status + ' ' + res.statusText;
						statusBadge.className = 'status-badge ' + (res.status >= 200 && res.status < 300 ? 'status-2xx' : (res.status >= 400 ? 'status-4xx' : ''));
						
						document.getElementById('resTime').innerText = res.duration + 'ms';
						document.getElementById('resSize').innerText = res.size;
						
						const bodyDisplay = document.getElementById('resBody');
						try {
							const json = JSON.parse(res.data);
							bodyDisplay.innerText = JSON.stringify(json, null, 2);
						} catch (e) {
							bodyDisplay.innerText = res.data;
						}
					}

                    // Auto-save state on input
                    [methodSelect, urlInput, headersInput, bodyInput].forEach(el => {
                        el.addEventListener('input', updateState);
                    });
				</script>
			</body>
			</html>`;
    }
}
