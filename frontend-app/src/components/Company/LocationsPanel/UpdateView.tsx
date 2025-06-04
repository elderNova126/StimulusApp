import { AccordionItem } from '@chakra-ui/react';
import { createRef, forwardRef, RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Company, Location } from '../company.types';
import { CompanyAccordion, CreateTableItemButton } from '../shared';
import LocationFormItem from './LocationFormItem';

const UpdateView = forwardRef((props: { company: Company }, ref) => {
  const { company } = props;
  const locations = company.locations?.results ?? [];
  const [elRefs, setElRefs] = useState<RefObject<{ save: () => void }>[]>([]);
  const { t } = useTranslation();
  const locationsLength = locations.length;
  const [newLocationsCount, setNewLocationsCount] = useState(0);
  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(locationsLength + newLocationsCount)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [locationsLength, newLocationsCount]);

  useImperativeHandle(ref, () => ({
    save: () => {
      return elRefs.map((ref) => ref.current?.save?.()).flat();
    },
  }));

  const newLocationsComponents =
    newLocationsCount > 0 &&
    Array(newLocationsCount)
      .fill(null)
      .map((_, i) => (
        <LocationFormItem ref={elRefs[locationsLength + i]} key={i} hideTopBorder={false} companyId={company.id} />
      ));
  return (
    <CompanyAccordion>
      {locations.map((location: Location, i: number) => (
        <LocationFormItem
          ref={elRefs[i]}
          companyId={company.id}
          key={location.id}
          location={location}
          hideTopBorder={i === 0}
        />
      ))}
      {newLocationsComponents}
      <AccordionItem>
        <CreateTableItemButton onClick={() => setNewLocationsCount(newLocationsCount + 1)} label={t('New Location')} />
      </AccordionItem>
    </CompanyAccordion>
  );
});

export default UpdateView;
