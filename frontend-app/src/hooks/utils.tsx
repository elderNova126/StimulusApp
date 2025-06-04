import { Dispatch, SetStateAction, useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

function useToggle(defaultValue?: boolean): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState(!!defaultValue);

  const toggle = useCallback(() => setValue((x) => !x), []);

  return [value, toggle, setValue];
}

export default useToggle;

export const useSearchFilters = () => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      all: t('All'),
      title: t('Company Name'),
      legalBusinessName: t('Legal Business Name'),
      description: t('Description'),
      industry: t('Industry'),
      tags: t('Tags'),
      taxIdNo: t('Tax ID No'),
      certifications: t('Certifications'),
      insurance: t('Insurance'),
      productsAndServices: t('Products & Services'),
      riskManagement: t('Risk Management'),
      taxIdAndLegalName: t('Tax ID and Legal Name'),
    }),
    [t]
  );
};
