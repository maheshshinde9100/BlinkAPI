import React from 'react';
import { Box, Text } from 'ink';

interface ResponseViewerProps {
  response: any;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  if (!response) {
    return (
      <Box flexGrow={1} justifyContent="center" alignItems="center">
        <Text italic color="gray">No response yet. Send a request from the editor.</Text>
      </Box>
    );
  }

  const statusColor = response.status >= 200 && response.status < 300 ? 'green' : 'red';

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Box marginBottom={1} justifyContent="space-between">
        <Box>
            <Text bold color="magenta">RESPONSE VIEWER</Text>
        </Box>
        <Box>
            <Text color={statusColor} bold>{response.status} {response.statusText}</Text>
            <Text> | </Text>
            <Text color="yellow">{response.duration}ms</Text>
        </Box>
      </Box>

      <Box borderStyle="single" borderColor="gray" paddingX={1} marginBottom={1} flexDirection="column">
        <Text bold>Headers:</Text>
        {Object.entries(response.headers).slice(0, 5).map(([key, value]) => (
          <Text key={key}>
            <Text color="cyan">{key}:</Text> {String(value)}
          </Text>
        ))}
        {Object.keys(response.headers).length > 5 && <Text dimColor>...</Text>}
      </Box>

      <Box flexGrow={1} borderStyle="single" borderColor="gray" paddingX={1} flexDirection="column">
        <Text bold>Body:</Text>
        <Text>
          {JSON.stringify(response.data, null, 2).slice(0, 500)}
          {JSON.stringify(response.data).length > 500 && '... (truncated)'}
        </Text>
      </Box>
    </Box>
  );
};
