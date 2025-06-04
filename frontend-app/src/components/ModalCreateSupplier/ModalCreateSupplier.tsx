import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
  useDisclosure,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import SearchCompany from './SearchCompany';
import CreateSupplier from './CreateSupplier';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { FormCompanyProvider } from '../../hooks/companyForms/companyForm.provider';

const ModalCreateSupplier = (props: { button?: boolean }) => {
  const { button } = props;
  const { t } = useTranslation();
  const [createCompany, setCreateCompany] = useState(false);
  const [legalBusinessName, setLegalBusinessName] = useState('');
  const [taxId, setTaxId] = useState('');

  const { onOpen, onClose, isOpen } = useDisclosure();

  useEffect(() => {
    if (!isOpen) {
      setCreateCompany(false);
    }
  }, [isOpen]);

  return (
    <FormCompanyProvider>
      {button ? (
        <Box pl="2" display="inline-block">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              data-cy="create-a-supplier-company-button"
              variant="simple"
              _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
              icon={<MoreHorizIcon />}
            />
            <MenuList>
              <MenuItem onClick={onOpen} textStyle="h4" cursor="pointer" data-cy="create-a-supplier-company">
                <Text>{t('Create a Supplier Company')}</Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      ) : (
        <Text onClick={onOpen} textStyle="textLink" cursor="pointer">
          {t('Create a Supplier Company')}
        </Text>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent ml="100px" bg="#F6F6F6" w="474px" minH="280px" p="15px" borderColor="#E4E4E4">
          <ModalCloseButton />
          <ModalHeader border="0" fontWeight={400} fontSize="18px">
            {t('Create a Supplier Company')}
          </ModalHeader>
          {!createCompany ? (
            <SearchCompany
              setLegalBusinessName={setLegalBusinessName}
              setTaxId={setTaxId}
              onClose={onClose}
              setCreateCompany={setCreateCompany}
            />
          ) : (
            <CreateSupplier legalBusinessName={legalBusinessName ?? ''} taxId={taxId ?? ''} />
          )}
        </ModalContent>
      </Modal>
    </FormCompanyProvider>
  );
};
export default ModalCreateSupplier;
