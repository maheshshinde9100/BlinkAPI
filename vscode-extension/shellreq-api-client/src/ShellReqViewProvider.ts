import * as vscode from 'vscode';
import axios from 'axios';

export class ShellReqViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'shellreq.clientView';
    private _view?: vscode.WebviewView;
    private _onDidUpdateState = new vscode.EventEmitter<any>();
    public readonly onDidUpdateState = this._onDidUpdateState.event;
    private _onDidReady = new vscode.EventEmitter<void>();
    public readonly onDidReady = this._onDidReady.event;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtml(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'ready':
                    this._onDidReady.fire();
                    break;
                case 'runRequest':
                    this._handleRequest(data.value);
                    break;
                case 'updateState':
                    this._onDidUpdateState.fire(data.value);
                    break;
            }
        });
    }

    public updateState(state: any) {
        if (this._view) {
            this._view.webview.postMessage({ type: 'syncState', value: state });
        }
    }

    private async _handleRequest(cfg: any) {
        if (!this._view) { return; }
        try {
            const startedAt = Date.now();
            let body: any = undefined;
            if (cfg.body && cfg.method !== 'GET' && cfg.method !== 'DELETE') {
                try { body = JSON.parse(cfg.body); } catch { body = cfg.body; }
            }
            
            const response = await axios({
                method: cfg.method, 
                url: cfg.url,
                headers: cfg.headers,
                data: body, 
                validateStatus: () => true,
                transformResponse: [(d) => d]
            });

            const duration = Date.now() - startedAt;
            const bytes = response.data ? String(response.data).length : 0;
            const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
            
            this._view.webview.postMessage({ 
                type: 'response', 
                value: { 
                    status: response.status, 
                    statusText: response.statusText, 
                    headers: response.headers, 
                    data: response.data, 
                    duration, 
                    size 
                } 
            });
            this._view.webview.postMessage({ 
                type: 'addHistory', 
                value: { method: cfg.method, url: cfg.url } 
            });
        } catch (e: any) {
            this._view.webview.postMessage({ 
                type: 'error', 
                value: e.response?.data || e.message || 'Request failed' 
            });
        }
    }

    private _getHtml(webview: vscode.Webview): string {
        const nonce = getNonce();
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <title>ShellReq API Client</title>
    <style>
        :root {
            --accent: #6366f1;
            --accent-hover: #4f46e5;
            --bg-sidebar: var(--vscode-sideBar-background);
            --bg-input: var(--vscode-input-background);
            --fg-input: var(--vscode-input-foreground);
            --border: var(--vscode-widget-border);
            --font: var(--vscode-font-family);
            --editor-font: var(--vscode-editor-font-family);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: var(--font);
            font-size: 12px;
            color: var(--vscode-foreground);
            background: var(--bg-sidebar);
            overflow: hidden;
            height: 100vh;
        }

        .app {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        /* HEADER */
        .header {
            padding: 12px;
            background: var(--vscode-editor-background);
            border-bottom: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .url-bar {
            display: flex;
            gap: 4px;
            align-items: stretch;
        }

        .method-select {
            background: var(--bg-input);
            color: var(--accent);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            padding: 0 8px;
            font-weight: 700;
            font-size: 11px;
            outline: none;
            cursor: pointer;
        }

        .url-input-wrap {
            flex: 1;
            position: relative;
            display: flex;
        }

        .url-input {
            width: 100%;
            background: var(--bg-input);
            color: var(--fg-input);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            padding: 6px 32px 6px 10px;
            font-family: var(--editor-font);
            font-size: 12px;
            outline: none;
        }

        .url-input:focus { border-color: var(--accent); }

        .btn-send {
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0 16px;
            font-weight: 600;
            font-size: 11px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-send:hover { background: var(--accent-hover); }
        .btn-send:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-save {
            background: transparent;
            color: var(--accent);
            border: 1px solid var(--accent);
            border-radius: 4px;
            padding: 4px 10px;
            font-weight: 600;
            font-size: 11px;
            cursor: pointer;
        }

        /* TABS */
        .tabs-container {
            background: var(--vscode-editor-background);
            border-bottom: 1px solid var(--border);
            display: flex;
            overflow-x: auto;
            scrollbar-width: none;
        }

        .tab {
            padding: 10px 14px;
            cursor: pointer;
            opacity: 0.6;
            border-bottom: 2px solid transparent;
            font-weight: 500;
            white-space: nowrap;
            transition: all 0.2s;
        }

        .tab:hover { opacity: 1; color: var(--accent); }
        .tab.active {
            opacity: 1;
            color: var(--accent);
            border-bottom-color: var(--accent);
        }

        /* CONTENT */
        .content {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .pane { display: none; height: 100%; }
        .pane.active { display: flex; flex-direction: column; }

        /* KEY-VALUE EDITOR */
        .kv-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .kv-row {
            display: flex;
            gap: 4px;
            margin-bottom: 4px;
        }

        .kv-input {
            flex: 1;
            background: var(--bg-input);
            color: var(--fg-input);
            border: 1px solid var(--vscode-input-border);
            border-radius: 3px;
            padding: 4px 8px;
            font-size: 11px;
            font-family: var(--editor-font);
            outline: none;
        }

        .kv-input:focus { border-color: var(--accent); }

        .kv-del {
            background: transparent;
            border: none;
            color: var(--vscode-errorForeground);
            cursor: pointer;
            padding: 0 4px;
            opacity: 0.5;
        }

        .kv-del:hover { opacity: 1; }

        .btn-add-kv {
            align-self: flex-start;
            background: transparent;
            border: none;
            color: var(--accent);
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            padding: 4px 0;
        }

        /* TEXTAREA */
        textarea {
            width: 100%;
            flex: 1;
            background: var(--bg-input);
            color: var(--fg-input);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            padding: 10px;
            font-family: var(--editor-font);
            font-size: 12px;
            resize: none;
            outline: none;
            min-height: 150px;
        }

        /* LISTS */
        .list { display: flex; flex-direction: column; gap: 4px; }
        .list-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            border-radius: 4px;
            background: rgba(128, 128, 128, 0.05);
            cursor: pointer;
            transition: background 0.2s;
            border: 1px solid transparent;
        }

        .list-item:hover {
            background: rgba(128, 128, 128, 0.1);
            border-color: var(--accent);
        }

        .badge {
            font-size: 9px;
            font-weight: 800;
            padding: 2px 4px;
            border-radius: 3px;
            color: white;
            min-width: 40px;
            text-align: center;
        }

        .item-url {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            opacity: 0.8;
            font-family: var(--editor-font);
            font-size: 11px;
        }

        /* RESPONSE SECTION */
        .response {
            height: 45%;
            border-top: 1px solid var(--border);
            background: var(--vscode-editor-background);
            display: none;
            flex-direction: column;
        }

        .res-header {
            padding: 8px 12px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .res-status-wrap { display: flex; align-items: center; gap: 10px; }
        
        .status-badge {
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 10px;
            color: white;
        }

        .status-2xx { background: #10b981; }
        .status-3xx { background: #f59e0b; }
        .status-4xx, .status-5xx { background: #ef4444; }

        .res-info { font-size: 10px; opacity: 0.6; display: flex; gap: 10px; }

        .res-tabs { display: flex; gap: 4px; margin-top: 4px; }
        .rtab {
            font-size: 10px;
            font-weight: 600;
            padding: 2px 8px;
            cursor: pointer;
            border-radius: 3px;
            opacity: 0.6;
        }

        .rtab.active {
            opacity: 1;
            background: rgba(99, 102, 241, 0.15);
            color: var(--accent);
        }

        .res-content {
            flex: 1;
            overflow: auto;
            padding: 10px;
            font-family: var(--editor-font);
            font-size: 12px;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .loading-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.2);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 100;
        }

        .spinner {
            width: 24px; height: 24px;
            border: 3px solid rgba(99, 102, 241, 0.2);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state {
            opacity: 0.4;
            text-align: center;
            padding: 40px 20px;
            font-style: italic;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.5); }
    </style>
</head>
<body>
    <div class="app">
        <div class="header">
            <div class="url-bar">
                <select id="method" class="method-select">
                    <option>GET</option><option>POST</option><option>PUT</option>
                    <option>PATCH</option><option>DELETE</option>
                </select>
                <div class="url-input-wrap">
                    <input id="url" class="url-input" placeholder="https://api.example.com">
                </div>
                <button id="sendBtn" class="btn-send">SEND</button>
            </div>
            <div style="display:flex; justify-content: flex-end;">
                <button id="saveBtn" class="btn-save">SAVE</button>
            </div>
        </div>

        <div class="tabs-container">
            <div class="tab active" data-pane="pane-params">Params</div>
            <div class="tab" data-pane="pane-headers">Headers</div>
            <div class="tab" data-pane="pane-body">Body</div>
            <div class="tab" data-pane="pane-history">History</div>
            <div class="tab" data-pane="pane-collections">Collections</div>
        </div>

        <div class="content">
            <div id="pane-params" class="pane active">
                <div id="params-list" class="kv-container"></div>
                <button class="btn-add-kv" id="addParamBtn">+ Add Parameter</button>
            </div>
            <div id="pane-headers" class="pane">
                <div id="headers-list" class="kv-container"></div>
                <button class="btn-add-kv" id="addHeaderBtn">+ Add Header</button>
            </div>
            <div id="pane-body" class="pane">
                <textarea id="body" placeholder='{ "key": "value" }'></textarea>
            </div>
            <div id="pane-history" class="pane">
                <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="opacity:0.6; font-size:10px; font-weight:600;">RECENT</span>
                    <button id="clearHistoryBtn" style="background:none; border:none; color:var(--vscode-errorForeground); cursor:pointer; font-size:10px;">Clear</button>
                </div>
                <div id="history-list" class="list"></div>
            </div>
            <div id="pane-collections" class="pane">
                <div style="margin-bottom: 8px;"><span style="opacity:0.6; font-size:10px; font-weight:600;">COLLECTIONS</span></div>
                <div id="collections-list" class="list"></div>
            </div>
        </div>

        <div id="response" class="response">
            <div class="res-header">
                <div class="res-status-wrap">
                    <div id="res-status" class="status-badge">200 OK</div>
                    <div class="res-tabs">
                        <div class="rtab active" id="resBodyTab">Body</div>
                        <div class="rtab" id="resHeadersTab">Headers</div>
                    </div>
                </div>
                <div class="res-info">
                    <span id="res-time">0 ms</span>
                    <span id="res-size">0 B</span>
                </div>
            </div>
            <div id="res-body" class="res-content"></div>
            <div id="res-headers" class="res-content" style="display:none"></div>
        </div>

        <div id="loading" class="loading-overlay"><div class="spinner"></div></div>
    </div>

    <script nonce="${nonce}">
        (function() {
            const vscode = acquireVsCodeApi();
            let state = vscode.getState() || { 
                method: 'GET', url: '', body: '', 
                headers: [{k:'Content-Type',v:'application/json'}], 
                params: [], history: [], collections: [] 
            };

            const $ = id => document.getElementById(id);
            const els = {
                method: $('method'), url: $('url'), body: $('body'),
                sendBtn: $('sendBtn'), saveBtn: $('saveBtn'),
                loading: $('loading'), response: $('response'),
                resStatus: $('res-status'), resTime: $('res-time'), resSize: $('res-size'),
                resBody: $('res-body'), resHeaders: $('res-headers'),
                historyList: $('history-list'), collectionsList: $('collections-list'),
                paramsList: $('params-list'), headersList: $('headers-list'),
                resBodyTab: $('resBodyTab'), resHeadersTab: $('resHeadersTab'),
                addParamBtn: $('addParamBtn'), addHeaderBtn: $('addHeaderBtn'),
                clearHistoryBtn: $('clearHistoryBtn')
            };

            function save() { vscode.setState(state); }

            function renderKV(type) {
                const container = els[type + 'List'];
                container.innerHTML = '';
                if (!state[type]) state[type] = [];
                state[type].forEach((item, i) => {
                    const row = document.createElement('div');
                    row.className = 'kv-row';
                    row.innerHTML = \`
                        <input class="kv-input" placeholder="Key" value="\${item.k}">
                        <input class="kv-input" placeholder="Value" value="\${item.v}">
                        <button class="kv-del">✕</button>
                    \`;
                    const inputs = row.querySelectorAll('input');
                    inputs[0].oninput = (e) => { state[type][i].k = e.target.value; save(); };
                    inputs[1].oninput = (e) => { state[type][i].v = e.target.value; save(); };
                    row.querySelector('.kv-del').onclick = () => { state[type].splice(i,1); renderKV(type); save(); };
                    container.appendChild(row);
                });
            }

            function renderList(type) {
                const container = els[type + 'List'];
                container.innerHTML = '';
                if (!state[type] || state[type].length === 0) {
                    container.innerHTML = '<div class="empty-state">No items</div>';
                    return;
                }
                state[type].forEach((item, i) => {
                    const el = document.createElement('div');
                    el.className = 'list-item';
                    el.innerHTML = \`<span class="badge" style="background:\${getColor(item.method)}">\${item.method}</span><span class="item-url">\${item.name || item.url}</span>\`;
                    el.onclick = () => {
                        els.method.value = item.method;
                        els.url.value = item.url;
                        els.body.value = item.body || '';
                        state.method = item.method; state.url = item.url; state.body = item.body || '';
                        state.headers = item.headers ? [...item.headers] : [];
                        state.params = item.params ? [...item.params] : [];
                        renderKV('headers'); renderKV('params');
                        save();
                        document.querySelector('.tab[data-pane="pane-params"]').click();
                    };
                    container.appendChild(el);
                });
            }

            function getColor(m) {
                return {GET:'#10b981',POST:'#a855f7',PUT:'#f59e0b',PATCH:'#6366f1',DELETE:'#ef4444'}[m] || '#888';
            }

            // Events
            els.sendBtn.onclick = () => {
                const h = {};
                state.headers.forEach(x => { if(x.k.trim()) h[x.k.trim()] = x.v; });
                let url = els.url.value.trim();
                const ps = state.params.filter(x => x.k.trim());
                if (ps.length) {
                    const qs = ps.map(x => \`\${encodeURIComponent(x.k.trim())}=\${encodeURIComponent(x.v)}\`).join('&');
                    url += (url.includes('?') ? '&' : '?') + qs;
                }
                if (!url) return;
                els.loading.style.display = 'flex';
                els.sendBtn.disabled = true;
                els.response.style.display = 'none';
                vscode.postMessage({ type: 'runRequest', value: { method: els.method.value, url, headers: h, body: els.body.value } });
            };

            els.saveBtn.onclick = () => {
                const item = { method: els.method.value, url: els.url.value, headers: [...state.headers], params: [...state.params], body: els.body.value, name: els.url.value.split('/').pop() || 'Request' };
                state.collections.unshift(item);
                renderList('collections');
                save();
                vscode.postMessage({ type: 'updateState', value: { collections: state.collections } });
                els.saveBtn.textContent = 'SAVED ✓';
                setTimeout(() => els.saveBtn.textContent = 'SAVE', 2000);
            };

            els.addParamBtn.onclick = () => { state.params.push({k:'',v:''}); renderKV('params'); save(); };
            els.addHeaderBtn.onclick = () => { state.headers.push({k:'',v:''}); renderKV('headers'); save(); };
            els.clearHistoryBtn.onclick = () => { state.history = []; renderList('history'); save(); vscode.postMessage({ type: 'updateState', value: { history: [] } }); };

            document.querySelectorAll('.tab').forEach(t => {
                t.onclick = () => {
                    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
                    document.querySelectorAll('.pane').forEach(x => x.classList.remove('active'));
                    t.classList.add('active');
                    $(t.dataset.pane).classList.add('active');
                };
            });

            const switchResTab = (tab) => {
                els.resBodyTab.classList.toggle('active', tab === 'body');
                els.resHeadersTab.classList.toggle('active', tab === 'headers');
                els.resBody.style.display = tab === 'body' ? 'block' : 'none';
                els.resHeaders.style.display = tab === 'headers' ? 'block' : 'none';
            };
            els.resBodyTab.onclick = () => switchResTab('body');
            els.resHeadersTab.onclick = () => switchResTab('headers');

            els.method.onchange = (e) => { state.method = e.target.value; save(); };
            els.url.oninput = (e) => { state.url = e.target.value; save(); };
            els.body.oninput = (e) => { state.body = e.target.value; save(); };

            window.addEventListener('message', e => {
                const msg = e.data;
                if (msg.type === 'syncState') {
                    if (msg.value.collections) state.collections = msg.value.collections;
                    if (msg.value.history) state.history = msg.value.history;
                    renderList('collections'); renderList('history');
                    save();
                }
                if (msg.type === 'response') {
                    els.loading.style.display = 'none';
                    els.sendBtn.disabled = false;
                    els.response.style.display = 'flex';
                    els.resStatus.textContent = \`\${msg.value.status} \${msg.value.statusText}\`;
                    els.resStatus.className = 'status-badge ' + (msg.value.status < 300 ? 'status-2xx' : msg.value.status < 400 ? 'status-3xx' : 'status-4xx');
                    els.resTime.textContent = \`\${msg.value.duration} ms\`;
                    els.resSize.textContent = msg.value.size;
                    try { const j = JSON.parse(msg.value.data); els.resBody.textContent = JSON.stringify(j, null, 2); }
                    catch { els.resBody.textContent = msg.value.data || '(No Content)'; }
                    let hStr = ''; Object.entries(msg.value.headers).forEach(([k,v]) => hStr += \`\${k}: \${v}\\n\`);
                    els.resHeaders.textContent = hStr;
                    switchResTab('body');
                }
                if (msg.type === 'addHistory') {
                    const item = { method: msg.value.method, url: msg.value.url, headers: [...state.headers], params: [...state.params], body: els.body.value };
                    state.history.unshift(item);
                    if (state.history.length > 50) state.history.pop();
                    renderList('history');
                    save();
                    vscode.postMessage({ type: 'updateState', value: { history: state.history } });
                }
                if (msg.type === 'error') {
                    els.loading.style.display = 'none';
                    els.sendBtn.disabled = false;
                    els.response.style.display = 'flex';
                    els.resStatus.textContent = 'ERROR';
                    els.resStatus.className = 'status-badge status-4xx';
                    els.resBody.textContent = typeof msg.value === 'string' ? msg.value : JSON.stringify(msg.value, null, 2);
                    switchResTab('body');
                }
            });

            // Start
            els.method.value = state.method;
            els.url.value = state.url;
            els.body.value = state.body;
            renderKV('headers'); renderKV('params');
            renderList('history'); renderList('collections');
            vscode.postMessage({ type: 'ready' });
        })();
    </script>
</body>
</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
