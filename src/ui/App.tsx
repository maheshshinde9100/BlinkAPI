import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { RequestEditor } from './components/RequestEditor.js';
import { ResponseViewer } from './components/ResponseViewer.js';
import { HistoryList } from './components/HistoryList.js';
import { CollectionsList } from './components/CollectionsList.js';
import { HistoryItem } from '../utils/storage.js';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'history' | 'collections'>('request');
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [requestData, setRequestData] = useState<Partial<HistoryItem>>({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/todos/1'
  });

  useInput((input, key) => {
    if (input === 'q') {
      process.exit();
    }
    if (key.tab) {
      setActiveTab((prev) => {
        if (prev === 'request') return 'response';
        if (prev === 'response') return 'history';
        if (prev === 'history') return 'collections';
        return 'request';
      });
    }
  });

  const renderTab = (name: string, isActive: boolean, id: string) => {
    const colors: Record<string, string> = {
      request: 'magenta',
      response: 'green',
      history: 'yellow',
      collections: 'cyan'
    };
    
    return (
      <Box 
        paddingX={2} 
        backgroundColor={isActive ? colors[id] : 'transparent'} 
        borderStyle="single" 
        borderColor={isActive ? colors[id] : 'gray'}
        marginRight={1}
      >
        <Text color={isActive ? 'black' : 'white'} bold={isActive}>
          {isActive ? '● ' : '○ '} {name.toUpperCase()}
        </Text>
      </Box>
    );
  };

  return (
    <Box flexDirection="column" height="100%" padding={1} backgroundColor="#000">
      <Header />
      
      {/* Tab Navigation */}
      <Box marginBottom={0} justifyContent="flex-start">
        {renderTab('Editor', activeTab === 'request', 'request')}
        {renderTab('Response', activeTab === 'response', 'response')}
        {renderTab('History', activeTab === 'history', 'history')}
        {renderTab('Collections', activeTab === 'collections', 'collections')}
      </Box>

      {/* Main Content Area */}
      <Box 
        flexGrow={1} 
        borderStyle="double" 
        borderColor={
          activeTab === 'request' ? 'magenta' : 
          activeTab === 'response' ? 'green' : 
          activeTab === 'history' ? 'yellow' : 'cyan'
        } 
        padding={1} 
        flexDirection="column"
      >
        {activeTab === 'request' && (
          <RequestEditor 
            initialMethod={requestData.method}
            initialUrl={requestData.url}
            onResponse={(res) => {
              setLastResponse(res);
              setActiveTab('response');
            }} 
          />
        )}
        {activeTab === 'response' && (
          <ResponseViewer response={lastResponse} />
        )}
        {activeTab === 'history' && (
          <HistoryList onSelect={(item) => {
            setRequestData({ method: item.method, url: item.url });
            setActiveTab('request');
          }} />
        )}
        {activeTab === 'collections' && (
          <CollectionsList onSelect={(item) => {
            setRequestData({ method: item.method, url: item.url });
            setActiveTab('request');
          }} />
        )}
      </Box>

      <Footer activeTab={activeTab} />
    </Box>
  );
};
