import React, { ReactElement } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import StimButton from '../Button';

interface StimModalProps {
  title: string;
  onAction: () => void;
  children: React.ReactNode;
  trigger: ReactElement;
  size?: 'small' | 'large';
  variant?: 'success' | 'destructive';
}

const StimModal: React.FC<StimModalProps> = ({
  title,
  onAction,
  children,
  trigger,
  size = 'small',
  variant = 'success',
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const triggerWithOnClick = React.cloneElement(trigger, { onClick: onOpen });

  const maxWidth = size === 'small' ? '465px' : '750px';
  const buttonWidth = size === 'small' ? 'full' : undefined;
  const footerJustifyContent = size === 'small' ? 'center' : 'flex-end';

  return (
    <>
      {triggerWithOnClick}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxWidth={maxWidth}>
          <ModalHeader>
            <Text textStyle="stimSubtitle1" color={variant === 'success' ? 'stimPrimary.base' : 'stimSemantic.error'}>
              {title}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter justifyContent={footerJustifyContent}>
            <StimButton variant="stimOutline" onClick={onClose} mr={3} w={buttonWidth}>
              No, Cancel
            </StimButton>
            <StimButton
              variant={variant === 'success' ? 'stimPrimary' : 'stimDestructive'}
              w={buttonWidth}
              onClick={() => {
                onAction();
                onClose();
              }}
            >
              Action
            </StimButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StimModal;
