import {
  AlertDialog,
  AlertDialogOverlay,
  useDisclosure,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { MutableRefObject, useEffect } from 'react';
import StimButton from '../ReusableComponents/Button';

// Father need a const cancelRef = useRef(); to use this component
interface Props {
  toNext: () => void | any;
  toClose: () => void | any;
  cancelRef: MutableRefObject<undefined>;
  openAndClose: boolean;
  textDialogo?: string;
}
const AlertDialogCustom = (prop: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { openAndClose, toNext, textDialogo, cancelRef, toClose } = prop;

  useEffect(() => {
    openAndClose && onOpen();
  }, [openAndClose]); // eslint-disable-line react-hooks/exhaustive-deps

  const hunderAccept = () => {
    toNext();
    onClose();
  };
  const hunderCancel = () => {
    toClose();
    onClose();
  };
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef as any}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Remove company</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          {textDialogo ?? 'Are you sure you want to Remove this company from your list?'}
        </AlertDialogBody>
        <AlertDialogFooter>
          <StimButton variant="stimOutline" size="stimSmall" ref={cancelRef as any} onClick={hunderCancel}>
            cancel
          </StimButton>
          <StimButton variant="stimDestructive" size="stimSmall" ml={3} onClick={hunderAccept}>
            Accept
          </StimButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogCustom;
