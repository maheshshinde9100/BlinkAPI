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

  return (
    <Box flexDirection="column" flexGrow={1} padding={1}>
      <Box marginBottom={1} justifyContent="space-between">
        <Box borderStyle="double" borderColor={statusColor} paddingX={1}>
            <Text color={statusColor} bold> {response.status} {response.statusText} </Text>
        </Box>
        <Box paddingX={1} backgroundColor="blue">
            <Text color="white" bold> {response.duration}ms </Text>
        </Box>
      </Box>

      <Box flexDirection="row" flexGrow={1}>
        {/* Headers Column */}
        <Box flexDirection="column" width="30%" borderStyle="round" borderColor="gray" paddingX={1} marginRight={1}>
          <Text bold color="cyan">HEADERS</Text>
          <Box flexDirection="column" marginTop={1}>
            {Object.entries(response.headers).slice(0, 10).map(([key, value]) => (
              <Box key={key} marginBottom={1}>
                <Text color="gray" dimColor>{key}:</Text>
                <Text wrap="truncate-end"> {String(value)}</Text>
              </Box>
            ))}
            {Object.keys(response.headers).length > 10 && <Text dimColor>...</Text>}
          </Box>
        </Box>

        {/* Body Column */}
        <Box flexDirection="column" flexGrow={1} borderStyle="round" borderColor="cyan" paddingX={1}>
          <Text bold color="cyan">BODY</Text>
          <Box marginTop={1}>
            <Text>
              {typeof response.data === 'object' 
                ? JSON.stringify(response.data, null, 2).slice(0, 2000)
                : String(response.data).slice(0, 2000)}
              {String(response.data).length > 2000 && '\n\n... (Output truncated)'}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
