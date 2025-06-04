import { Icon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverTrigger } from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdClose } from 'react-icons/io';
import StimButton from '../../ReusableComponents/Button';

interface ContingenciesFiltersProps {
  filterHook: any;
  availableTypes: string[];
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
}

const ContingenciesFilters: FC<ContingenciesFiltersProps> = ({ filterHook, availableTypes, isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const [selectedFilters, setSelectedFilters] = filterHook;

  const changeSelectedTypes = (type: string) => {
    if (selectedFilters.includes(type)) {
      setSelectedFilters((currentSelectedFilters: string[]) =>
        currentSelectedFilters.filter((contingencyType) => contingencyType !== type)
      );
    } else {
      setSelectedFilters((currentSelectedFilters: string[]) => [...currentSelectedFilters, type]);
    }
  };

  return (
    <Popover placement="bottom-start" isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <StimButton
          onClick={() => setIsOpen(true)}
          variant={isOpen ? 'stimPrimary' : 'stimTextButton'}
          size="stimSmall"
        >
          {t('Filter')}
          {selectedFilters.length > 0 && (
            <Icon
              fontSize="12px"
              margin="7px 0 7px 7px"
              as={IoMdClose}
              data-testid="close-icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setSelectedFilters([]);
              }}
            />
          )}
        </StimButton>
      </PopoverTrigger>
      <Box zIndex="100">
        <PopoverContent
          border="1px solid #E4E4E4"
          borderColor="#E4E4E4"
          boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
          borderStyle="solid"
          width="260px"
        >
          <PopoverBody padding="1.5rem 0 0 2rem" height="180px" overflow="auto">
            <Flex flexDirection="column">
              <Text textStyle="h4" as="h4">
                {t('Type')}
              </Text>
              <Box marginBottom="1rem">
                {availableTypes.map((value, index) => (
                  <Text
                    fontWeight={selectedFilters.includes(value) ? 'bold' : ''}
                    color={selectedFilters.includes(value) ? 'green.600' : ''}
                    key={index}
                    onClick={() => changeSelectedTypes(value)}
                    cursor="pointer"
                    marginTop=".8rem"
                    fontSize="14px"
                  >
                    {value}
                  </Text>
                ))}
              </Box>
            </Flex>
          </PopoverBody>
          <PopoverFooter boxShadow="stimMedium" h="47px">
            <Flex justifyContent="flex-between" w="100%" pb="2px">
              <Flex flex="1" alignItems="flex-start">
                <StimButton
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedFilters([]);
                  }}
                  size="stimSmall"
                  variant="stimTextButton"
                >
                  {t('Reset')}
                </StimButton>
              </Flex>
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Box>
    </Popover>
  );
};

export default ContingenciesFilters;
