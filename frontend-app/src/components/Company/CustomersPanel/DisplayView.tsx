import { useTranslation } from 'react-i18next';
import { convertToShortNo } from '../../../utils/number';
import { Company } from '../company.types';
import ItemPanel from './ItemPanel';

const DisplayView = (props: { company: Company }) => {
  const { t } = useTranslation();
  const { company } = props;
  const shortSufix = {
    thousand: t('K'),
    million: t('M'),
  };

  return (
    <>
      {!!company.customers && (
        <ItemPanel
          label={t('Customers')}
          value={company.customers}
          secondValue={company.customersGrowthCAGR ? `${company.customersGrowthCAGR} % CAGR` : ''}
          secondColor="green.600"
        />
      )}
      {!!company.netPromoterScore && (
        <ItemPanel label={t('Net Promoter Score')} progress={true} value={Math.floor(company.netPromoterScore * 100)} />
      )}
      {!!company.linkedInFollowers && (
        <ItemPanel label={t('Linkedin')} value={convertToShortNo(shortSufix, company.linkedInFollowers)} />
      )}
      {!!company.twitterFollowers && (
        <ItemPanel label={t('Twitter')} value={convertToShortNo(shortSufix, company.twitterFollowers)} />
      )}
      {!!company.facebookFollowers && (
        <ItemPanel label={t('Facebook')} value={convertToShortNo(shortSufix, company.facebookFollowers)} />
      )}
    </>
  );
};

export default DisplayView;
