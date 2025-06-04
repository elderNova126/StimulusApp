import { AccordionItem } from '@chakra-ui/accordion';
import { createRef, forwardRef, RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Company, Contact } from '../company.types';
import { CompanyAccordion, CreateTableItemButton } from '../shared';
import ContactFormItem from './ContactFormItem';

const UpdateView = forwardRef((props: { company: Company }, ref) => {
  const { t } = useTranslation();
  const { company } = props;
  const contacts = company.contacts?.results ?? [];
  const [elRefs, setElRefs] = useState<RefObject<{ save: () => void }>[]>([]);

  const contactsLength = contacts.length;
  const [newContactsCount, setNewContactsCount] = useState(0);
  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(contactsLength + newContactsCount)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [contactsLength, newContactsCount]);

  useImperativeHandle(ref, () => ({
    save: () => {
      return elRefs.map((ref) => ref.current?.save?.()).flat();
    },
  }));

  const newContactComponents =
    newContactsCount > 0 &&
    Array(newContactsCount)
      .fill(null)
      .map((_, i) => (
        <ContactFormItem ref={elRefs[contactsLength + i]} key={i} hideTopBorder={false} companyId={company.id} />
      ));

  return (
    <CompanyAccordion>
      {contacts.map((contact: Contact, i: number) => (
        <ContactFormItem ref={elRefs[i]} key={contact.id} contact={contact} hideTopBorder={i === 0} />
      ))}
      {newContactComponents}
      <AccordionItem>
        <CreateTableItemButton onClick={() => setNewContactsCount(newContactsCount + 1)} label={t('New Contact')} />
      </AccordionItem>
    </CompanyAccordion>
  );
});

export default UpdateView;
