import React, { FC, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  AlertDialogCloseButton,
} from '@chakra-ui/react';

interface Props {
  children?: any;
  title?: string;
  onClose: () => void;
  isOpen: boolean;
  actions?: any;
  dialogProps?: AlertDialogProps;
  w?: string;
  h?: string;
  mt?: string;
  maxH?: string;
  fontSize?: string;
  fontWeight?: string;
  border?: string;
  bg?: string;
  boxShadow?: string;
  closeButton?: boolean;
}

const Dialog: FC<Props> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  dialogProps,
  w,
  h,
  maxH,
  mt,
  fontSize,
  fontWeight,
  bg,
  border,
  boxShadow,
  closeButton,
}) => {
  const modalRef = useRef(null);

  return (
    <AlertDialog {...dialogProps} isOpen={isOpen} leastDestructiveRef={modalRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent
          {...(mt && { mt })}
          {...(w && { w })}
          {...(h && { h })}
          {...(maxH && { maxH })}
          {...(border && { border })}
          {...(bg && { bg })}
          {...(boxShadow && { boxShadow })}
        >
          <AlertDialogHeader fontSize={fontSize ? fontSize : 'lg'} fontWeight={fontWeight ? fontWeight : 'bold'}>
            {title}
          </AlertDialogHeader>
          {closeButton && <AlertDialogCloseButton size="sm" />}
          <AlertDialogBody w="100%">{children}</AlertDialogBody>
          <AlertDialogFooter>{actions}</AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default Dialog;
