import React from 'react';

import {
  LastPage as LastPageIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
} from '@material-ui/icons';
import {
  Button,
  HStack,
  IconButton,
  List,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Progress,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronDownIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { navigate, useParams } from '@reach/router';
interface PaginationProps {
  page: number;
  hideRowsPerPage?: boolean;
  rowsPerPageOptions?: number[];
  rowsPerPage: number;
  count: number;
  loading?: boolean;
  onChangePage: (value: number) => void;
  onChangeRowsPerPage: (value: number) => void;
  pathname?: string;
}
const Pagination = (props: PaginationProps) => {
  const {
    page,
    rowsPerPage,
    rowsPerPageOptions,
    onChangeRowsPerPage,
    count,
    onChangePage,
    hideRowsPerPage,
    loading,
    pathname,
  } = props;
  const [isOpenDropdown, setIsOpenDropdown] = React.useState(false);
  const open = () => setIsOpenDropdown(true);
  const close = () => setIsOpenDropdown(false);
  const lastPage = Math.ceil((count > 100000 ? 100000 : count) / rowsPerPage);
  const params = useParams();

  return (
    <HStack w="100%" justifyContent="flex-end" alignItems="center" spacing="12px">
      {!hideRowsPerPage && (
        <>
          <Text textStyle="pagination">Rows per page</Text>
          <Popover placement="bottom" arrowPadding={0} isOpen={isOpenDropdown} onClose={close}>
            <PopoverTrigger>
              <Button
                variant="simple"
                onClick={open}
                px={2}
                py={0}
                maxH="28px"
                bg={isOpenDropdown ? '#F6F6F6' : 'transparent'}
                border="1px solid #E1E2E6"
                borderRadius="2px"
              >
                <Text textStyle="pagination">
                  {rowsPerPage} <ChevronDownIcon />
                </Text>
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent p="0" w="40px" top="-9px">
                <PopoverBody p="0">
                  <List spacing={3} flexDirection="column" display="flex" alignItems="center">
                    {(rowsPerPageOptions ?? [3, 5, 10]).map((value: number) => (
                      <Button
                        justifyContent="flex-start"
                        size="xs"
                        variant="simple"
                        _hover={{ color: 'green.600' }}
                        onClick={() => {
                          onChangeRowsPerPage(value);
                          close();
                        }}
                        key={value}
                      >
                        {value}
                      </Button>
                    ))}
                  </List>
                </PopoverBody>
                {/* <PopoverFooter>This is the footer</PopoverFooter> */}
              </PopoverContent>
            </Portal>
          </Popover>
        </>
      )}

      {loading ? (
        <Progress size="xs" isIndeterminate w="42px" colorScheme="teal" />
      ) : (
        <Text textStyle="pagination">
          {count === 0 ? 0 : (page - 1) * rowsPerPage + 1} - {Math.min((page - 1) * rowsPerPage + rowsPerPage, count)}{' '}
          of {count}
          {count > 100000 ? (
            <Tooltip
              hasArrow
              arrowShadowColor="#E0E0E0"
              label="The list displays only the first 100000 results."
              bg="white"
              color="black"
              border="1px"
              borderColor="#E0E0E0"
              textAlign="center"
            >
              <Button
                variant={'ghost'}
                _hover={{ bg: 'white' }}
                _active={{ bg: 'white' }}
                padding="0 0 2px 0"
                size={'sm'}
              >
                <InfoOutlineIcon />
              </Button>
            </Tooltip>
          ) : null}
        </Text>
      )}

      <IconButton
        disabled={page === 1}
        fontSize="12px"
        _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
        onClick={() => {
          onChangePage(1);
          !!pathname && navigate(params?.id ? `${pathname}${params.id}/${params.viewMode}/${1}` : `${pathname}1`);
        }}
        aria-label="first page"
        variant="simple"
        icon={<FirstPageIcon style={{ fontSize: '1rem' }} />}
      />
      <IconButton
        fontSize="6px"
        disabled={page === 1}
        _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
        onClick={() => {
          onChangePage(page - 1);
          !!pathname &&
            navigate(params?.id ? `${pathname}${params.id}/${params.viewMode}/${page - 1}` : `${pathname}${page - 1}`);
        }}
        aria-label="previous page"
        variant="simple"
        icon={<ChevronLeftIcon style={{ fontSize: '1rem' }} />}
      />
      <IconButton
        disabled={page >= Math.ceil((count > 100000 ? 100000 : count) / rowsPerPage)}
        _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
        onClick={() => {
          onChangePage(page + 1);
          !!pathname &&
            navigate(params?.id ? `${pathname}${params.id}/${params.viewMode}/${page + 1}` : `${pathname}${page + 1}`);
        }}
        aria-label="next page"
        variant="simple"
        icon={<ChevronRightIcon style={{ fontSize: '1rem' }} />}
      />
      <IconButton
        disabled={page >= Math.ceil((count > 100000 ? 100000 : count) / rowsPerPage)}
        _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
        onClick={() => {
          onChangePage(lastPage);
          !!pathname &&
            navigate(params?.id ? `${pathname}${params.id}/${params.viewMode}/${lastPage}` : `${pathname}${lastPage}`);
        }}
        aria-label="last page"
        variant="simple"
        icon={<LastPageIcon style={{ fontSize: '1rem' }} />}
      />
    </HStack>
  );
};

export default Pagination;
