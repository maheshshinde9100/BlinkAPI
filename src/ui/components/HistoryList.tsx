import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { getHistory, HistoryItem } from '../../utils/storage.js';

interface HistoryListProps {
  onSelect: (item: HistoryItem) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const items = history.map((item) => ({
    label: `[${item.method}] ${item.url}`,
    value: item.id,
    ...item
  }));

  if (items.length === 0) {
    return (
      <Box flexGrow={1} justifyContent="center" alignItems="center">
        <Text italic color="gray">No history yet.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="magenta">HISTORY</Text>
      </Box>
      <SelectInput 
        items={items} 
        onSelect={(item: any) => onSelect(item)} 
      />
    </Box>
  );
};
