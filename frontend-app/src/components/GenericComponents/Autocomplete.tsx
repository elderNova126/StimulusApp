import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  List,
  ListItem,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import { useCombobox } from 'downshift';
import { FC, useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

interface ComboBoxItem {
  label: string;
  value: string | number;
  icon?: any;
}

interface AutocompleteProps {
  items: ComboBoxItem[];
  loading?: boolean;
  showIcon?: boolean;
  selectedItem: ComboBoxItem | null;
  setSelectedItem: (val: any) => void;
  value: string;
  setValue: (val: string) => void;
}

const Autocomplete: FC<AutocompleteProps & RouteComponentProps> = (props) => {
  const { items, value, setValue, showIcon, loading, selectedItem, setSelectedItem } = props;
  const [inputItems, setInputItems] = useState<ComboBoxItem[]>(items);

  useEffect(() => setInputItems(items), [items]);
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getComboboxProps,
    getItemProps,
    inputValue,
  } = useCombobox({
    items: inputItems,
    inputValue: value,
    selectedItem,
    itemToString: (item: any) => item?.label,
    onSelectedItemChange: ({ selectedItem }) => setSelectedItem(selectedItem as any),
    onInputValueChange: ({ inputValue }: any) => {
      selectedItem && setSelectedItem(null);
      setInputItems(items.filter((item) => item.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
      setValue(inputValue);
    },
  });

  return (
    <Stack w="100%">
      <div {...getComboboxProps()}>
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none" children={<IoIosSearch color="gray.300" />} />
          <Input {...getInputProps()} value={inputValue} borderRadius="5px" />
          <InputRightAddon
            bg="#fff"
            borderRadius="5px"
            cursor="pointer"
            {...getToggleButtonProps()}
            children={<ChevronDownIcon fontSize="18px" />}
          />
        </InputGroup>
      </div>
      <Box position="relative" w="100%">
        <List
          {...(!isOpen && { display: 'none' })}
          bg="#fff"
          zIndex="tooltip"
          w="100%"
          maxH="60vh"
          overflowY="scroll"
          position="absolute"
          border="1px solid #E4E4E4"
          boxSizing="border-box"
          boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
          {...getMenuProps()}
        >
          {isOpen &&
            (loading ? (
              <Box p="4">
                <Skeleton height="15px" width="100%" startColor="green.100" endColor="green.400" />
              </Box>
            ) : (
              inputItems.map((item, index) => (
                <ListItem key={`${item.label}${index}`} {...getItemProps({ item, index })} mt="0" cursor="pointer">
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    {...(highlightedIndex === index && { bg: '#F6F6F6' })}
                    _hover={{ bg: '#F6F6F6' }}
                    p=".8rem"
                  >
                    {showIcon && (
                      <Box display="inline" w="40px">
                        {item.icon}
                      </Box>
                    )}
                    <Text textStyle="fieldHelperText">{item.label}</Text>
                  </Stack>
                </ListItem>
              ))
            ))}
        </List>
      </Box>
    </Stack>
  );
};

export default Autocomplete;
