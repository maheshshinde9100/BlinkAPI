import React from 'react';
import { Box, Text } from 'ink';

interface FooterProps {
  activeTab: string;
}

export const Footer: React.FC<FooterProps> = ({ activeTab }) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Box paddingX={1} justifyContent="space-between">
        <Box>
          <Box backgroundColor="#333" paddingX={1} marginRight={1}>
            <Text color="white" bold> TAB </Text>
          </Box>
          <Text dimColor>Switch Tab</Text>
          
          <Box width={3} />

          <Box backgroundColor="#333" paddingX={1} marginRight={1}>
            <Text color="white" bold> ENTER </Text>
          </Box>
          <Text dimColor>Send Request</Text>

          <Box width={3} />

          <Box backgroundColor="#333" paddingX={1} marginRight={1}>
            <Text color="white" bold> Q </Text>
          </Box>
          <Text dimColor>Quit</Text>
        </Box>
        
        <Box>
          <Text italic color="gray">Built by </Text>
          <Text bold color="cyan">Mahesh Shinde</Text>
        </Box>
      </Box>

      <Box marginTop={1} backgroundColor="cyan" height={1} justifyContent="center">
        <Text color="black" bold> CURRENT VIEW: {activeTab.toUpperCase()} </Text>
      </Box>
    </Box>
  );
};
