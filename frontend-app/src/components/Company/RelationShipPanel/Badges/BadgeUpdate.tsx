import { createRef, forwardRef, RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { Badge } from '../../../CompanyAccount/Badges/badge.types';
import { useTranslation } from 'react-i18next';
import { Stack, Text, Select } from '@chakra-ui/react';
import { boxInput } from '../styles';
import { EditCompanyRowAccordion } from '../../shared';
import BadgeRow from './BadgeRow';
import { useDispatch } from 'react-redux';
import { setRemovedBadges } from '../../../../stores/features/generalData';
import { capitalizeFirstLetter } from '../../../../utils/dataMapper';
import StimButton from '../../../ReusableComponents/Button';

const BadgeUpdate = forwardRef((props: { badges: Badge[]; tenantCompanyRelationshipId: string }, ref) => {
  const { badges, tenantCompanyRelationshipId } = props;
  const badgesLength = badges.length;
  const [elRefs, setElRefs] = useState<RefObject<{ save: () => void }>[]>([]);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [selectedBadges, setSelectedBadges] = useState<Badge[]>([]);
  const [newBadgeCount, setNewBadgeCount] = useState(0);
  const [badgesToRemove, setBadgesToRemove] = useState<any>([]);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setRemovedBadges(badgesToRemove));
  }, [badgesToRemove]);

  useEffect(() => {
    setElRefs((elRefs) =>
      Array(badgesLength + newBadgeCount)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [badgesLength, newBadgeCount]);

  useImperativeHandle(ref, () => ({
    save: () => {
      return elRefs.map((ref) => ref.current?.save?.()).flat();
    },
  }));

  const handleBadgeSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBadgeId = event.target.value;
    setSelectedBadgeId(selectedBadgeId);
  };

  const handleAddBadge = () => {
    if (selectedBadgeId) {
      const selectedBadge = badges.find((badge) => badge.id === selectedBadgeId);
      if (selectedBadge) {
        setSelectedBadges((prevSelectedBadges) => [...prevSelectedBadges, selectedBadge]);
        setSelectedBadgeId(null);
        setBadgesToRemove((prevBadgesToRemove: any) => {
          const badgeIdsToRemove = selectedBadge?.badgeTenantCompanyRelationships
            ?.filter((badge) => badge?.tenantCompanyRelationshipId === tenantCompanyRelationshipId)
            .map((relationship) => relationship?.id);

          return prevBadgesToRemove?.filter((badgeId: any) => !badgeIdsToRemove?.includes(badgeId));
        });
      }
    }
  };

  const handleRemoveBadge = (index: number) => {
    setSelectedBadges((prevSelectedBadges) => {
      const updatedSelectedBadges = [...prevSelectedBadges];
      const removedBadge = updatedSelectedBadges.splice(index, 1)[0];
      setSelectedBadgeId((prevSelectedBadgeId) =>
        removedBadge.id === prevSelectedBadgeId ? null : prevSelectedBadgeId
      );

      setBadgesToRemove((prevBadgesToRemove: any) => {
        const badgeIdsToAdd = removedBadge?.badgeTenantCompanyRelationships
          ?.filter((badge) => badge?.tenantCompanyRelationshipId === tenantCompanyRelationshipId)
          .map((relationship) => relationship?.id);
        return [...prevBadgesToRemove, ...(badgeIdsToAdd ?? [])];
      });

      return updatedSelectedBadges;
    });
  };

  useEffect(() => {
    const badgesWithRelationshipId = badges.filter((badge) =>
      badge?.badgeTenantCompanyRelationships?.some(
        (relation: any) => relation?.tenantCompanyRelationshipId === tenantCompanyRelationshipId
      )
    );
    setSelectedBadges(badgesWithRelationshipId);
  }, [badges, tenantCompanyRelationshipId]);

  const availableBadges = badges?.filter(
    (badge: Badge) => !selectedBadges?.some((selectedBadge) => selectedBadge.id === badge.id)
  );

  return (
    <EditCompanyRowAccordion name={t('Badges')}>
      <Stack sx={boxInput}>
        <Stack>
          <Text fontSize="12px" fontWeight="600">
            {t('Badge Titles')}
          </Text>
          <Select
            id="badge-selector"
            data-testid="badge-selector"
            w="369px"
            h="40px"
            fontSize="13px"
            value={selectedBadgeId || ''}
            onChange={handleBadgeSelection}
            disabled={selectedBadges.length === badges.length}
          >
            <option value="" disabled={!selectedBadgeId}>
              {t('Select a badge')}
            </option>
            {availableBadges.map((badge: Badge) => (
              <option key={badge.id} value={badge.id}>
                {capitalizeFirstLetter(badge.badgeName)}
              </option>
            ))}
          </Select>
          {(selectedBadgeId || selectedBadges.length > 0) && (
            <StimButton
              mt="5px"
              size="stimSmall"
              onClick={() => {
                setNewBadgeCount(newBadgeCount + 1);
                return handleAddBadge();
              }}
              disabled={selectedBadgeId === null}
            >
              {t('ADD')}
            </StimButton>
          )}
        </Stack>
        {selectedBadges.map((badge: Badge, i: number) => (
          <BadgeRow
            handleRemoveBadgeClick={handleRemoveBadge}
            ref={elRefs[i]}
            key={badge.id}
            badge={badge}
            index={i}
            tenantCompanyRelationshipId={tenantCompanyRelationshipId}
          />
        ))}
      </Stack>
    </EditCompanyRowAccordion>
  );
});

export default BadgeUpdate;
