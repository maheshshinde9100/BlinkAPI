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
    
    if (key.return && focus === 'url') {
      handleSend();
    }
  });

  return (
    <Box flexDirection="column" flexGrow={1}>
      {/* Header Info */}
      <Box marginBottom={1} justifyContent="center" backgroundColor="blue" paddingX={2}>
        <Text color="white" bold italic> NEW REQUEST CONFIGURATION </Text>
      </Box>

      {/* Main Form Area - Use a fixed height to prevent flickering */}
      <Box flexDirection="column" height={15}>
        <Box flexDirection="row" marginBottom={1}>
          {/* Method Area - Fixed width and height */}
          <Box 
            width={20} 
            height={8} 
            borderStyle="round" 
            borderColor={focus === 'method' ? 'yellow' : 'gray'} 
            flexDirection="column"
            paddingX={1}
          >
            <Text color={focus === 'method' ? 'yellow' : 'white'} bold underline> METHOD </Text>
            {focus === 'method' ? (
              <Box marginTop={1}>
                <SelectInput 
                  items={methods} 
                  onSelect={(item) => {
                    setMethod(item.value);
                    setFocus('url');
                  }} 
                />
              </Box>
            ) : (
              <Box marginTop={1} justifyContent="center" flexGrow={1}>
                <Text color="magenta" bold>{method}</Text>
              </Box>
            )}
          </Box>

          {/* URL Area */}
          <Box 
            flexGrow={1} 
            height={8} 
            borderStyle="round" 
            borderColor={focus === 'url' ? 'yellow' : 'gray'} 
            flexDirection="column"
            paddingX={1}
            marginLeft={1}
          >
            <Text color={focus === 'url' ? 'yellow' : 'white'} bold underline> TARGET URL </Text>
            <Box marginTop={1} flexGrow={1}>
              {focus === 'url' ? (
                <TextInput 
                  value={url} 
                  onChange={setUrl} 
                  onSubmit={handleSend}
                />
              ) : (
                <Text color="gray" wrap="truncate-end">{url}</Text>
              )}
            </Box>
          </Box>
        </Box>

        {/* JSON Body Area */}
        {(method !== 'GET' && method !== 'DELETE') && (
          <Box 
            height={6} 
            borderStyle="round" 
            borderColor={focus === 'body' ? 'yellow' : 'gray'} 
            flexDirection="column"
            paddingX={1}
          >
            <Text color={focus === 'body' ? 'yellow' : 'white'} bold underline> JSON BODY </Text>
            <Box flexGrow={1}>
              {focus === 'body' ? (
                <TextInput 
                  value={body} 
                  onChange={setBody} 
                  placeholder='{ "key": "value" }'
                />
              ) : (
                <Text color="gray" dimColor>{body || 'Empty body payload...'}</Text>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Bottom Status / Actions */}
      <Box marginTop={1} borderStyle="single" borderColor="blue" paddingX={1} justifyContent="space-between">
        <Box>
            {loading ? (
                <Text color="yellow" bold> ⚡ SENDING... </Text>
            ) : (
                <Text color="green"> READY TO SEND </Text>
            )}
        </Box>
        <Box>
            <Text dimColor> Press <Text color="yellow">ENTER</Text> on URL to execute request </Text>
        </Box>
      </Box>
    </Box>
  );
};
