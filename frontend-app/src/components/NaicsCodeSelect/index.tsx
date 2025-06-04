import { useQuery } from '@apollo/client';
import { ChevronDownIcon, ChevronRightIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  BoxProps,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  Tooltip,
  CircularProgress,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useCombobox } from 'downshift';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useDynamicMarginLeft } from '../../hooks';
import { Industry } from '../Company/company.types';
import { SearchIcon } from '@chakra-ui/icons';
import { naicsTooltipBox, styleDropdownList, styleDropdownSubList } from '../NaicsCodeEditSelect/styles';
const { GET_NAICS_INDUSTRIES } = CompanyQueries;

interface IndustryCodeItem {
  id: string;
  code: string;
  title: string;
  label: string;
  value: string;
}
interface NaicsTreeItem extends IndustryCodeItem {
  children: {
    [key: string]: NaicsTreeItem;
  };
}
interface IndustriesTreeRoot {
  [key: string]: NaicsTreeItem;
}

const generateRange = (value: string) => {
  if (value.includes('-')) {
    const array = value.split('-');
    return { start: array[0], end: array[1] };
  } else {
    return { start: value, end: value };
  }
};

const industriesToTreeObject = (
  categories: { [key: string]: NaicsTreeItem },
  industry: IndustryCodeItem
): IndustriesTreeRoot => {
  const range = generateRange(industry.code);
  let matchedCategory: any;
  if (range.start !== range.end) {
    const matchedCategoryByRange = Object.keys(categories).filter((category: string) => {
      return category >= range.start && category <= range.end;
    });
    const categoriesByRange = Object.values(categories) // eslint-disable-next-line
      .map((category: NaicsTreeItem) => {
        if (matchedCategoryByRange.includes(category.code)) {
          return {
            [category.code]: category,
          };
        }
      })
      .filter((category: any) => category !== undefined)
      .reduce((acc: any, category: any) => {
        return {
          ...acc,
          ...category,
        };
      }, {});
    matchedCategory = matchedCategoryByRange.find((category: string) => industry.value.indexOf(category) === 0);
    if (matchedCategoryByRange) {
      const tree = matchedCategoryByRange.map((key: string) => {
        const category = categoriesByRange[key];
        return {
          [key]: {
            ...category,
            children: industriesToTreeObject(category?.children ?? {}, category),
          },
        };
      });

      return {
        ...categories,
        [industry.code]: {
          ...industry,
          children: tree.reduce((acc: any, category: any) => {
            return {
              ...acc,
              ...category,
            };
          }, {}),
        },
      };
    }
  } else {
    matchedCategory = Object.keys(categories).find((category: string) => industry.value.indexOf(category) === 0);

    if (matchedCategory) {
      return {
        ...categories,
        [matchedCategory]: {
          ...categories[matchedCategory],
          children: industriesToTreeObject(categories[matchedCategory].children ?? {}, industry),
        },
      };
    }
  }
  return { ...categories, [industry.value]: { ...industry, children: {} } };
};

const searchInput = (inputValue: string, item: NaicsTreeItem): boolean => {
  const childrens = Object.keys(item.children).find((key) => searchInput(inputValue, item.children[key])) ?? [];
  return (
    item.label.toLowerCase().indexOf(inputValue) === 0 ||
    (item.title && item.title.toLowerCase().indexOf(inputValue) === 0) ||
    childrens.length > 0
  );
};

const searchTreeView = (inputValue: string, tree: IndustriesTreeRoot): IndustriesTreeRoot => {
  const isRange = inputValue.includes('-');
  return Object.keys(tree).reduce((treeRoot: IndustriesTreeRoot, ncode: string) => {
    if (inputValue) {
      if (searchInput(inputValue, tree[ncode])) {
        if (isRange) {
          treeRoot[ncode] = { ...tree[ncode], children: tree[ncode]?.children };
        } else {
          treeRoot[ncode] = { ...tree[ncode], children: searchTreeView(inputValue, tree[ncode]?.children ?? {}) };
        }
      }
    }
    return treeRoot;
  }, {});
};

