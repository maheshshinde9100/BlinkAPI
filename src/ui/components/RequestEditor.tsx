import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import axios from 'axios';
import { saveHistory } from '../../utils/storage.js';

interface RequestEditorProps {
  initialMethod?: string;
  initialUrl?: string;
  onResponse: (response: any) => void;
}

export const RequestEditor: React.FC<RequestEditorProps> = ({ 
    onResponse, 
    initialMethod = 'GET', 
    initialUrl = 'https://jsonplaceholder.typicode.com/todos/1' 
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [method, setMethod] = useState(initialMethod);
  const [focus, setFocus] = useState<'method' | 'url'>('method');
  const [loading, setLoading] = useState(false);

  // Sync with props if they change (e.g. from history selection)
  React.useEffect(() => {
    setUrl(initialUrl);
    setMethod(initialMethod);
  }, [initialUrl, initialMethod]);

  const methods = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' },
  ];

  const handleSend = async () => {
    setLoading(true);
    saveHistory({ method, url });
    try {
      const startTime = Date.now();
      const response = await axios({
        method: method.toLowerCase() as any,
        url,
        validateStatus: () => true,
      });
      const duration = Date.now() - startTime;
      onResponse({ ...response, duration });
    } catch (error: any) {
      onResponse({ 
        status: error.response?.status || 500,
        statusText: error.message,
        data: error.response?.data || 'Request failed',
        headers: error.response?.headers || {},
        duration: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useInput((input, key) => {
    if (key.return && focus === 'url') {
      handleSend();
    }
    if (key.downArrow || key.upArrow) {
        setFocus(prev => prev === 'method' ? 'url' : 'method');
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="magenta">REQUEST EDITOR</Text>
      </Box>

      <Box marginBottom={1}>
        <Box width={10}>
          <Text>Method:</Text>
        </Box>
        {focus === 'method' ? (
          <SelectInput 
            items={methods} 
            onSelect={(item) => {
                setMethod(item.value);
                setFocus('url');
            }} 
          />
        ) : (
          <Text color="cyan">{method}</Text>
        )}
      </Box>

      <Box marginBottom={1}>
        <Box width={10}>
          <Text>URL:</Text>
        </Box>
        {focus === 'url' ? (
          <TextInput 
            value={url} 
            onChange={setUrl} 
            onSubmit={handleSend}
          />
        ) : (
          <Text color="gray">{url}</Text>
        )}
      </Box>

      {loading && (
        <Box marginTop={1}>
          <Text color="yellow">Sending request...</Text>
        </Box>
      )}

      <Box marginTop={2}>
        <Text dimColor>Use Arrow Keys to switch fields. Press Enter on URL to send.</Text>
      </Box>
    </Box>
  );
};
