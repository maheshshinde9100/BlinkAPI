import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import Gradient from 'ink-gradient';
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

  const renderTab = (name: string, isActive: boolean) => (
    <Box 
      paddingX={2} 
      backgroundColor={isActive ? 'cyan' : 'transparent'} 
      borderStyle="round" 
      borderColor={isActive ? 'cyan' : 'gray'}
    >
      <Text color={isActive ? 'black' : 'white'} bold={isActive}>
        {name.toUpperCase()}
      </Text>
    </Box>
  );

  return (
    <Box flexDirection="column" height="100%" padding={1}>
      <Header />
      
      {/* Tab Navigation */}
      <Box marginBottom={1} justifyContent="center">
        {renderTab('Request', activeTab === 'request')}
        <Box width={2} />
        {renderTab('Response', activeTab === 'response')}
        <Box width={2} />
        {renderTab('History', activeTab === 'history')}
        <Box width={2} />
        {renderTab('Collections', activeTab === 'collections')}
      </Box>

      {/* Main Content Area */}
      <Box flexGrow={1} borderStyle="bold" borderColor="blue" padding={1} flexDirection="column">
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
