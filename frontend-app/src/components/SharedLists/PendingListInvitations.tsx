// modal
import {
  Center,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { ISharedList } from '../../graphql/Models/SharedList';
import { PendingInvitationItem } from './PendingInvitationItem/PendingInvitationItem';
import useStyles from './styles';
export interface IPendingListInvitations {
  isOpen: boolean;
  onClose: () => void;
  listInvitations: ISharedList[];
}

export const PendingListInvitationModal = (props: IPendingListInvitations) => {
  const { onClose, isOpen, listInvitations } = props;
  const classes = useStyles();

  return (
    <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className={classes.modalContent}>
        <ModalHeader className={classes.modalheader}>Pending List Invitations</ModalHeader>
        <ModalCloseButton />
        <Divider className={classes.divider} />
        <ModalBody className={classes.container}>
          {listInvitations?.length > 0 ? (
            listInvitations.map((listInvitation) => {
              return <PendingInvitationItem key={listInvitation.id} listInvitation={listInvitation} />;
            })
          ) : (
            <Center className={classes.listEmpty}>
              <p>No pending invitations</p>
            </Center>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
