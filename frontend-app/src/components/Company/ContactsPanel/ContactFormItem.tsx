import { useMutation } from '@apollo/client';
import { Text } from '@chakra-ui/layout';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContactMutations from '../../../graphql/Mutations/ContactMutations';
import { Contact } from '../company.types';
import { EditCompanyRowAccordion, EditCompanySelectField, EditCompanyTextField } from '../shared';

const { UPDATE_CONTACT_GQL, CREATE_CONTACT_GQL } = ContactMutations;

const ContactFormItem = forwardRef((props: { contact?: Contact; companyId?: string; hideTopBorder: boolean }, ref) => {
  const { t } = useTranslation();
  const { contact, companyId, hideTopBorder } = props;
  const [firstName, setFirstName] = useState(contact?.firstName ?? '');
  const [department, setDepartment] = useState(contact?.department ?? '');
  const [email, setEmail] = useState(contact?.email ?? '');
  const [emailAlt, setEmailAlt] = useState(contact?.emailAlt ?? '');
  const [middleName, setMiddleName] = useState(contact?.middleName ?? '');
  const [lastName, setLastName] = useState(contact?.lastName ?? '');
  const [fullName, setFullName] = useState(contact?.fullName ?? '');
  const [jobTitle, setJobTitle] = useState(contact?.jobTitle ?? '');
  const [addressStreet, setAddressStreet] = useState(contact?.addressStreet ?? '');
  const [addressStreet2, setAddressStreet2] = useState(contact?.addressStreet2 ?? '');
  const [addressStreet3, setAddressStreet3] = useState(contact?.addressStreet3 ?? '');
  const [fax, setFax] = useState(contact?.fax ?? '');
  const [language, setLanguage] = useState(contact?.language ?? '');
  const [title, setTitle] = useState(contact?.title ?? '');
  const [website, setWebsite] = useState(contact?.website ?? '');
  const [linkedin, setLinkedin] = useState(contact?.linkedin ?? '');
  const [twitter, setTwitter] = useState(contact?.twitter ?? '');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [phoneAlt, setPhoneAlt] = useState(contact?.phoneAlt ?? '');
  const [showError] = useState(false);
  const [updateContact] = useMutation(UPDATE_CONTACT_GQL);
  const [createContact] = useMutation(CREATE_CONTACT_GQL);

  const handleNames = (field: string, value: string) => {
    // split per space

    const names = {
      firstName: field === 'firsName' ? value : '',
      middleName: field === 'middleName' ? value : '',
      lastName: field === 'lastName' ? value : '',
      fullName: field === 'fullName' ? value : '',
    };

    if (field !== 'fullName') {
      value = value.trim();
    }
    if (field === 'middleName') {
      setMiddleName(value);
      names.middleName = value;
      names.fullName = `${firstName}${!firstName && middleName ? value + ' ' : ' ' + value + ' '}${lastName}`;
      setFullName(names.fullName);
    } else if (field === 'firstName') {
      setFirstName(value);
      names.firstName = value;
      names.fullName = `${middleName ? value + ' ' : value}${middleName && middleName + ' '}${
        !middleName ? ' ' + lastName : lastName
      }`;
      setFullName(names.fullName);
    } else if (field === 'lastName') {
      setLastName(value);
      names.lastName = value;
      names.fullName = `${firstName && firstName + ' '}${middleName && middleName + ' '}${value}`;
      setFullName(names.fullName);
    } else if (field === 'fullName') {
      names.fullName = value;
      setFullName(value);
    }
  };

  const verifyValues = (oldValue: string | null, newValue: string | null) => {
    return oldValue === null && newValue === '';
  };

  const save = async () => {
    if (contact?.id) {
      const updates = {
        ...(verifyValues(contact.firstName, firstName) === false && firstName !== contact.firstName && { firstName }),
        ...(verifyValues(contact.middleName, middleName) === false &&
          middleName !== contact.middleName && { middleName }),
        ...(verifyValues(contact.lastName, lastName) === false && lastName !== contact.lastName && { lastName }),
        ...(verifyValues(contact.fullName, fullName) === false && fullName !== contact.fullName && { fullName }),
        ...(!!department && department !== contact.department && { department }),
        ...(!!email && email !== contact.email && { email }),
        ...(!!emailAlt && emailAlt !== contact.emailAlt && { emailAlt }),
        ...(!!jobTitle && jobTitle !== contact.jobTitle && { jobTitle }),
        ...(!!addressStreet && addressStreet !== contact.addressStreet && { addressStreet }),
        ...(!!addressStreet2 && addressStreet2 !== contact.addressStreet2 && { addressStreet2 }),
        ...(!!addressStreet3 && addressStreet3 !== contact.addressStreet3 && { addressStreet3 }),
        ...(!!fax && fax !== contact.fax && { fax }),
        ...(!!language && language !== contact.language && { language }),
        ...(!!title && title !== contact.title && { title }),
        ...(!!website && website !== contact.website && { website }),
        ...(!!linkedin && linkedin !== contact.linkedin && { linkedin }),
        ...(!!twitter && twitter !== contact.twitter && { twitter }),
        ...(!!phone && phone !== contact.phone && { phone }),
        ...(!!phoneAlt && phoneAlt !== contact.phoneAlt && { phoneAlt }),
      };
      if (Object.keys(updates).length > 0) {
        return updateContact({
          variables: {
            id: contact.id,
            ...updates,
          },
        });
      }
    } else {
      return createContact({
        variables: {
          companyId,
          firstName,
          department,
          email,
          emailAlt,
          middleName,
          fullName,
          lastName,
          jobTitle,
          addressStreet,
          addressStreet2,
          addressStreet3,
          fax,
          language,
          title,
          website,
          linkedin,
          twitter,
          phone,
          phoneAlt,
        },
      });
    }
  };

  useImperativeHandle(ref, () => ({
    save,
  }));

  const rowName = fullName ? fullName : firstName + ' ' + lastName;

  return (
    <EditCompanyRowAccordion name={rowName ?? t('New Contact')} {...(hideTopBorder && { borderTopWidth: '0' })}>
      <EditCompanyTextField
        required={true}
        type="text"
        label={t('First Name')}
        locked={false}
        value={firstName}
        onChange={(val) => handleNames('firstName', val as string)}
      />
      {showError && !firstName && (
        <Text textStyle="h6" color="secondary">
          {t('This is required')}
        </Text>
      )}
      <EditCompanyTextField
        type="text"
        label={t('Middle Name')}
        locked={false}
        value={middleName}
        onChange={(val) => handleNames('middleName', val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Last Name')}
        locked={false}
        value={lastName}
        onChange={(val) => handleNames('lastName', val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Full Name')}
        locked={false}
        value={fullName}
        onChange={(val) => handleNames('fullName', val as string)}
        // onBlur={(val) => handleFullNameChange(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Job Title')}
        locked={false}
        value={jobTitle}
        onChange={(val) => setJobTitle(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Title')}
        locked={false}
        value={title}
        onChange={(val) => setTitle(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Department')}
        locked={false}
        value={department}
        onChange={(val) => setDepartment(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Address')}
        locked={false}
        value={addressStreet}
        onChange={(val) => setAddressStreet(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Address Line 2')}
        locked={false}
        value={addressStreet2}
        onChange={(val) => setAddressStreet2(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Address Line 3')}
        locked={false}
        value={addressStreet3}
        onChange={(val) => setAddressStreet3(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Email')}
        locked={false}
        value={email}
        onChange={(val) => setEmail(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Secondary Email')}
        locked={false}
        value={emailAlt}
        onChange={(val) => setEmailAlt(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Phone')}
        locked={false}
        value={phone}
        onChange={(val) => setPhone(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Secondary Phone')}
        locked={false}
        value={phoneAlt}
        onChange={(val) => setPhoneAlt(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Fax')}
        locked={false}
        value={fax}
        onChange={(val) => setFax(val as string)}
      />
      <EditCompanySelectField
        label={t('Language')}
        value={language}
        options={['English', 'Romanian']}
        onChange={(val) => setLanguage(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Linkedin')}
        locked={false}
        value={linkedin}
        onChange={(val) => setLinkedin(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Twitter')}
        locked={false}
        value={twitter}
        onChange={(val) => setTwitter(val as string)}
      />
      <EditCompanyTextField
        type="text"
        label={t('Website')}
        locked={false}
        value={website}
        onChange={(val) => setWebsite(val as string)}
      />
    </EditCompanyRowAccordion>
  );
});

export default ContactFormItem;
