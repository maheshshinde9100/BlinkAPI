import React from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';

export const Header: React.FC = () => {
  return (
    <Box marginBottom={1} justifyContent="space-between" borderStyle="single" borderColor="blue">
      <Box>
        <Gradient name="atlas">
          <Text bold italic> SHELLREQ TUI </Text>
        </Gradient>
      </Box>
      <Box>
        <Text color="gray">v0.2.0-beta</Text>
      </Box>
    </Box>
  );
};