const NaicsCodeSelectWrapper: FC<{
  profile?: boolean;
  selectedNaics: IndustryCodeItem[];
  setSelectedNaics: (val: IndustryCodeItem[]) => void;
  setDeleteNaics: (val: IndustryCodeItem) => void;
  multiSelect?: boolean;
}> = ({ selectedNaics, setSelectedNaics, setDeleteNaics, multiSelect, profile }) => {
  const { data: naicsIndustries, loading } = useQuery(GET_NAICS_INDUSTRIES, {
    fetchPolicy: 'network-only',
  });

  const renderItems = (industries: any[]): IndustriesTreeRoot => {
    const result: any = [];
    industries.forEach((industry) => {
      result[industry.title] = {
        code: industry.code,
        id: industry.id,
        title: industry.title,
        value: `${industry.code ?? industry.title}`,
        label: `${industry.code ?? ''} ${industry.title}`,
        children: [],
      };
    });
    return result;
  };

  const { industryTree, customIndustries } = useMemo(() => {
    const { standard, custom } = (naicsIndustries?.industries?.results ?? []).reduce(
      (acc: { standard: IndustryCodeItem[]; custom: IndustryCodeItem[] }, industry: Industry) => {
        const key = industry.code ? 'standard' : 'custom';

        acc[key].push({
          id: industry.id,
          code: industry.code,
          title: industry.title,
          value: `${industry.code ?? industry.title}`,
          label: `${industry.code ?? ''} ${industry.title}`,
        });

        return acc;
      },
      { standard: [], custom: [] }
    );

    return {
      industryTree: standard.reduce(industriesToTreeObject, {}),
      customIndustries: renderItems(custom),
    };
  }, [naicsIndustries]);

  return (
    <>
      <NaicsCodeSelect
        loading={loading}
        profile={profile}
        multiSelect={multiSelect}
        selectedNaics={selectedNaics}
        setSelectedNaics={setSelectedNaics}
        setDeleteNaics={setDeleteNaics}
        tree={industryTree}
        customIndustries={customIndustries}
      />
    </>
  );
};

