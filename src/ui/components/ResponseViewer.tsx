import React from 'react';
import { Box, Text } from 'ink';

interface ResponseViewerProps {
  response: any;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  if (!response) {
    return (
      <Box flexGrow={1} justifyContent="center" alignItems="center">
        <Text italic color="gray">No response yet. Configure and send a request from the editor.</Text>
      </Box>
    );
  }

  const statusColor = response.status >= 200 && response.status < 400 ? 'green' : 'red';

  // Simple syntax highlighting for JSON strings
  const renderValue = (val: any) => {
    if (typeof val === 'string') return <Text color="green">"{val}"</Text>;
    if (typeof val === 'number') return <Text color="yellow">{val}</Text>;
    if (typeof val === 'boolean') return <Text color="magenta">{String(val)}</Text>;
    if (val === null) return <Text color="red">null</Text>;
    return <Text>{String(val)}</Text>;
  };

  return (
    <Box flexDirection="column" flexGrow={1}>
      {/* Top Status Bar */}
      <Box paddingX={1} marginBottom={1} justifyContent="space-between" backgroundColor="#1e1e1e">
        <Box>
            <Text color={statusColor} bold> STATUS: {response.status} {response.statusText} </Text>
        </Box>
        <Box>
            <Text color="cyan" bold> TIME: {response.duration}ms </Text>
            <Text> | </Text>
            <Text color="yellow" bold> SIZE: {JSON.stringify(response.data).length}B </Text>
        </Box>
      </Box>

      <Box flexDirection="row" flexGrow={1}>
        {/* Headers Column */}
        <Box flexDirection="column" width={40} borderStyle="round" borderColor="gray" paddingX={1} marginRight={1}>
          <Box borderStyle="single" borderColor="blue" marginBottom={1} justifyContent="center">
            <Text bold color="blue"> HEADERS </Text>
          </Box>
          <Box flexDirection="column">
            {Object.entries(response.headers).slice(0, 15).map(([key, value]) => (
              <Box key={key} marginBottom={0}>
                <Text color="cyan" bold>{key.toLowerCase()}: </Text>
                <Text wrap="truncate-end" dimColor>{String(value)}</Text>
              </Box>
            ))}
            {Object.keys(response.headers).length > 15 && <Text dimColor>  ...</Text>}
          </Box>
        </Box>

        {/* Body Column */}
        <Box flexDirection="column" flexGrow={1} borderStyle="round" borderColor="blue" paddingX={1}>
          <Box borderStyle="single" borderColor="cyan" marginBottom={1} justifyContent="center">
            <Text bold color="cyan"> RESPONSE BODY </Text>
          </Box>
          <Box marginTop={0}>
            <Text>
              {typeof response.data === 'object' 
                ? JSON.stringify(response.data, null, 2).slice(0, 3000)
                : String(response.data).slice(0, 3000)}
              {String(response.data).length > 3000 && '\n\n... (Output truncated for performance)'}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
