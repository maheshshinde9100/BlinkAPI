import React from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';

export const Header: React.FC = () => {
  return (
    <Box 
      marginBottom={1} 
      justifyContent="space-between" 
      borderStyle="bold" 
      borderColor="cyan" 
      paddingX={2}
      backgroundColor="#111"
    >
      <Box>
        <Gradient name="cristal">
          <Text bold italic> ⚡ SHELLREQ </Text>
        </Gradient>
        <Box marginLeft={2}>
          <Text dimColor>Modern API Client for Terminal</Text>
        </Box>
      </Box>
      <Box>
        <Box backgroundColor="blue" paddingX={1} marginRight={1}>
          <Text color="white" bold> v0.2.0 </Text>
        </Box>
        <Text color="gray">RELEASE</Text>
      </Box>
    </Box>
  );
};
