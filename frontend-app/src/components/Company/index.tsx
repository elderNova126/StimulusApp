import { useQuery } from '@apollo/client';
import { Alert, AlertIcon, Box, CloseButton, Flex, Stack } from '@chakra-ui/react';
import { RouteComponentProps, navigate } from '@reach/router';
import { RefObject, createRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useStimulusToast } from '../../hooks';
import { CompanyUpdateState, initCompany, setCompanyEdit, setLoading } from '../../stores/features/company';
import CompanyLeftMenu from './LeftMenu/LeftMenu';
import ListsAndCounter from './ListsAndCounter';
import UpdatePanel from './UpdatePanel';
import { Section } from './company.types';
import { FilteredDefaultSection, SectionComponents } from './shared';
import './styles.css';
import { FormCompanyProvider } from '../../hooks/companyForms/companyForm.provider';
import LoadingScreen from '../LoadingScreen';

const { COMPANY_DETAILS_GQL } = CompanyQueries;
interface CompanyProps {
  companyId?: string;
}

const CompanyView = (props: RouteComponentProps & CompanyProps) => {
  const [alertForList, setAlertForL] = useState(false);
  const { companyId } = props;
  const { enqueueSnackbar } = useStimulusToast();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const edit = useSelector((state: { company: CompanyUpdateState }) => state.company?.edit);
  const [elRefs, setElRefs] = useState<RefObject<{ save: () => void }>[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const { loading, refetch } = useQuery(COMPANY_DETAILS_GQL, {
    variables: { id: companyId },
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      dispatch(initCompany(data?.searchCompanyById?.results?.[0]));
      setCompany(data?.searchCompanyById?.results?.[0]);
      setFilteredSections(FilteredDefaultSection(data?.searchCompanyById?.results?.[0]));
    },
    onError() {
      navigate('/companies/all/list/1');
    },
  });

  const visibleSections = useMemo(
    () => filteredSections.filter((section: Section) => section.show).map(({ name }: Section) => name),
    [filteredSections]
  );
  const sectionsLength = visibleSections.length;

  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(sectionsLength)
        .fill(null)
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [sectionsLength]);

  const submitChanges = () => {
    Promise.allSettled(elRefs.map((ref) => ref.current?.save?.()).flat())
      .then((results) => {
        const data = results.map((result) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            return { errors: true };
          }
        });
        if (!data.find((response: any) => !!response?.errors)) {
          dispatch(setCompanyEdit(false));
          const message = t('Changes saved');
          enqueueSnackbar(message, { status: 'success' });
        }
      })
      .finally(() => dispatch(setLoading(false)));
  };

  return (
    <>
      <FormCompanyProvider>
        <Flex direction="row">
          <Box h="100vh" minW="360px" maxW="420px">
            {!!filteredSections.length && (
              <CompanyLeftMenu
                company={company}
                companyId={companyId!}
                sections={filteredSections}
                setSections={setFilteredSections}
              />
            )}
            {edit || loading ? null : <ListsAndCounter showAlert={setAlertForL} />}
          </Box>
          <Box flex="1" p={edit ? '0' : '2.5rem'}>
            {edit && <UpdatePanel company={company} onSubmit={submitChanges} getCompanies={refetch} />}
            {alertForList && (
              <Alert status="error" marginTop="3%" marginBottom="1%" justifyContent="center">
                <AlertIcon />
                You select a list without companies
                <CloseButton marginLeft="2%" onClick={() => setAlertForL(false)} />
              </Alert>
            )}
            {loading && (
              <Box h="100vh" d="flex" justifyContent="center" alignContent="center">
                <LoadingScreen />
              </Box>
            )}
            {!!company && (
              <Stack spacing={'5rem'} mt={edit ? '10' : '0'}>
                {visibleSections.map((section: string, index: number) => {
                  const Component = SectionComponents[section] as any;
                  return (
                    Component && (
                      <Component ref={elRefs[index]} key={`${section}_${index}`} company={company} edit={edit} />
                    )
                  );
                })}
              </Stack>
            )}
          </Box>
        </Flex>
      </FormCompanyProvider>
    </>
  );
};

export default CompanyView;
