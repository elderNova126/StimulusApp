import { AccordionItem } from '@chakra-ui/accordion';
import { createRef, forwardRef, RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Contingency } from '../company.types';
import { CompanyAccordion, CreateTableItemButton } from '../shared';
import ContingencyFormItem from './ContingencyFormItem';

const UpdateView = forwardRef((props: { contingencies: Contingency[]; companyId: string }, ref) => {
  const { contingencies, companyId } = props;
  const [elRefs, setElRefs] = useState<RefObject<{ save: () => void }>[]>([]);
  const { t } = useTranslation();
  const contingenciesLength = contingencies.length;
  const [newContingenciesCount, setNewContingenciesCount] = useState(0);
  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(newContingenciesCount + contingenciesLength)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newContingenciesCount, contingencies]);

  useImperativeHandle(ref, () => ({
    save: () => {
      return elRefs.map((ref) => ref.current?.save?.()).flat();
    },
  }));

  const newContingenciesComponents =
    newContingenciesCount > 0 &&
    Array(newContingenciesCount)
      .fill(null)
      .map((_, i) => (
        <ContingencyFormItem
          ref={elRefs[contingenciesLength + i]}
          key={i}
          hideTopBorder={false}
          companyId={companyId}
        />
      ));

  return (
    <div data-testid="update-view">
      <CompanyAccordion>
        {contingencies.map((contingency: Contingency, i: number) => (
          <ContingencyFormItem
            ref={elRefs[i]}
            companyId={companyId}
            key={contingency.id}
            contingency={contingency}
            hideTopBorder={i === 0}
          />
        ))}
        {newContingenciesComponents}
        <AccordionItem>
          <CreateTableItemButton
            onClick={() => setNewContingenciesCount(newContingenciesCount + 1)}
            label={t('New Contingency')}
          />
        </AccordionItem>
      </CompanyAccordion>
    </div>
  );
});

export default UpdateView;
