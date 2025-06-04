import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Stack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface GenericModalProps {
  children: any;
  title?: string;
  titleClass?: string;
  justifyActions?: any;
  fullWidth?: boolean;
  maxWidth?: 'md' | 'xs' | 'sm' | 'lg' | 'xl';
  buttonActions?: {
    label: string;
    onClick: () => void;
    color?: string;
    className?: any;
    variant?: any;
    testid?: string;
    colorScheme?: string;
  }[];
  onClose: () => void;
}

export default function GenericModal(props: GenericModalProps) {
  const { buttonActions, onClose, title, justifyActions, fullWidth, maxWidth } = props;
  const { t } = useTranslation();
  const defaultAction = {
    label: t('Close'),
    onClick: onClose,
    color: 'primary',
    className: '',
    variant: '',
    testid: '',
    colorScheme: '',
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={maxWidth} width={fullWidth ? '100%' : 'auto'}>
        {title && (
          <ModalHeader id="alert-dialog-title" data-testid="genericModal-title">
            {title}
          </ModalHeader>
        )}
        <ModalBody>{props.children}</ModalBody>
        <Stack>
          <ModalFooter style={{ justifyContent: justifyActions ?? 'flex-end' }} data-testid="modal-actions">
            {(buttonActions || [defaultAction]).map((action) => (
              <Button
                colorScheme={(action?.colorScheme as any) ?? ''}
                key={action.label}
                variant={action?.variant}
                className={action?.className}
                onClick={action.onClick}
                color={(action?.color as any) ?? 'primary'}
                data-testid={(action?.testid as any) ?? 'undefined-button'}
              >
                {action.label}
              </Button>
            ))}
          </ModalFooter>
        </Stack>
      </ModalContent>
    </Modal>
  );
}
