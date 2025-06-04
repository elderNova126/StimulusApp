import { useQuery } from '@apollo/client';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import { setIndustries } from '../../../stores/features/company';
import NaicsCodeEditSelectWrapper from '../../NaicsCodeEditSelect';
const { GET_NAICS_INDUSTRIES } = CompanyQueries;

interface IndustryCodeItem {
  id: string;
  code: string;
  title: string;
  label: string;
  value: string;
}

const IndustriesForm: FC<{ industries: IndustryCodeItem[] }> = (props) => {
  const { industries = [] } = props;
  const dispatch = useDispatch();
  const { data: naicsIndustries, loading } = useQuery(GET_NAICS_INDUSTRIES, {
    fetchPolicy: 'network-only',
  });
  const [industriesEdit, setIndustriesEdit] = useState<IndustryCodeItem[]>(industries);

  return (
    <>
      <NaicsCodeEditSelectWrapper
        loading={loading}
        naicsIndustries={naicsIndustries}
        industriesSelected={industriesEdit}
        selectedNaics={industriesEdit}
        setSelectedNaics={(industry: any) => {
          // remplace object
          const newIndustries: any[] = [...industriesEdit];
          newIndustries.push(industry);
          setIndustriesEdit(newIndustries);
          dispatch(setIndustries(newIndustries));
        }}
        setDeleteNaics={(industry: any) => {
          // remove object
          const newIndustries: any[] = industriesEdit.filter((item) => item.id !== industry.id);
          setIndustriesEdit(newIndustries);
          dispatch(setIndustries(newIndustries));
        }}
      />
    </>
  );
};

export default IndustriesForm;
