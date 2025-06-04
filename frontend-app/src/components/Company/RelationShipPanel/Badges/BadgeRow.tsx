import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Text, Flex, Input, Stack } from '@chakra-ui/react';
import { Badge, BadgeTenantRelationship } from '../../../CompanyAccount/Badges/badge.types';
import moment from 'moment';
import { useStimulusToast } from '../../../../hooks';
import { ValidationBadgeDateSchema } from './BadgeDateSchemaValidation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { flexBadgeRow, inputBadgeDate, inputBadgeName, removeBadgeButton } from './styles';
import { capitalizeFirstLetter } from '../../../../utils/dataMapper';
import { useCreateBadgeTenantRelationship, useUpdateBadgeTenantRelationship } from './hooksBadgeRelationships';
import StimButton from '../../../ReusableComponents/Button';

const BadgeRow = forwardRef(
  (
    props: {
      badge: Badge;
      index: number;
      tenantCompanyRelationshipId: string;
      handleRemoveBadgeClick: (data: any) => void;
    },
    ref
  ) => {
    const { badge, tenantCompanyRelationshipId, index, handleRemoveBadgeClick } = props;
    const [badgeRelationship] = useState<BadgeTenantRelationship[] | []>(
      badge?.badgeTenantCompanyRelationships?.filter(
        (relationship: any) => relationship?.tenantCompanyRelationshipId === tenantCompanyRelationshipId
      ) ?? []
    );
    const [badgeDate, setBadgeDate] = useState<string | undefined>(
      badgeRelationship[0]?.badgeDate ? moment(badgeRelationship[0]?.badgeDate).format('YYYY-MM-DD') : ''
    );
    const [badgeStatus] = useState<string>(badge?.badgeDateStatus);
    const { enqueueSnackbar } = useStimulusToast();
    const { t } = useTranslation();
    const currentDate = new Date();

    const { createTenantRelationship } = useCreateBadgeTenantRelationship();
    const { updateTenantRelationship } = useUpdateBadgeTenantRelationship();

    const { register, setValue, errors } = useForm({
      resolver: ValidationBadgeDateSchema(badge.id, badge.id + index),
    });

    useEffect(() => {
      if (badgeDate === '') {
        handleValueChange(badgeDate);
      }
    }, [badge]);

    const handleValueChange = (value: any) => {
      setBadgeDate(value);
      setValue(badge.id + index, badgeStatus);
      setValue(badge.id, value, { shouldValidate: true });
    };

    const save = () => {
      if (errors?.[badge.id]?.message) {
        enqueueSnackbar('Please check the following fields: Badge Date', { status: 'warning' });
        throw new Error('Invalid Badge Date');
      }
      if (badgeRelationship[0]?.id) {
        const updates = {
          ...(badgeDate !== moment(badgeRelationship[0].badgeDate).format('YYYY-MM-DD') &&
            badgeStatus !== 'hidden' && { badgeDate }),
        };
        if (Object.keys(updates).length > 0) {
          return updateTenantRelationship({
            id: badgeRelationship[0].id,
            badgeId: badge?.id,
            tenantCompanyRelationshipId,
            ...updates,
          });
        }
      } else {
        return createTenantRelationship({
          badgeId: badge?.id,
          tenantCompanyRelationshipId,
          ...(badgeDate !== '' && badgeStatus !== 'hidden' && { badgeDate }),
        });
      }
    };

    useImperativeHandle(ref, () => ({
      save,
    }));

    return (
      <Stack key={index} w="500px">
        <Flex justify="space-between">
          <Text fontSize="12px" fontWeight="600">
            {t('Badge')} {index + 1}
          </Text>
          <StimButton variant="stimTextButton" sx={removeBadgeButton} onClick={() => handleRemoveBadgeClick(index)}>
            {t('Remove')}
          </StimButton>
        </Flex>

        <Flex sx={flexBadgeRow} justify="space-between">
          <Stack>
            <Text fontSize="12px">{t('Badge Title')}</Text>
            <Input
              sx={inputBadgeName}
              value={capitalizeFirstLetter(badge?.badgeName)}
              disabled
              cursor="default !important"
              id="badge-input-name"
              data-testid="badge-input-name"
            />
          </Stack>
          <Stack>
            {badge?.badgeDateStatus !== 'hidden' ? (
              <>
                <Flex p="0 !important">
                  <Text fontSize="12px">
                    {t(badge?.badgeDateLabel ? `${capitalizeFirstLetter(badge?.badgeDateLabel)}` : 'Date')}
                  </Text>
                  {badge?.badgeDateStatus === 'mandatory' && (
                    <Text fontSize="14px" color="secondary" fontWeight="bold">
                      *
                    </Text>
                  )}
                </Flex>
                <Input
                  id="badge-input-date"
                  data-testid="badge-input-date"
                  mt={badgeStatus === 'mandatory' ? '5px !important' : ''}
                  sx={inputBadgeDate}
                  type="date"
                  min={moment(currentDate).format('YYYY-MM-DD')}
                  value={badgeDate ?? ''}
                  {...register(badge.id)}
                  {...register(badge.id + index)}
                  onChange={(e) => handleValueChange(e.target.value)}
                />
                {!!errors?.[badge.id]?.message && (
                  <Text textStyle="h6" color="secondary" mt="5px !important">
                    {errors?.[badge.id]?.message}
                  </Text>
                )}
              </>
            ) : null}
          </Stack>
        </Flex>
      </Stack>
    );
  }
);

export default BadgeRow;
