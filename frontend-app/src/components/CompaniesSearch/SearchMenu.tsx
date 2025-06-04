import { FC, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiChevronDown } from 'react-icons/hi';
import { IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useOutsideClick } from '@chakra-ui/react';

import { useSearchFilters } from '../../hooks/utils';
import { setFilterSearch } from '../../stores/features';

const SearchMenu: FC<{ onOpen: () => void; onClose: () => void }> = (props) => {
  const { onOpen, onClose } = props;
  const [activeFilter, setActiveFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();

  useOutsideClick({
    ref,
    handler: () => {
      setOpen(false);
      onClose();
    },
  });

  const FilterMapper: any = useSearchFilters();

  return (
    <Menu
      closeOnSelect={true}
      isOpen={open}
      onOpen={() => {
        onOpen();
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
        onClose();
      }}
    >
      <MenuButton
        as={IconButton}
        aria-label="Companies Options"
        icon={<HiChevronDown />}
        borderRadius="0"
        variant="simple"
        bg="#F6F6F6"
        border="1px solid #D4D4D4"
        size="sm"
      />
      <MenuList ref={ref} overflow="scroll" maxHeight="50vh">
        {Object.keys(FilterMapper).map((filter: string) => (
          <MenuItem
            key={filter}
            onClick={(e: any) => {
              setActiveFilter(filter);
              dispatch(setFilterSearch(filter));
            }}
          >
            <Text textStyle="body" {...(activeFilter === filter && { color: 'green.600', fontWeight: '600' })}>
              {FilterMapper?.[filter]}
            </Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SearchMenu;
