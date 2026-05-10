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

type Field = 'method' | 'url' | 'body';

export const RequestEditor: React.FC<RequestEditorProps> = ({ 
    onResponse, 
    initialMethod = 'GET', 
    initialUrl = 'https://jsonplaceholder.typicode.com/todos/1' 
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [method, setMethod] = useState(initialMethod);
  const [body, setBody] = useState('');
  const [focus, setFocus] = useState<Field>('method');
  const [loading, setLoading] = useState(false);

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
      let parsedBody = undefined;
      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          parsedBody = body;
        }
      }

      const response = await axios({
        method: method.toLowerCase() as any,
        url,
        data: parsedBody,
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
    // If we're on the URL or Body field, arrow keys move focus
    if (focus !== 'method') {
      if (key.downArrow) {
        setFocus(prev => {
          if (prev === 'url' && (method !== 'GET' && method !== 'DELETE')) return 'body';
          return prev;
        });
      }
      if (key.upArrow) {
        setFocus(prev => {
          if (prev === 'body') return 'url';
          if (prev === 'url') return 'method';
          return prev;
        });
      }
    }
    
    // Global ENTER to send if on URL
    if (key.return && focus === 'url') {
      handleSend();
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan" inverse>  REQUEST CONFIGURATION  </Text>
      </Box>

      {/* Method Selection */}
      <Box marginBottom={1}>
        <Box width={15}>
          <Text color={focus === 'method' ? 'yellow' : 'white'}>
            {focus === 'method' ? '▶ ' : '  '}Method:
          </Text>
        </Box>
        {focus === 'method' ? (
          <Box borderStyle="bold" borderColor="yellow" paddingX={1}>
            <SelectInput 
              items={methods} 
              onSelect={(item) => {
                setMethod(item.value);
                setFocus('url');
              }} 
            />
          </Box>
        ) : (
          <Box borderStyle="single" borderColor="gray" paddingX={1}>
            <Text color="magenta" bold>{method}</Text>
          </Box>
        )}
      </Box>

      {/* URL Input */}
      <Box marginBottom={1}>
        <Box width={15}>
          <Text color={focus === 'url' ? 'yellow' : 'white'}>
            {focus === 'url' ? '▶ ' : '  '}URL:
          </Text>
        </Box>
        <Box borderStyle="round" borderColor={focus === 'url' ? 'yellow' : 'gray'} paddingX={1} flexGrow={1}>
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
      </Box>

      {/* JSON Body Input (only for non-GET) */}
      {(method !== 'GET' && method !== 'DELETE') && (
        <Box marginBottom={1}>
          <Box width={15}>
            <Text color={focus === 'body' ? 'yellow' : 'white'}>
              {focus === 'body' ? '▶ ' : '  '}JSON Body:
            </Text>
          </Box>
          <Box borderStyle="round" borderColor={focus === 'body' ? 'yellow' : 'gray'} paddingX={1} height={5} flexGrow={1}>
            {focus === 'body' ? (
              <TextInput 
                value={body} 
                onChange={setBody} 
                placeholder='{ "key": "value" }'
              />
            ) : (
              <Text color="gray" dimColor>{body || 'Empty body...'}</Text>
            )}
          </Box>
        </Box>
      )}

      {loading && (
        <Box marginTop={1}>
          <Text color="yellow" bold>⚡ SENDING REQUEST...</Text>
        </Box>
      )}

      <Box marginTop={1} borderStyle="single" borderColor="blue" paddingX={1}>
        <Text dimColor>
          <Text color="yellow">↑↓</Text> Navigate | <Text color="yellow">ENTER</Text> Send Request (from URL field)
        </Text>
      </Box>
    </Box>
  );
};
