import { useLazyQuery, useQuery } from '@apollo/client';
import { FC, useEffect, useMemo, useState } from 'react';
import { Autocomplete, CompanyAvatar, UserAvatar } from '.';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import UserQueries from '../../graphql/Queries/UserQueries';
import { getCompanyName } from '../../utils/dataMapper';
const { SEARCH_COMPANIES_SUBSET_GQL } = CompanyQueries;
const { TENANT_USERS_GQL } = UserQueries;
const { SEARCH_PROJECTS_SUBSET_GQL } = ProjectQueries;

const CompanySelectAutocomplete: FC<{ setCompanyId: (val: string | null) => void; companyId: string | null }> = (
  props
) => {
  const [searchCompanies, { data, loading }] = useLazyQuery(SEARCH_COMPANIES_SUBSET_GQL, {
    fetchPolicy: 'cache-first',
  });
  const companies = data?.searchCompaniesSubset?.results ?? [];
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState<{
    label: string;
    value: string;
    icon?: any;
  } | null>(null);

  const { companyId, setCompanyId } = props;

  useEffect(() => {
    !companyId && setInputValue('');
  }, [companyId]);

  useEffect(() => {
    setCompanyId(selectedItem?.value ?? null);
  }, [selectedItem]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    searchCompanies({ variables: { query: inputValue } });
  }, [inputValue, searchCompanies]);

  return (
    <Autocomplete
      value={inputValue}
      setValue={setInputValue}
      items={companies.map((company: any) => ({
        value: company.id,
        label: getCompanyName(company),
        icon: <CompanyAvatar companyId={company.id} name={getCompanyName(company)} />,
      }))}
      showIcon={true}
      loading={loading}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
    />
  );
};

const ProjectSelectAutocomplete: FC<{ setProjectId: (val: string | null) => void; projectId: string | null }> = (
  props
) => {
  const [searchProjects, { data, loading }] = useLazyQuery(SEARCH_PROJECTS_SUBSET_GQL, { fetchPolicy: 'cache-first' });
  const projects = data?.searchProjectsSubset?.results ?? [];
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState<{
    label: string;
    value: string;
    icon?: any;
  } | null>(null);
  const { projectId, setProjectId } = props;

  useEffect(() => {
    !projectId && setInputValue('');
  }, [projectId]);

  useEffect(() => {
    setProjectId(selectedItem?.value ?? null);
  }, [selectedItem]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    searchProjects({ variables: { query: inputValue } });
  }, [inputValue, searchProjects]);

  return (
    <Autocomplete
      loading={loading}
      selectedItem={selectedItem}
      value={inputValue}
      setValue={setInputValue}
      setSelectedItem={setSelectedItem}
      items={projects.map((project: any) => ({
        value: project.id,
        label: project.title,
      }))}
    />
  );
};

const UserSelectAutocomplete: FC<{ setUserId: (val: string | null) => void; userId: string | null }> = (props) => {
  const { data, loading } = useQuery(TENANT_USERS_GQL, { fetchPolicy: 'cache-first' });
  const allUsers = useMemo(
    () => (data?.tenantUsers?.results ?? []).filter(({ externalAuthSystemId }: any) => externalAuthSystemId),
    [data]
  );
  const [inputValue, setInputValue] = useState('');
  const [usersToShow, setUsersToShow] = useState([]);
  const { userId, setUserId } = props;
  const [selectedItem, setSelectedItem] = useState<{
    label: string;
    value: string;
    icon?: any;
  } | null>(null);

  useEffect(() => {
    !userId && setInputValue('');
  }, [userId]);

  useEffect(() => {
    setUserId(selectedItem?.value ?? null);
  }, [selectedItem, setUserId]);

  useEffect(() => {
    const lowercasevalue = inputValue.toLowerCase();
    setUsersToShow(
      allUsers.filter(
        (user: any) =>
          user.email?.indexOf?.(lowercasevalue) > -1 ||
          `${user.givenName?.toLowerCase?.() ?? ''} ${user.surname?.toLowerCase?.() ?? ''}`.indexOf(lowercasevalue) > -1
      )
    );
  }, [inputValue, allUsers, setUsersToShow]);

  return (
    <Autocomplete
      showIcon={true}
      loading={loading}
      selectedItem={selectedItem}
      value={inputValue}
      setValue={setInputValue}
      setSelectedItem={setSelectedItem}
      items={usersToShow.map((user: any) => ({
        value: user.externalAuthSystemId,
        label: `${user.givenName ?? ''} ${user.surname ?? ''}`.trim() ?? user.email,
        icon: <UserAvatar userId={user.externalAuthSystemId} />,
      }))}
    />
  );
};

export { CompanySelectAutocomplete, ProjectSelectAutocomplete, UserSelectAutocomplete };
