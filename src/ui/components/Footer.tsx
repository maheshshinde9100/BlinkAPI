import React from 'react';
import { Box, Text } from 'ink';

interface FooterProps {
  activeTab: string;
}

export const Footer: React.FC<FooterProps> = ({ activeTab }) => {
  return (
    <Box marginTop={1} paddingX={1} backgroundColor="gray">
      <Text color="black"> TAB </Text>
      <Text> Switch Tab </Text>
      <Text color="black"> | </Text>
      <Text color="black"> ENTER </Text>
      <Text> Send Request </Text>
      <Text color="black"> | </Text>
      <Text color="black"> Q </Text>
      <Text> Quit </Text>
      
      <Box flexGrow={1} />
      
      <Text italic>Active: {activeTab.toUpperCase()}</Text>
    </Box>
  );
};
