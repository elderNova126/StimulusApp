import { AccordionItem } from '@chakra-ui/accordion';
import { Icon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import { createRef, forwardRef, RefObject, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdClose } from 'react-icons/io';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { styleNumber, styleNumberOfResults } from '../commonStyles';
import { Certification, Company } from '../company.types';
import { CompanyAccordion, CompanyProfileDivider, CreateTableItemButton } from '../shared';
import CompanyAttachments, { CompanyAttachmentTypes } from '../AttachmentsPanel/CompanyAttachments';
import CertificationFilters from './CertificationFilters';
import CertificationFormItem from './CertificationFormItem';
import CertificationItem from './CertificationItem';
import CertificationListView from './CertificationListView';
import CertificationGridView from './CertificationGridView';
import { calculateRemainingDays } from '../../../utils/companies/expirationInfo';
import StimButton from '../../ReusableComponents/Button';
const CertificationsPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;
  const { t } = useTranslation();
  const [isListView, setIsListView] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const certifications = useMemo<Certification[]>(() => {
    const certifications = company.certifications?.results ?? [];
    return certifications.map((certification) => {
      if (certification.expirationDate) {
        const remainingDays = calculateRemainingDays(certification.expirationDate);
        return { ...certification, remainingDays };
      }
      return { ...certification, remainingDays: null };
    });
  }, [company]);
  const [count, setcount] = useState(0);

  const filteredCertifications = useMemo(
    () => certifications.filter((certification) => selectedTypes.includes(certification.type)),
    [certifications, selectedTypes]
  );
  const availableTypes = useMemo(
    () => Array.from(new Set((certifications || []).map((certification) => certification.type))),
    [certifications]
  );

  useEffect(() => {
    if (company?.certifications?.results) {
      setcount(company.certifications.results.length);
    }
  }, [company]);

  return (
    <Stack spacing={edit || isListView ? 0 : 5} id="certifications">
      <Stack direction="column" spacing={4}>
        <Stack direction="row">
          <Flex>
            <Text as="h1" textStyle="h1_profile" marginRight="2.5%">
              {t('Certifications')}
            </Text>
            <CustomTooltip
              label={
                'Certifications that are available for the company including Ownership, Economic Development, Social, Environmental, Professional & Trade, Industrial & Quality, Security & Risk, Governance & Compliance etc.'
              }
            >
              <Box lineHeight="2rem">
                <InfoOutlineIcon color="gray" />
              </Box>
            </CustomTooltip>
            {count > 0 && (
              <Flex sx={styleNumberOfResults} marginTop="-2.5%">
                <Text sx={styleNumber}>{count}</Text>
              </Flex>
            )}
          </Flex>
          <Flex flexDirection="row" position="absolute" right="3rem">
            <CertificationFilters
              isOpen={isFiltersOpen}
              setIsOpen={setIsFiltersOpen}
              filterHook={[selectedTypes, setSelectedTypes]}
              availableTypes={availableTypes}
            />
            <StimButton
              {...(isFiltersOpen && { opacity: '.5' })}
              onClick={() => setIsListView(true)}
              size="stimSmall"
              variant={isListView ? 'stimPrimary' : 'stimTextButton'}
            >
              {t('List View')}
              {isListView && (
                <Icon
                  fontSize="12px"
                  margin="7px 0 7px 7px"
                  as={IoMdClose}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsListView(false);
                  }}
                />
              )}
            </StimButton>
          </Flex>
        </Stack>
        <CompanyProfileDivider />
      </Stack>
      {edit ? (
        <UpdateView
          ref={ref}
          certifications={selectedTypes.length ? filteredCertifications : certifications}
          companyId={company.id}
        />
      ) : (
        <DisplayView
          isListView={isListView}
          certifications={selectedTypes.length ? filteredCertifications : certifications}
        />
      )}
      <Box mt="32px !important" data-testid="certification-attachment">
        <Text as="h5" textStyle="h5" mb="1">
          {t('Attachments')}
        </Text>
        <CompanyAttachments company={company} type={CompanyAttachmentTypes.CERTIFICATION} />
      </Box>
    </Stack>
  );
});

const UpdateView = forwardRef((props: { certifications: Certification[]; companyId: string }, ref) => {
  const { certifications, companyId } = props;
  const [elRefs, setElRefs] = useState<RefObject<{ save: () => void }>[]>([]);
  const certificationsLength = certifications.length;
  const [newCertificationCount, setNewCertificationCount] = useState(0);
  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(certificationsLength + newCertificationCount)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [certificationsLength, newCertificationCount]);

  useImperativeHandle(ref, () => ({
    save: () => {
      return elRefs.map((ref) => ref.current?.save?.()).flat();
    },
  }));

  const newCertificationComponents =
    newCertificationCount > 0 &&
    Array(newCertificationCount)
      .fill(null)
      .map((_, i) => (
        <CertificationFormItem
          ref={elRefs[certificationsLength + i]}
          key={i}
          hideTopBorder={false}
          companyId={companyId}
        />
      ));
  return (
    <CompanyAccordion>
      {certifications.map((certification: Certification, i: number) => (
        <CertificationFormItem
          ref={elRefs[i]}
          key={certification.id}
          certification={certification}
          hideTopBorder={i === 0}
          companyId={companyId}
        />
      ))}
      {newCertificationComponents}
      <AccordionItem>
        <CreateTableItemButton
          onClick={() => setNewCertificationCount(newCertificationCount + 1)}
          label="New Certification"
        />
      </AccordionItem>
    </CompanyAccordion>
  );
});

const DisplayView = (props: { certifications: Certification[]; isListView?: boolean }) => {
  const { certifications, isListView } = props;
  const [index, setIndex] = useState(0);
  const { length: count } = certifications;
  const { t } = useTranslation();
  const [certificate, setCertificate] = useState(false);

  return (
    <>
      {count > 0 && !certificate && !isListView && (
        <CertificationGridView certifications={certifications} setCertificate={setCertificate} setIndex={setIndex} />
      )}
      {count === 0 && <Text>{t('No certifications found.')}</Text>}
      {count > 0 && certificate && !isListView && (
        <Stack>
          <CertificationItem
            certification={certifications[index]}
            index={index}
            total={count}
            next={() => setIndex(index + 1)}
            prev={() => setIndex(index - 1)}
            reset={() => setIndex(0)}
            close={setCertificate}
          />
        </Stack>
      )}
      {isListView && count > 0 && <CertificationListView certifications={certifications} />}
    </>
  );
};

export default CertificationsPanel;
