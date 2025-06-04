import {
  AlertDialog,
  AlertDialogOverlay,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloneModalContent from './CloneModalContent';
import DeleteModalContent from './DeleteModalContent';
import LeaveModalContent from './LeaveModalContent';
import RenameModalContent from './RenameModalContent';
import ShareListModalContent from './ShareListModelContent/ShareListModalContent';
import DownloadModalContent from './DownloadModalContent';

const MODAL_ACTIONS = {
  SHARE: 'share',
  DOWNLOAD: 'download',
  DUPLICATE: 'duplicate',
  RENAME: 'rename',
  DELETE: 'delete',
  LEAVE: 'leave',
};
const ListActionMenu = (props: { list: any; isCreator: boolean }) => {
  const [modalAction, setModalAction] = useState<string | null>(null);
  const cancelRef = useRef(null);
  const { list, isCreator } = props;
  const { t } = useTranslation();

  const modalContent = useMemo(() => {
    switch (modalAction) {
      case MODAL_ACTIONS.SHARE:
        return <ShareListModalContent open={true} list={list} ref={cancelRef} close={() => setModalAction(null)} />;
      case MODAL_ACTIONS.RENAME:
        return <RenameModalContent list={list} ref={cancelRef} close={() => setModalAction(null)} />;
      case MODAL_ACTIONS.DOWNLOAD:
        return <DownloadModalContent open={true} list={list} ref={cancelRef} close={() => setModalAction(null)} />;
      case MODAL_ACTIONS.DUPLICATE:
        return <CloneModalContent list={list} ref={cancelRef} close={() => setModalAction(null)} />;
      case MODAL_ACTIONS.DELETE:
        return <DeleteModalContent list={list} ref={cancelRef} close={() => setModalAction(null)} />;
      case MODAL_ACTIONS.LEAVE:
        return <LeaveModalContent list={list} ref={cancelRef} close={() => setModalAction(null)} />;
      default:
        return null;
    }
  }, [list, modalAction]);

  return (
    <Box pl="2" display="inline-block">
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          variant="simple"
          _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
          icon={<MoreHorizIcon />}
        />
        <MenuList>
          <MenuItem onClick={() => setModalAction(MODAL_ACTIONS.SHARE)}>
            <Text as="h4" textStyle="h4">
              {t('Share')}
            </Text>
          </MenuItem>
          <MenuItem onClick={() => setModalAction(MODAL_ACTIONS.DOWNLOAD)}>
            <Text as="h4" textStyle="h4">
              {t('Download')}
            </Text>
          </MenuItem>
          <MenuItem hidden={isCreator} onClick={() => setModalAction(MODAL_ACTIONS.LEAVE)}>
            <Text as="h4" textStyle="h4" color="red.500">
              {t('Leave')}
            </Text>
          </MenuItem>
          <MenuItem hidden={!isCreator} onClick={() => setModalAction(MODAL_ACTIONS.DUPLICATE)}>
            <Text as="h4" textStyle="h4">
              {t('Duplicate')}
            </Text>
          </MenuItem>
          <MenuItem hidden={!isCreator} onClick={() => setModalAction(MODAL_ACTIONS.RENAME)}>
            <Text as="h4" textStyle="h4">
              {t('Rename')}
            </Text>
          </MenuItem>
          <MenuItem hidden={!isCreator} onClick={() => setModalAction(MODAL_ACTIONS.DELETE)}>
            <Text as="h4" textStyle="h4">
              {t('Delete')}
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>

      <AlertDialog
        isOpen={!!modalAction && !!modalContent}
        leastDestructiveRef={cancelRef}
        onClose={() => setModalAction(null)}
      >
        <AlertDialogOverlay>{modalContent}</AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ListActionMenu;
