import {
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonText,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GrMore } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { CompanyUpdateState, setCompanyEdit } from '../../../stores/features/company';
import { getCompanyName } from '../../../utils/dataMapper';
import { Company } from '../company.types';
import UploadModal from './ModalUpload';

const CompanyName: FC<{ company: Company }> = ({ company }) => {
  const companyName = getCompanyName(company);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const edit = useSelector((state: { company: CompanyUpdateState }) => state.company?.edit);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex>
      {companyName ? (
        <Text as="h2" pl="15px" textStyle="h2">
          {companyName}
        </Text>
      ) : (
        <SkeletonText
          marginLeft="5%"
          width="90%"
          mt="1"
          noOfLines={2}
          spacing="1"
          startColor="green.100"
          endColor="green.400"
        />
      )}
      {!edit && (
        <Box paddingX={'.5rem'}>
          <Menu>
            {() => (
              <>
                <MenuButton bg="transparent" w="30px" h="30px" borderRadius="50%" _active={{ bg: '#92D6C160' }}>
                  <Icon as={GrMore} ml="auto" size="sm" color="gray.500" />
                </MenuButton>
                <MenuList border="1px" borderColor="lightgray" borderRadius="1px">
                  <MenuItem onClick={() => dispatch(setCompanyEdit(true))}>{t('Edit Profile')}</MenuItem>
                  <MenuItem onClick={() => onOpen()}>{t('Update Logo')}</MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Box>
      )}
      <UploadModal isOpen={isOpen} onClose={onClose} companyId={company?.id} />
    </Flex>
  );
};

export default CompanyName;
