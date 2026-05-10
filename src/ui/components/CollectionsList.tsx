import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { getCollections, CollectionItem } from '../../utils/storage.js';

interface CollectionsListProps {
  onSelect: (item: CollectionItem) => void;
}

export const CollectionsList: React.FC<CollectionsListProps> = ({ onSelect }) => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);

  useEffect(() => {
    setCollections(getCollections());
  }, []);

  const items = collections.map((item) => ({
    label: `[${item.name}] ${item.method} ${item.url}`,
    value: item.id,
    ...item
  }));

  if (items.length === 0) {
    return (
      <Box flexGrow={1} flexDirection="column" justifyContent="center" alignItems="center">
        <Text italic color="gray">No collections yet.</Text>
        <Text dimColor>History items are automatically saved. Add to collections manually coming soon.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="magenta">COLLECTIONS</Text>
      </Box>
      <SelectInput 
        items={items} 
        onSelect={(item: any) => onSelect(item)} 
      />
    </Box>
  );
};
