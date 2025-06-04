import { AddIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { useLazyAssetUri } from '../../../hooks';
import { formatStringDate } from '../../../utils/date';
import CompanyAddActionPanel from '../../CompanyAddActionPanel';
import { Company, Section } from '../company.types';
import CompanyName from './CompanyName';
import ItemActions from './ItemActions';
import StatusLabel from './StatusLabel';
import StimButton from '../../ReusableComponents/Button';

const horizentalLine = {
  borderTop: '2px solid #cbcbcb',
  width: '150%',
  marginLeft: '-50%',
  marginTop: '5%',
};

const reorder = (list: Section[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const CompanyLeftMenu = (props: {
  company: Company;
  companyId: string;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}) => {
  const { company, sections, setSections } = props;
  const { t } = useTranslation();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(sections, result.source.index, result.destination.index);
    setSections(items);
  };

  const [getAsset, { assetUri }] = useLazyAssetUri();

  useEffect(() => {
    if (company?.id) {
      getAsset({ variables: { companyId: company.id } });
    }
  }, [company, getAsset]);

  return (
    <Flex w="100%" h="auto" p="10% 20px 0px 40px">
      <Flex display="inline-block">
        {company?.legalBusinessName ? (
          <Avatar name={assetUri ? '' : company?.legalBusinessName} src={assetUri || ''} data-testid="avatar" />
        ) : (
          <SkeletonCircle startColor="green.1~00" endColor="green.400" size="10" />
        )}
        {company ? (
          <StatusLabel status={company.tenantCompanyRelation?.status} type={company.tenantCompanyRelation?.type} />
        ) : (
          <Skeleton marginTop="4.5%" height="2" width="auto" startColor="green.100" endColor="green.400" />
        )}
      </Flex>
      <Box p="5px 0px" w="100%">
        <Stack spacing={1}>
          <CompanyName company={company} />
          {company && company.updated && (
            <Text as="h5" pl="15px" pt="5px" textStyle="h5">
              {t(`UPDATED ${formatStringDate(company.updated, 'MMM DD, YYYY')}`)}
            </Text>
          )}
          <Text as="h5" pl="15px" textStyle="h5">
            {company?.diverseOwnership?.join(' | ')}
          </Text>
          <HStack justifyContent="center" w="75%">
            <Text whiteSpace="nowrap" textStyle="tableSubInfoSecondary" fontWeight="semibold" pl="15px">
              {t('Data Source') + ': '}
            </Text>
            <Select variant="flushed" size="sm">
              <option value="blended">Blended</option>
            </Select>
          </HStack>
        </Stack>
        <Box p="5px 0px" marginLeft="10px">
          <Box>
            <Popover isOpen={isOpen} onClose={onClose} placement="right-start">
              <PopoverTrigger>
                <StimButton
                  aria-label="add"
                  size="stimSmall"
                  leftIcon={<AddIcon fontSize="8px" />}
                  isActive={isOpen}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    return onToggle();
                  }}
                >
                  {t('Add To')}
                </StimButton>
              </PopoverTrigger>
              <Box sx={horizentalLine} />
              <Portal>
                <PopoverContent
                  onClick={(e: any) => e.stopPropagation()}
                  maxH="500px"
                  overflowY="scroll"
                  p="0"
                  width="200px"
                  borderRadius="0"
                  border="1px solid #E4E4E4"
                  borderColor="#E4E4E4"
                  boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
                >
                  <PopoverArrow />
                  <PopoverBody p="0">
                    <CompanyAddActionPanel company={company} profile={true} />
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </Box>
        </Box>
        <Box height="100%" w="100%">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided: any, snapshot: any) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {sections.map((item: Section, index: number) => (
                    <ItemActions
                      key={item.name}
                      item={item}
                      index={index}
                      sections={sections}
                      setSections={setSections}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Box>
    </Flex>
  );
};

export default CompanyLeftMenu;
