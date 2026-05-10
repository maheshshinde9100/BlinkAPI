import React from 'react';
import { Box, Text } from 'ink';

interface FooterProps {
  activeTab: string;
}

export const Footer: React.FC<FooterProps> = ({ activeTab }) => {
  return (
    <Box marginTop={1} paddingX={1}>
      <Box backgroundColor="gray" paddingX={1} marginRight={1}>
        <Text color="black" bold> TAB </Text>
      </Box>
      <Text>Switch Tab</Text>
      
      <Box width={3} />

      <Box backgroundColor="gray" paddingX={1} marginRight={1}>
        <Text color="black" bold> ENTER </Text>
      </Box>
      <Text>Send Request</Text>

      <Box width={3} />

      <Box backgroundColor="gray" paddingX={1} marginRight={1}>
        <Text color="black" bold> Q </Text>
      </Box>
      <Text>Quit</Text>
      
      <Box flexGrow={1} />
      
      <Box paddingX={1} borderStyle="single" borderColor="cyan">
        <Text italic color="cyan"> FOCUS: {activeTab.toUpperCase()} </Text>
      </Box>
    </Box>
  );
};
