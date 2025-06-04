import { Stack, FormLabel, Text, Flex, useDisclosure, Box, Switch, Checkbox } from '@chakra-ui/react';
import { EditCompanyTextField } from '../../Company/shared';
import { Badge } from './badge.types';
import { useState } from 'react';
import { BadgeStatus } from '../../../utils/constants';
import ModalDeleteBadge from './ModalDeleteBadge';
import { BadgeFormFields, ValidationBadgeSchema } from './BadgeFormSchemaValidation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useDeleteBadge, useCreateBadge, useUpdateBadge } from './badgesHooks';
import StimButton from '../../ReusableComponents/Button';

const BadgeForm = (props: { badge?: Badge; setBadge: (data: any) => void; setForm: (data: boolean) => void }) => {
  const { badge, setBadge, setForm } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [badgeName, setBadgeName] = useState(badge?.badgeName);
  const [badgeDateLabel, setBadgeDateLabel] = useState(badge?.badgeDateLabel ?? 'Date');
  const [includeDate, setIncludeDate] = useState<boolean>(
    badge ? (badge?.badgeDateStatus !== BadgeStatus[0] ? true : false) : false
  );
  const [dateRequired, setDateRequired] = useState<boolean>(badge?.badgeDateStatus === BadgeStatus[2] ? true : false);
  const [badgeDescription, setBadgeDescription] = useState(badge?.badgeDescription);
  const [badgeDateStatus, setBadgeDateStatus] = useState(badge?.badgeDateStatus ?? 'hidden');
  const [action, setAction] = useState('');
  const { t } = useTranslation();

  const resetStates = () => {
    setBadge(false);
    setForm(false);
    setAction('');
  };

  const { deleteBadge, loadingDelete } = useDeleteBadge();
  const { updateBadge, loadingUpdate } = useUpdateBadge(resetStates);
  const { createBadge, loadingCreate } = useCreateBadge(resetStates);

  const { register, setValue, errors } = useForm({
    resolver: ValidationBadgeSchema,
  });

  const handleDeleteBadge = async (badge: Badge) => {
    setAction('delete');
    if (badge?.badgeTenantCompanyRelationships?.length > 0) {
      return onOpen();
    } else {
      await deleteBadge(badge.id);
      resetStates();
    }
  };

  const save = () => {
    return createBadge({
      badgeName,
      badgeDateStatus,
      badgeDescription,
      ...(badgeDateStatus !== 'hidden' && { badgeDateLabel }),
    });
  };

  const handleUpdateBadge = async (badge: Badge) => {
    setAction('update');
    if (
      badge?.badgeTenantCompanyRelationships?.length > 0 &&
      badgeDateStatus === 'hidden' &&
      badge?.badgeDateStatus !== 'hidden'
    ) {
      return onOpen();
    } else {
      await update(badge.id);
      resetStates();
    }
  };

  const update = (id: string) => {
    const updates = {
      ...(badgeName !== badge?.badgeName && { badgeName }),
      ...(badgeDateStatus !== badge?.badgeDateStatus && { badgeDateStatus }),
      ...(badgeDescription !== badge?.badgeDescription && { badgeDescription }),
      ...(badgeDateStatus !== 'hidden' && { badgeDateLabel }),
    };
    if (Object.keys(updates).length > 0) {
      return updateBadge({
        id,
        ...updates,
      });
    } else {
      resetStates();
    }
  };

  const listOfEvents = {
    [BadgeFormFields.BADGE_NAME]: setBadgeName,
    [BadgeFormFields.BADGE_DESCRIPTION]: setBadgeDescription,
    [BadgeFormFields.DATE_LABEL]: setBadgeDateLabel,
    [BadgeFormFields.DATE_STATUS]: setBadgeDateStatus,
  };

  const handleValueChange = (field: string, value: any) => {
    const event = listOfEvents[field as keyof typeof listOfEvents];
    event(value as never);
    setValue(field, value, { shouldValidate: true });
  };

  return (
    <Stack id="badge-form">
      <Text
        onClick={() => resetStates()}
        cursor="pointer"
        fontSize="13px"
        fontWeight="500"
        textDecor="underline"
        color="#2A2A28"
      >
        {`< Return To Badges`}
      </Text>
      <Stack mt="20px !important" mb="40px !important">
        <Text fontSize="28px" fontWeight="500" color="#2A2A28">
          {badge ? 'Edit Badges' : 'Create Badges'}
        </Text>
      </Stack>
      <Stack>
        <FormLabel mb="-7px">{t('Badge Name')}</FormLabel>
        <EditCompanyTextField
          id="badge-name-input"
          data-testid="badge-name-input"
          locked={false}
          type="text"
          value={badgeName ?? ''}
          w="369px"
          h="30px"
          required={true}
          error={badgeName && errors?.[BadgeFormFields.BADGE_NAME]?.message}
          {...register(BadgeFormFields.BADGE_NAME)}
          onChange={(val: any) => handleValueChange(BadgeFormFields.BADGE_NAME, val)}
        />
        {errors && (
          <Text textStyle="h6" color="secondary" mt="15px !important">
            {errors?.[BadgeFormFields.BADGE_NAME]?.message}
          </Text>
        )}
      </Stack>
      <Stack mt="40px !important">
        <FormLabel mb="-7px">{t('Description')}</FormLabel>
        <EditCompanyTextField
          id="badge-description-input"
          data-testid="badge-description-input"
          max={1500}
          locked={false}
          error={badgeDescription && errors?.[BadgeFormFields.BADGE_DESCRIPTION]?.message}
          onChange={(val: any) => handleValueChange(BadgeFormFields.BADGE_DESCRIPTION, val)}
          {...register(BadgeFormFields.BADGE_DESCRIPTION)}
          type="textarea"
          value={badgeDescription ?? ''}
          w="524px"
          h="99px"
        />
      </Stack>
      <Stack mt="20px !important">
        <Flex>
          <Switch
            id="edit-switch-badgeDate"
            data-testid="edit-switch-badgeDate"
            isChecked={includeDate}
            w="30px"
            variant="stimulus"
            colorScheme={'stimulus'}
            role="switch"
            aria-checked={includeDate}
            onChange={(e) => {
              setIncludeDate(e.target.checked);
              setBadgeDateStatus(e.target.checked ? 'optional' : 'hidden');
              if (!e.target.checked) setBadgeDateLabel('');
            }}
          />
          <FormLabel mb="-7px" ml="20px">
            {t('Include Date')}
          </FormLabel>
        </Flex>
        {includeDate && (
          <Stack mt="5px !important" ml="50px !important">
            <Flex>
              <FormLabel mb="-7px" fontSize="15px" fontWeight="400">
                {t('Date Label')}
              </FormLabel>
              <Box lineHeight="20px" ml="-5px">
                <CustomTooltip
                  arrow={false}
                  label={t(
                    'The Date Label refers to the applicable date for the badge i.e. badge issued date, start date, expiry date, etc'
                  )}
                >
                  <InfoOutlineIcon fontSize="13px" color="gray" />
                </CustomTooltip>
              </Box>
            </Flex>
            <EditCompanyTextField
              id="badge-date-label"
              locked={false}
              placeholder="Date"
              type="text"
              value={badgeDateLabel ?? ''}
              w="369px"
              h="30px"
              required={true}
              error={badgeDateLabel && errors?.[BadgeFormFields.DATE_LABEL]?.message}
              {...register(BadgeFormFields.DATE_LABEL)}
              onChange={(val: any) => handleValueChange(BadgeFormFields.DATE_LABEL, val)}
            />
            {errors && (
              <Text textStyle="h6" color="secondary" mt="15px !important">
                {errors?.[BadgeFormFields.DATE_LABEL]?.message}
              </Text>
            )}
            <Flex>
              <Checkbox
                variant="stimulus"
                w="18px"
                isChecked={dateRequired}
                id="edit-checkbox-badgeDate"
                onChange={(e) => {
                  setDateRequired(e.target.checked);
                  setBadgeDateStatus(!e.target.checked ? 'optional' : 'mandatory');
                }}
              />
              <Text ml="5px" fontSize="15px" fontWeight="400">
                Date Required
              </Text>
            </Flex>
          </Stack>
        )}
      </Stack>
      <Flex pb="4rem">
        {badge ? (
          <StimButton
            isLoading={loadingUpdate}
            disabled={!!Object.keys(errors).length || !!badgeName?.length === false}
            size="stimSmall"
            type="submit"
            mt="40px"
            onClick={() => handleUpdateBadge(badge)}
          >
            {t('Save Changes')}
          </StimButton>
        ) : (
          <StimButton
            isLoading={loadingCreate}
            disabled={!!Object.keys(errors).length || !!badgeName?.length === false}
            size="stimSmall"
            type="submit"
            mt="40px"
            onClick={() => save()}
          >
            {t('Add')}
          </StimButton>
        )}
        {badge && (
          <StimButton
            onClick={() => handleDeleteBadge(badge)}
            isLoading={loadingDelete}
            ml="40px"
            size="stimSmall"
            variant="stimDestructive"
            type="submit"
            mt="40px"
          >
            {t('Delete Badge')}
          </StimButton>
        )}
      </Flex>
      {badge && (
        <ModalDeleteBadge
          badge={badge}
          isOpen={isOpen}
          setBadge={setBadge}
          setForm={setForm}
          onClose={onClose}
          action={action}
          update={update}
        />
      )}
    </Stack>
  );
};

export default BadgeForm;
