import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import StimButton from '../ReusableComponents/Button';
const ModalChangeStatus = (props: {
  status?: string;
  open: boolean;
  changeStatus: () => void;
  onClose: () => void;
  company: any;
}) => {
  const { status, changeStatus, open, onClose } = props;
  const { t } = useTranslation();

  const confirmChange = () => {
    changeStatus();
    onClose();
  };

  return (
    <>
      <Modal isOpen={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {status === 'archive' ? (
              <>{t('Are you sure you want to archive this company?')}</>
            ) : (
              <>{t(`Are you sure you want to make this company ${status === 'active' ? 'internal' : status}?`)}</>
            )}
          </ModalHeader>
          <ModalBody>Please select continue to complete the action.</ModalBody>
          <ModalFooter justifyContent="space-around">
            <StimButton variant="stimPrimary" mr={3} onClick={() => confirmChange()}>
              Continue
            </StimButton>
            <StimButton variant="stimOutline" colorScheme="red" onClick={onClose}>
              Cancel
            </StimButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalChangeStatus;
