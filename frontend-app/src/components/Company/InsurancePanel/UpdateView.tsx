import { AccordionItem } from '@chakra-ui/accordion';
import { createRef, forwardRef, RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Insurance } from '../company.types';
import { CompanyAccordion, CreateTableItemButton } from '../shared';
import InsuranceFormItem from './InsuranceFormItem';

const UpdateView = forwardRef((props: { insurances: any[]; companyId: string }, ref) => {
  const { insurances, companyId } = props;
  const [elRefs, setElRefs] = useState<RefObject<{ save: () => void }>[]>([]);
  const { t } = useTranslation();
  const insurancesLength = insurances.length;
  const [newInsurancesCount, setNewInsurancesCount] = useState(0);
  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(newInsurancesCount + insurancesLength)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [newInsurancesCount, insurances]); // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(ref, () => ({
    save: () => {
      return elRefs.map((ref) => ref.current?.save?.()).flat();
    },
  }));

  const newInsurancesComponents =
    newInsurancesCount > 0 &&
    Array(newInsurancesCount)
      .fill(null)
      .map((_, i) => (
        <InsuranceFormItem ref={elRefs[insurancesLength + i]} key={i} hideTopBorder={false} companyId={companyId} />
      ));
  return (
    <CompanyAccordion>
      {insurances.map((insurance: Insurance, i: number) => (
        <InsuranceFormItem
          ref={elRefs[i]}
          companyId={companyId}
          key={insurance.id}
          insurance={insurance}
          hideTopBorder={i === 0}
        />
      ))}
      {newInsurancesComponents}
      <AccordionItem>
        <CreateTableItemButton
          onClick={() => setNewInsurancesCount(newInsurancesCount + 1)}
          label={t('New Insurance')}
        />
      </AccordionItem>
    </CompanyAccordion>
  );
});

export default UpdateView;
