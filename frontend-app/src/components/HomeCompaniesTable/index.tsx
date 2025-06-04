import { useQuery } from '@apollo/client';
import { CircularProgress, Typography } from '@material-ui/core';
import { navigate, RouteComponentProps } from '@reach/router';
import { useTranslation } from 'react-i18next';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { companyDataMapper } from '../../utils/dataMapper';
import GenericTable from '../GenericTable';
import useStyles from './style';

const { HOME_COMPANIES_GQL } = CompanyQueries;

const HomeCompaniesTable = (props: RouteComponentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { loading, data } = useQuery(HOME_COMPANIES_GQL(), { fetchPolicy: 'cache-first' });
  const companies = data?.discoverCompanies?.results;
  let renderCompanies;

  if (loading) {
    renderCompanies = (
      <div className={classes.loader}>
        <CircularProgress data-testid="loading" />
      </div>
    );
  } else if (companies?.length) {
    const handleRowClick = (companyId: string) => {
      navigate(`/company/${companyId}`, { state: { breadcrumb: { name: t('Home'), href: '/' } } });
    };
    const content = {
      loading: false,
      showHeaders: false,
      headers: [
        { mappedKey: 'displayName', align: 'left', keyClass: classes.companyName },
        { mappedKey: 'stimulusScore', align: 'right', color: 'textSecondary', keyClass: classes.score },
      ],
      onRowClick: handleRowClick,
      rows: companyDataMapper(data, t('Score'), 'discoverCompanies'),
    };

    renderCompanies = <GenericTable className={classes.root} variant="regular" content={content} />;
  } else {
    renderCompanies = (
      <Typography variant="body1" color="textSecondary" className={classes.noCompanies}>
        {t(
          'Currently, there are no companies added to favorites. To add a favorite company, please click the Companies/Discovery page and the select the “star” icon next to the company.'
        )}
      </Typography>
    );
  }

  return <div className={classes.root}>{renderCompanies}</div>;
};

export default HomeCompaniesTable;
