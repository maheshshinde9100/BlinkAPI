import * as vscode from 'vscode';
import axios from 'axios';

export class ShellReqViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'shellreq.clientView';

    private _view?: vscode.WebviewView;
    private _onDidSaveCollection = new vscode.EventEmitter<any>();
    public readonly onDidSaveCollection = this._onDidSaveCollection.event;

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
                case 'saveCollection':
                    {
                        this._onDidSaveCollection.fire(data.value);
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
            this._view.webview.postMessage({ type: 'status', value: 'Sending...' });
            
            const startedAt = Date.now();
            let parsedBody = undefined;
            if (requestConfig.body && (requestConfig.method !== 'GET' && requestConfig.method !== 'DELETE')) {
                try {
                    parsedBody = JSON.parse(requestConfig.body);
                } catch (e) {
                    parsedBody = requestConfig.body;
                }
            }

            // Headers parsing
            const headers = this._parseHeaders(requestConfig.headers);

            const response = await axios({
                method: requestConfig.method,
                url: requestConfig.url,
                headers: headers,
                data: parsedBody,
                validateStatus: () => true,
                transformResponse: [(data) => data] 
            });

            const duration = Date.now() - startedAt;
            const size = this._estimateSize(response.data);

            const responseData = {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data: response.data,
                duration: duration,
                size: size
            };

            this._view.webview.postMessage({
                type: 'response',
                value: responseData
            });

            // Save to history (we could use message to extension if we want global history)
            this._view.webview.postMessage({
                type: 'saveHistory',
                value: {
                    method: requestConfig.method,
                    url: requestConfig.url,
                    time: new Date().toLocaleTimeString()
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
        if (!data) return '0 B';
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
						--tc-primary: #6366f1;
                        --tc-accent: #a855f7;
                        --tc-bg: var(--vscode-sideBar-background);
                        --tc-input-bg: var(--vscode-input-background);
                        --tc-border: var(--vscode-widget-border, rgba(255,255,255,0.1));
					}
					body {
						padding: 0;
						margin: 0;
						color: var(--vscode-foreground);
						font-family: var(--vscode-font-family);
                        font-size: 12px;
                        background: var(--tc-bg);
                        overflow: hidden;
					}
                    * { box-sizing: border-box; }
					
                    .app {
						display: flex;
						flex-direction: column;
						height: 100vh;
					}
					
                    .url-bar {
                        padding: 10px;
                        display: flex;
                        gap: 4px;
                        border-bottom: 1px solid var(--tc-border);
                        background: var(--vscode-editor-background);
                    }
                    
                    .method-select {
                        background: var(--tc-input-bg);
                        color: var(--tc-accent);
                        border: 1px solid var(--vscode-input-border);
                        border-radius: 4px;
                        padding: 4px 6px;
                        font-weight: 800;
                        outline: none;
                        cursor: pointer;
                    }
                    
                    .url-input-container {
                        flex: 1;
                        position: relative;
                    }
                    
                    .url-input {
                        width: 100%;
                        background: var(--tc-input-bg);
                        color: var(--vscode-input-foreground);
                        border: 1px solid var(--vscode-input-border);
                        border-radius: 4px;
                        padding: 6px 8px;
                        outline: none;
                        font-family: var(--vscode-editor-font-family);
                    }
                    
                    .btn-send {
                        background: var(--tc-primary);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 0 12px;
                        font-weight: bold;
                        cursor: pointer;
                        text-transform: uppercase;
                        font-size: 11px;
                        transition: filter 0.2s;
                    }
                    
                    .btn-send:hover { filter: brightness(1.1); }
                    
                    .btn-save {
                        background: transparent;
                        color: var(--tc-primary);
                        border: 1px solid var(--tc-primary);
                        border-radius: 4px;
                        padding: 0 8px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 10px;
                        margin-left: 4px;
                    }

                    .main-tabs {
                        display: flex;
                        background: var(--vscode-editor-background);
                        border-bottom: 1px solid var(--tc-border);
                        padding: 0 10px;
                        overflow-x: auto;
                    }
                    
                    .tab-item {
                        padding: 8px 10px;
                        cursor: pointer;
                        opacity: 0.6;
                        border-bottom: 2px solid transparent;
                        font-weight: 600;
                        white-space: nowrap;
                    }
                    
                    .tab-item.active {
                        opacity: 1;
                        border-bottom-color: var(--tc-primary);
                        color: var(--tc-primary);
                    }
                    
                    .content {
                        flex: 1;
                        overflow-y: auto;
                        padding: 10px;
                    }
                    
                    .tab-pane { display: none; }
                    .tab-pane.active { display: block; }
                    
                    textarea {
                        width: 100%;
                        min-height: 120px;
                        background: var(--tc-input-bg);
                        color: var(--vscode-input-foreground);
                        border: 1px solid var(--vscode-input-border);
                        border-radius: 4px;
                        padding: 8px;
                        font-family: var(--vscode-editor-font-family);
                        resize: vertical;
                        outline: none;
                    }
                    
                    /* Response Section */
                    .response-container {
                        height: 45%;
                        border-top: 1px solid var(--tc-border);
                        display: flex;
                        flex-direction: column;
                        background: var(--vscode-editor-background);
                        box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
                    }
                    
                    .res-header {
                        padding: 8px 12px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid var(--tc-border);
                        background: rgba(255,255,255,0.02);
                    }
                    
                    .status-badge {
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-weight: 800;
                        font-size: 10px;
                    }
                    .s-ok { background: #10b981; color: #fff; }
                    .s-err { background: #ef4444; color: #fff; }
                    
                    .res-info {
                        display: flex;
                        gap: 10px;
                        font-size: 10px;
                        opacity: 0.6;
                    }
                    
                    .res-content {
                        flex: 1;
                        overflow: auto;
                        padding: 10px;
                        font-family: var(--vscode-editor-font-family);
                        white-space: pre-wrap;
                        font-size: 11px;
                        background: var(--vscode-editor-background);
                    }

                    .loading {
                        position: absolute;
                        right: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        display: none;
                    }
                    
                    .spinner {
                        width: 14px;
                        height: 14px;
                        border: 2px solid rgba(255,255,255,0.2);
                        border-top-color: var(--tc-primary);
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                    }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                    .history-item {
                        padding: 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 4px;
                        background: rgba(255,255,255,0.03);
                        border: 1px solid transparent;
                    }
                    .history-item:hover { background: rgba(255,255,255,0.08); border-color: var(--tc-primary); }
                    .history-method { font-weight: 800; font-size: 9px; min-width: 35px; text-align: center; border-radius: 3px; padding: 1px; }
                    .history-url { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: 0.8; font-size: 11px; }
				</style>
			</head>
			<body>
				<div class="app">
                    <!-- URL BAR -->
                    <div class="url-bar">
                        <select id="method" class="method-select">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="PATCH">PATCH</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                        <div class="url-input-container">
                            <input type="text" id="url" class="url-input" placeholder="Enter API URL">
                            <div id="loading" class="loading"><div class="spinner"></div></div>
                        </div>
                        <button id="sendBtn" class="btn-send">SEND</button>
                        <button id="saveBtn" class="btn-save" title="Save to Collections">SAVE</button>
                    </div>

                    <!-- TABS -->
                    <div class="main-tabs">
                        <div class="tab-item active" data-tab="tab-headers">Headers</div>
                        <div class="tab-item" data-tab="tab-body">Body</div>
                        <div class="tab-item" data-tab="tab-history">History</div>
                        <div class="tab-item" data-tab="tab-collections">Collections</div>
                    </div>

                    <div class="content">
                        <!-- HEADERS TAB -->
                        <div id="tab-headers" class="tab-pane active">
                            <textarea id="headers" placeholder="Key: Value&#10;Authorization: Bearer ..."></textarea>
                        </div>
                        
                        <!-- BODY TAB -->
                        <div id="tab-body" class="tab-pane">
                            <textarea id="body" placeholder='{ "key": "value" }'></textarea>
                        </div>

                        <!-- HISTORY TAB -->
                        <div id="tab-history" class="tab-pane">
                            <div id="history-list"></div>
                        </div>

                        <!-- COLLECTIONS TAB -->
                        <div id="tab-collections" class="tab-pane">
                            <div id="collections-list"></div>
                        </div>
                    </div>

                    <!-- RESPONSE -->
                    <div id="response" class="response-container" style="display: none;">
                        <div class="res-header">
                            <div>
                                <span id="resStatus" class="status-badge s-ok">200 OK</span>
                            </div>
                            <div class="res-info">
                                <span id="resTime">0ms</span>
                                <span id="resSize">0 B</span>
                            </div>
                        </div>
                        <div id="resBody" class="res-content"></div>
                    </div>
                </div>

				<script>
					const vscode = acquireVsCodeApi();
					
                    // State
                    let state = vscode.getState() || {
                        method: 'GET',
                        url: 'https://jsonplaceholder.typicode.com/todos/1',
                        headers: '',
                        body: '',
                        history: [],
                        collections: []
                    };

                    const els = {
                        method: document.getElementById('method'),
                        url: document.getElementById('url'),
                        headers: document.getElementById('headers'),
                        body: document.getElementById('body'),
                        sendBtn: document.getElementById('sendBtn'),
                        saveBtn: document.getElementById('saveBtn'),
                        loading: document.getElementById('loading'),
                        response: document.getElementById('response'),
                        resStatus: document.getElementById('resStatus'),
                        resTime: document.getElementById('resTime'),
                        resSize: document.getElementById('resSize'),
                        resBody: document.getElementById('resBody'),
                        historyList: document.getElementById('history-list'),
                        collectionsList: document.getElementById('collections-list')
                    };

                    function updateState() {
                        vscode.setState({
                            method: els.method.value,
                            url: els.url.value,
                            headers: els.headers.value,
                            body: els.body.value,
                            history: state.history,
                            collections: state.collections
                        });
                    }

                    // Init
                    els.method.value = state.method;
                    els.url.value = state.url;
                    els.headers.value = state.headers;
                    els.body.value = state.body;
                    renderHistory();
                    renderCollections();

                    // Tabs
                    document.querySelectorAll('.tab-item').forEach(tab => {
                        tab.addEventListener('click', () => {
                            document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
                            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                            tab.classList.add('active');
                            const target = document.getElementById(tab.dataset.tab);
                            if (target) target.classList.add('active');
                        });
                    });

					els.sendBtn.addEventListener('click', () => {
						const url = els.url.value;
						if (!url) return;

                        updateState();
                        els.loading.style.display = 'block';
                        els.response.style.display = 'none';

						vscode.postMessage({
							type: 'runRequest',
							value: {
								method: els.method.value,
								url: url,
								headers: els.headers.value,
								body: els.body.value
							}
						});
					});

                    els.saveBtn.addEventListener('click', () => {
                        const item = {
                            method: els.method.value,
                            url: els.url.value,
                            headers: els.headers.value,
                            body: els.body.value,
                            name: els.url.value.split('/').pop() || 'New Request'
                        };
                        state.collections.push(item);
                        updateState();
                        renderCollections();
                        vscode.postMessage({ type: 'saveCollection', value: item });
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
                            case 'saveHistory':
                                addToHistory(message.value);
                                break;
						}
					});

                    function showError(err) {
                        els.loading.style.display = 'none';
                        els.response.style.display = 'flex';
                        els.resStatus.innerText = 'ERROR';
                        els.resStatus.className = 'status-badge s-err';
                        els.resBody.innerText = err;
                    }

					function showResponse(res) {
						els.loading.style.display = 'none';
						els.response.style.display = 'flex';
						
						els.resStatus.innerText = res.status + ' ' + res.statusText;
						els.resStatus.className = 'status-badge ' + (res.status >= 200 && res.status < 300 ? 's-ok' : 's-err');
						
						els.resTime.innerText = res.duration + 'ms';
						els.resSize.innerText = res.size;
						
						try {
							const json = JSON.parse(res.data);
							els.resBody.innerText = JSON.stringify(json, null, 2);
						} catch (e) {
							els.resBody.innerText = res.data;
						}
					}

                    function addToHistory(item) {
                        state.history.unshift(item);
                        if (state.history.length > 20) state.history.pop();
                        updateState();
                        renderHistory();
                    }

                    function renderHistory() {
                        els.historyList.innerHTML = '';
                        state.history.forEach(item => {
                            const div = document.createElement('div');
                            div.className = 'history-item';
                            div.innerHTML = \`<span class="history-method" style="background: \${getMethodBg(item.method)}; color: #fff">\${item.method}</span><span class="history-url">\${item.url}</span>\`;
                            div.onclick = () => {
                                els.method.value = item.method;
                                els.url.value = item.url;
                                updateState();
                            };
                            els.historyList.appendChild(div);
                        });
                    }

                    function renderCollections() {
                        els.collectionsList.innerHTML = '';
                        state.collections.forEach((item, idx) => {
                            const div = document.createElement('div');
                            div.className = 'history-item';
                            div.innerHTML = \`<span class="history-method" style="background: \${getMethodBg(item.method)}; color: #fff">\${item.method}</span><span class="history-url">\${item.name}</span>\`;
                            div.onclick = () => {
                                els.method.value = item.method;
                                els.url.value = item.url;
                                els.headers.value = item.headers;
                                els.body.value = item.body;
                                updateState();
                            };
                            els.collectionsList.appendChild(div);
                        });
                    }

                    function getMethodBg(m) {
                        const colors = { GET: '#10b981', POST: '#a855f7', PUT: '#f59e0b', DELETE: '#ef4444', PATCH: '#6366f1' };
                        return colors[m] || '#888';
                    }

                    // Auto-save
                    [els.method, els.url, els.headers, els.body].forEach(el => el.addEventListener('input', updateState));
				</script>
			</body>
			</html>`;
    }
}
