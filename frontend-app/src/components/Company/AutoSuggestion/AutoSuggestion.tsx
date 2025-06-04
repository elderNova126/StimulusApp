import { Tooltip, Box, Input, Tag, List, ListItem, ListIcon, Flex } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import debounce from 'lodash.debounce';
import useStyles from './styles';

export interface IItem {
  value: string;
  exists: boolean;
}

function AutoSuggestion(props: {
  selectedItems: IItem[];
  availableItems: IItem[];
  loading: boolean;
  onAddItem: (item: IItem) => void;
  onRemoveItem: (item: IItem) => void;
  onChangeSearch: (search: string) => void;
}) {
  const { availableItems, selectedItems, onAddItem, onRemoveItem, loading, onChangeSearch } = props;
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const onAdd = (item: IItem) => {
    onAddItem(item);
    // clear search
    searchInputRef.current?.focus();
    setSearch('');
    if (searchInputRef.current) searchInputRef.current.value = '';
  };

  const renderAvailableItems = (availableItems: IItem[]) => {
    return (
      <Box>
        {search !== '' &&
          selectedItems?.filter((tag) => tag.value.toLowerCase() === search.toLowerCase()).length === 0 &&
          availableItems?.filter((tag) => tag.value.toLowerCase() === search.toLowerCase()).length === 0 && (
            <>
              <ListItem className={classes.listItem} p={'2px'} onClick={() => onAdd({ value: search, exists: false })}>
                Create <b>"{search}"</b>
              </ListItem>
            </>
          )}
        {availableItems &&
          availableItems.length > 0 &&
          availableItems.map((item) => (
            <>
              {item.value.replace(/\s/g, '').length > 0 && item.exists && (
                <ListItem onClick={() => onAdd(item)} className={classes.listItem}>
                  {selectedItems?.filter((tag) => tag.value.toLowerCase() === item.value.toLowerCase()).length > 0 ? (
                    <>
                      <ListIcon as={MdCheckCircle} color="green.500" />
                      <b>"{search}"</b>
                    </>
                  ) : (
                    <b>{item.value}</b>
                  )}
                </ListItem>
              )}
            </>
          ))}
        {/* contains in selectedItems */}
        {selectedItems?.filter((tag) => tag.value.toLowerCase() === search.toLowerCase()).length > 0 &&
          availableItems?.filter((tag) => tag.value.toLowerCase() === search.toLowerCase()).length === 0 && (
            <>
              <ListItem className={classes.listItem}>
                <ListIcon as={MdCheckCircle} color="green.500" />
                <b>"{search}"</b>
              </ListItem>
            </>
          )}
      </Box>
    );
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // print value length in console
    if (e.target.value.replace(/\s/g, '').length > 0) {
      onChangeSearch(e.target.value);
      setSearch(e.target.value);
    } else {
      onChangeSearch('');
      setSearch('');
    }
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), []);

  return (
    <Box>
      <Box>
        {selectedItems && selectedItems.length > 0 ? (
          selectedItems.map((item) => (
            <Tooltip label="Click to delete">
              <Tag
                className={classes.tag}
                onClick={() => onRemoveItem(item)}
                m={'0.5'}
                background={'green.600'}
                color={'#fff'}
              >
                {item.value}
              </Tag>
            </Tooltip>
          ))
        ) : (
          <></>
        )}
      </Box>

      <Input onChange={debouncedChangeHandler} my={1} placeholder="Type a tag" ref={searchInputRef} />

      {/* render AVAILABLE ITEMS in list */}
      <Box className={classes.containerItems}>
        <List spacing={2}>{renderAvailableItems(availableItems)}</List>
      </Box>

      {loading && <Flex>Loading...</Flex>}
      <Flex>{availableItems.length} filtered</Flex>
    </Box>
  );
}

export default AutoSuggestion;
