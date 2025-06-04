import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Badge } from './badge.types';
import { useTranslation } from 'react-i18next';
import { useDeleteBadge } from './badgesHooks';
import StimButton from '../../ReusableComponents/Button';

interface ModalBadgesProps {
  isOpen: boolean;
  badge: Badge;
  action: string;
  setBadge: (data: any) => void;
  setForm: (data: boolean) => void;
  update: (data: string) => void;
  onClose: () => void;
}

const ModalDeleteBadge = (props: ModalBadgesProps) => {
  const { badge, isOpen, setBadge, setForm, onClose, action, update } = props;
  const { t } = useTranslation();
  const { deleteBadge, loadingDelete } = useDeleteBadge();

  const closeAndReset = () => {
    setBadge(false);
    setForm(false);
    return onClose();
  };

  const handleDeleteBadge = async () => {
    await deleteBadge(badge.id);
    closeAndReset();
  };

  const handleUpdateBadge = async () => {
    update(badge.id);
    closeAndReset();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t(
              action === 'delete'
                ? 'Are you sure you want to delete this badge?'
                : 'Are you sure you want to change the status to NA?'
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {`This badge is connected to ${badge?.badgeTenantCompanyRelationships?.length} ${
              badge?.badgeTenantCompanyRelationships?.length === 1 ? 'company' : 'companies'
            }.
                                ${
                                  action === 'delete'
                                    ? 'If you remove it, the connections will also be deleted. This operation cannot be reverted. Are you sure you want to proceed?'
                                    : 'If you change the status, the badge dates will also be deleted. This operation cannot be reverted. Are you sure you want to proceed?'
                                } `}
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <StimButton isLoading={loadingDelete} variant="stimOutline" ml="10px" onClick={onClose}>
              {t('Cancel')}
            </StimButton>
            {action === 'delete' ? (
              <StimButton isLoading={loadingDelete} variant="stimDestructive" onClick={() => handleDeleteBadge()}>
                {t('Delete')}
              </StimButton>
            ) : (
              <StimButton variant="stimDestructive" onClick={() => handleUpdateBadge()}>
                {t('Save Changes')}
              </StimButton>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalDeleteBadge;
