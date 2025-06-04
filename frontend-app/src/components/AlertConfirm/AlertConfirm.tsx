import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import React from 'react';
import { useTranslation } from 'react-i18next';
import StimButton from '../ReusableComponents/Button';

interface IProps {
  onClose: () => void | undefined;
  onDone?: () => void | undefined;
  message: string;
  title: string;
  isVisible: boolean;
  loading?: boolean;
}
function AlertConfirm(props: IProps) {
  const { isVisible, message, onClose, onDone, title, loading } = props;
  const { t } = useTranslation();

  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t(title)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={5}>{message}</ModalBody>
        <ModalFooter>
          <StimButton colorScheme={'green'} isLoading={loading} onClick={onDone}>
            Accept
          </StimButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AlertConfirm;