const NaicsCodeSelect: FC<{
  loading: boolean;
  profile?: boolean;
  customIndustries: IndustriesTreeRoot;
  tree: IndustriesTreeRoot;
  multiSelect?: boolean;
  selectedNaics: IndustryCodeItem[];
  setSelectedNaics: (val: IndustryCodeItem[]) => void;
  setDeleteNaics: (val: IndustryCodeItem) => void;
}> = (props) => {
  const { customIndustries, tree, multiSelect, selectedNaics, setSelectedNaics, setDeleteNaics, profile, loading } =
    props;
  const [industriesTree, setIndustriesTree] = useState<IndustriesTreeRoot>(tree);
  const [filteredIndustries, setFilteredIndustries] = useState<IndustriesTreeRoot>(customIndustries);
  const [openList, setOpenList] = useState({ standard: false, custom: false });
  const marginLeft = useDynamicMarginLeft('20px');
  useEffect(() => {
    setIndustriesTree(tree);
  }, [tree]);

  useEffect(() => {
    setFilteredIndustries(customIndustries);
  }, [customIndustries]);

  const handleDeleteIndustry = (id: string, code: string) => {
    if (code) {
      const industry = selectedNaics.find((industry) => industry.code === code);
      if (industry) {
        const itemRemove: IndustryCodeItem = {
          id: industry.id,
          code: industry.code,
          title: industry.title,
          value: industry.value,
          label: industry.label,
        };
        setDeleteNaics(itemRemove);
      }
    } else {
      const industry = selectedNaics.find((industry) => industry.id === id);
      if (industry) {
        const itemRemove: IndustryCodeItem = {
          id: industry.id,
          code: industry.code,
          title: industry.title,
          value: industry.value,
          label: industry.label,
        };
        setDeleteNaics(itemRemove);
      }
    }
  };

  const { isOpen, getToggleButtonProps, getMenuProps, getInputProps, getComboboxProps, inputValue, setInputValue } =
    useCombobox({
      items: [],
      onInputValueChange: (data) => {
        const { inputValue: value } = data;

        // Check if there is input value and filter accordingly
        if (value) {
          const lowerCaseValue = value.toLowerCase();

          // Filter industries tree based on the input
          const filteredTree = searchTreeView(lowerCaseValue, tree);
          const filteredCustomIndustries = searchTreeView(lowerCaseValue, customIndustries);

          // Update both industries tree and filtered industries state
          setIndustriesTree(filteredTree);
          setFilteredIndustries(filteredCustomIndustries);
        } else {
          // If input is cleared, reset both trees to their original values
          setIndustriesTree(tree);
          setFilteredIndustries(customIndustries);
        }
      },
    });
  const menuProps = getMenuProps();
  const allOpen = Boolean(inputValue.length > 3);

  const { t } = useTranslation();
  useEffect(() => {
    if (!multiSelect && selectedNaics.length) {
      setInputValue(selectedNaics[0].title);
    }
  }, [selectedNaics, multiSelect]); // eslint-disable-line react-hooks/exhaustive-deps

  const listItems = useMemo(
    () =>
      Object.keys(industriesTree).map((item) => {
        return (
          <NaicsListItem
            profile={profile}
            key={`${item}`}
            allOpen={allOpen}
            selectItem={(item: IndustryCodeItem) => {
              if (multiSelect) {
                setSelectedNaics([item]);
                setInputValue('');
              }
            }}
            level={0}
            item={industriesTree[item]}
          />
        );
      }),
    [industriesTree, allOpen, selectedNaics] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const listCustomItems = useMemo(
    () =>
      Object.keys(filteredIndustries)
        .map((item) => {
          return (
            <NaicsListItem
              profile={profile}
              key={`${item}`}
              allOpen={allOpen}
              selectItem={(item: IndustryCodeItem) => {
                if (multiSelect) {
                  setSelectedNaics([item]);
                  setInputValue('');
                }
              }}
              level={0}
              item={filteredIndustries[item]}
            />
          );
        })
        .sort((a, b) => {
          // @ts-ignore: Object is possibly 'null'.
          return a.key > b.key ? 1 : -1;
        }),
    [filteredIndustries, allOpen, selectedNaics] // eslint-disable-line react-hooks/exhaustive-deps
  );
  return (
    <Stack w="100%" mt="1rem">
      <div {...getComboboxProps()}>
        {multiSelect && (
          <Flex flexWrap={'wrap'}>
            {selectedNaics.map(({ id, value, code, title, label }, index) => (
              <Flex
                margin="0 5px 5px 0"
                border="1px solid #E4E4E4"
                boxSizing="border-box"
                boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
                key={code}
              >
                <CodeView
                  title={title}
                  code={code}
                  customTooltip={title}
                  p="2px"
                  selected={true}
                  deleteIndustry={() => handleDeleteIndustry(id, code)}
                />
              </Flex>
            ))}
          </Flex>
        )}
        <InputGroup size="sm">
          <InputLeftAddon bg="#fff" borderRadius="5px" children={<SearchIcon color="#2A2A28" />} />
          <Input {...getInputProps()} bg="#fff" borderRadius="5px" borderLeftColor="#fff" />
          <InputRightAddon
            bg="#fff"
            borderRadius="5px"
            cursor="pointer"
            {...getToggleButtonProps()}
            children={
              loading ? (
                <CircularProgress isIndeterminate color="green.300" size="18px" />
              ) : (
                <ChevronDownIcon fontSize="18px" />
              )
            }
          />
        </InputGroup>
      </div>
      <Box position="relative" w="100%">
        <List {...((!isOpen || loading) && { display: 'none' })} sx={styleDropdownList} {...menuProps}>
          <Box
            w="100%"
            onClick={(e) => {
              e.stopPropagation();
              setOpenList({ standard: !openList.standard, custom: false });
            }}
            cursor="pointer"
          >
            <Flex align="center" justify="space-between">
              <Text textStyle="fieldHelperText" fontWeight="500" color="primary" p="15px">
                {t('Standard Industries')}
              </Text>
              <Flex display="flex">
                {inputValue?.length >= 3 && <Text textStyle="circleBgNumbers">{listItems.length}</Text>}
                <ListIcon
                  mt="3px"
                  mb="3px"
                  userSelect="none"
                  as={openList.standard ? ChevronDownIcon : ChevronRightIcon}
                />
              </Flex>
            </Flex>
            {openList.standard && (
              <Stack sx={styleDropdownSubList(marginLeft, '250px')} {...menuProps}>
                {openList.standard && listItems}
              </Stack>
            )}
          </Box>
          <Divider />
          <Box onClick={() => setOpenList({ standard: false, custom: !openList.custom })} cursor="pointer">
            <Flex align="center" justify="space-between">
              <Text textStyle="fieldHelperText" fontWeight="500" color="primary" p="15px">
                {t('Custom Industries')}
              </Text>
              <Flex display="flex">
                {inputValue?.length >= 3 && <Text textStyle="circleBgNumbers">{listCustomItems.length}</Text>}
                <ListIcon
                  mt="3px"
                  mb="3px"
                  userSelect="none"
                  as={openList.custom ? ChevronDownIcon : ChevronRightIcon}
                />
              </Flex>
            </Flex>
            {openList.custom && (
              <Stack sx={styleDropdownSubList(marginLeft, '200px')} {...menuProps}>
                {openList.custom && listCustomItems}
              </Stack>
            )}
          </Box>
        </List>
      </Box>
    </Stack>
  );
};

const NaicsListItem: FC<{
  profile?: boolean;
  selectItem: (val: IndustryCodeItem) => void;
  allOpen: boolean;
  item: NaicsTreeItem;
  level: number;
}> = ({ level, allOpen, item, selectItem, profile }) => {
  const [open, setOpen] = useState(false);
  const isCustom = item.code ? false : true;
  let isLeaf = false;
  if (item.children) {
    if (Object.keys(item.children).length === 0) {
      isLeaf = true;
    }
  } else {
    isLeaf = true;
  }

  if (isCustom) {
    isLeaf = true;
  }

  const [hover, setHover] = useState(false);

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectItem(item);
  };

  useEffect(() => setOpen(allOpen), [allOpen]);
  return (
    <>
      {!!item.title && (
        <ListItem mt="0">
          <Box
            maxH="40px"
            _hover={{ bg: '#F6F6F6' }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            p=".8rem"
            pl={`${15 + level * 15}px`}
            cursor="pointer"
            display="flex"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            alignItems="center"
          >
            <Box flex="90%">
              <Text textStyle="fieldHelperText" w="264px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                {!isLeaf && <ListIcon mb="3px" userSelect="none" as={open ? ChevronDownIcon : ChevronRightIcon} />}
                {item.title}
              </Text>
            </Box>
            <Box flex="10%" display="flex" flexDirection="row-reverse" visibility={hover ? 'visible' : 'hidden'}>
              {item.code && <CodeView code={item.code} p="10px" selected={false} />}

              {isLeaf && profile && (
                <Badge
                  color="#2A2A28"
                  bg={'linear-gradient(179.97deg, rgba(176, 226, 187, 0.75) 0.03%, rgba(146, 214, 193, 0.75) 99.97%)'}
                  lineHeight="22px"
                  mx="4px"
                  mt="2px"
                  h="22px"
                  w="48px"
                  onClick={handleClick}
                >
                  + Add
                </Badge>
              )}

              {!profile && (
                <Badge
                  color="#2A2A28"
                  bg={'linear-gradient(179.97deg, rgba(176, 226, 187, 0.75) 0.03%, rgba(146, 214, 193, 0.75) 99.97%)'}
                  lineHeight="22px"
                  mx="4px"
                  mt="2px"
                  h="22px"
                  w="48px"
                  onClick={handleClick}
                >
                  + Add
                </Badge>
              )}
            </Box>
          </Box>
          {!isLeaf && open && (
            <List>
              {Object.keys(item.children).map((itemKey) => {
                return (
                  <NaicsListItem
                    profile={profile}
                    selectItem={selectItem}
                    level={level + 1}
                    key={`${itemKey}`}
                    allOpen={allOpen}
                    item={item.children[itemKey]}
                  />
                );
              })}
            </List>
          )}
        </ListItem>
      )}
    </>
  );
};

const CodeView: FC<
  { code: string; title?: string; customTooltip?: string; deleteIndustry?: () => void; selected?: boolean } & BoxProps
> = ({ code, title, customTooltip, selected, deleteIndustry, ...boxProps }) => {
  const { t } = useTranslation();

  return (
    <Box {...boxProps} _hover={{ bg: '#E4E4E4' }} h="22px" mt="2px" onClick={deleteIndustry}>
      <Tooltip
        p="0"
        placement="top"
        label={
          <Box sx={naicsTooltipBox}>
            <Text textStyle="inRowTooltip">{customTooltip ?? t('NAICS Code')}</Text>
          </Box>
        }
      >
        <Text whiteSpace="nowrap" flex="1" pr="1" textStyle="inRowTooltip" lineHeight={!selected ? '2px' : ''}>
          {selected ? (code ? `${code} ${title}` : title) : code}
          {!selected ? '' : <CloseIcon ml="5px" fontSize="8px" />}
        </Text>
      </Tooltip>
    </Box>
  );
};

export default NaicsCodeSelectWrapper;
