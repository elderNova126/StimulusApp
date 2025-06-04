import { Stack, Text } from '@chakra-ui/layout';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Certification } from '../company.types';
import { CompanyDateEditField, EditCompanyRowAccordion, EditCompanyTextField } from '../shared';
import { useCreateCertification, useUpdateCertification } from './Hooks/CertificationHooks';

const CertificationFormItem = forwardRef(
  (props: { certification?: Certification; hideTopBorder: boolean; companyId: string }, ref) => {
    const { certification, hideTopBorder, companyId } = props;
    const { t } = useTranslation();
    const [name, setName] = useState(certification?.name ?? null);
    const [description, setDescription] = useState(certification?.description ?? null);
    const [issuedBy, setIssuedBy] = useState(certification?.issuedBy ?? null);
    const [certificationNumber, setCertificationNumber] = useState(certification?.certificationNumber ?? null);
    const [certificationDate, setCertificationDate] = useState(
      certification?.certificationDate ? new Date(certification.certificationDate) : null
    );
    const [expirationDate, setExpirationDate] = useState(
      certification?.expirationDate ? new Date(certification.expirationDate) : null
    );
    const [type, setType] = useState(certification?.type ?? null);

    const { updateCertificate } = useUpdateCertification();
    const { createCertificate } = useCreateCertification();
    const [showError, setShowError] = useState(false);
    const certificationDateTyped = useMemo(
      () => (!!certificationDate && new Date(certificationDate)) as any,
      [certificationDate]
    );
    const expirationDateTyped = useMemo(() => (!!expirationDate && new Date(expirationDate)) as any, [expirationDate]);

    const save = () => {
      const startDate = certification?.certificationDate
        ? new Date(certification?.certificationDate as any).toISOString()
        : '';
      const endDate = certification?.expirationDate ? new Date(certification?.expirationDate as any).toISOString() : '';
      const certificationDateIso = certificationDateTyped?.toISOString?.() ?? '';
      const expirationDateIso = expirationDateTyped?.toISOString?.() ?? '';

      if (!certification?.id) {
        if (!name || !certificationDate || !expirationDate) {
          setShowError(true);
          throw new Error('Invalid Certification');
          // return false;
        }
        return createCertificate(
          {
            companyId,
            name,
            issuedBy,
            certificationNumber,
            description,
            ...(certificationDateIso !== '' && { certificationDate: certificationDateIso }),
            ...(expirationDateIso !== '' && { expirationDate: expirationDateIso }),
            type,
          },
          companyId
        );
      } else {
        const updates = {
          ...(name !== certification.name && { name }),
          ...(description !== certification.description && { description }),
          ...(issuedBy !== certification.issuedBy && { issuedBy }),
          ...(certificationNumber !== certification.certificationNumber && { certificationNumber }),
          ...(certificationDateIso !== startDate && {
            certificationDate: certificationDateIso,
          }),
          ...(expirationDateIso !== endDate && {
            expirationDate: expirationDateIso,
          }),
          ...(type !== certification.type && { type }),
        };
        if (Object.keys(updates).length > 0) {
          return updateCertificate({
            id: certification.id,
            companyId,
            ...updates,
          });
        }
      }
    };

    useImperativeHandle(ref, () => ({
      save,
    }));

    return (
      <EditCompanyRowAccordion
        name={certification?.name ?? 'New Certification'}
        {...(hideTopBorder && { borderTopWidth: '0' })}
      >
        <EditCompanyTextField
          required={true}
          type="text"
          label={t('Name')}
          locked={false}
          value={name as string}
          onChange={(val) => setName(val as string)}
        />
        {showError && !name && (
          <Text textStyle="h6" color="secondary">
            {t('This is required')}
          </Text>
        )}
        <EditCompanyTextField
          type="text"
          label={t('Type')}
          locked={false}
          value={type as string}
          onChange={(val: string | number) => setType(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Description')}
          locked={false}
          value={description as string}
          onChange={(val: string | number) => setDescription(val as string)}
        />
        <Stack spacing="1">
          <Text textStyle="filterFieldHeading">{t('Certification Date')}</Text>
          <CompanyDateEditField date={certificationDateTyped} setDate={setCertificationDate} required={true} />
          {showError && !certificationDate && (
            <Text textStyle="h6" color="secondary">
              {t('This is required')}
            </Text>
          )}
        </Stack>
        <Stack spacing="1">
          <Text textStyle="filterFieldHeading">{t('Expiration Date')}</Text>
          <CompanyDateEditField date={expirationDateTyped} setDate={setExpirationDate} required={true} />
          {showError && !expirationDate && (
            <Text textStyle="h6" color="secondary">
              {t('This is required')}
            </Text>
          )}
        </Stack>
        <EditCompanyTextField
          type="text"
          label={t('Certification Number')}
          locked={false}
          value={certificationNumber as string}
          onChange={(val: string | number) => setCertificationNumber(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Issued By')}
          locked={false}
          value={issuedBy as string}
          onChange={(val: string | number) => setIssuedBy(val as string)}
        />
      </EditCompanyRowAccordion>
    );
  }
);

export default CertificationFormItem;
