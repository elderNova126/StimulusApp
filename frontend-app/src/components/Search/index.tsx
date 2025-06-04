import { useLazyQuery } from '@apollo/client';
import { CircularProgress, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { navigate, RouteComponentProps } from '@reach/router';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { getCompanyName } from '../../utils/dataMapper';
import useStyles from './style';

const { SEARCH_GQL } = CompanyQueries;

const Search = (props: RouteComponentProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [searchText, setSearchText] = useState<string>('');
  const [searchCompanies, { loading, data: companies }] = useLazyQuery(SEARCH_GQL, { fetchPolicy: 'cache-first' });

  useEffect(() => {
    if (searchText.length > 3) {
      searchCompanies({ variables: { query: searchText } });
    }
  }, [searchText, searchCompanies]);

  const companiesResult = companies?.discoverCompanies?.results || [];
  const options = [
    {
      id: 0,
      type: 'action',
      name: t('Advanced Search'),
      onChange: () => {
        navigate(`/discovery`, { state: { query: searchText } });
        setSearchText(''); // clear text search
      },
    },
    ...companiesResult.map((company: any) => ({
      type: 'company',
      name: getCompanyName(company),
      ...company,
      onChange: () => {
        navigate(`/company/${company.id}`, { state: { breadcrumb: { name: t('Search') } } });
        setSearchText('');
      },
    })),
  ];

  return (
    <div className={classes.search}>
      <Autocomplete
        style={{ width: '30vw' }}
        forcePopupIcon={false}
        options={options}
        autoHighlight
        getOptionLabel={(option) => searchText ?? option.name}
        loading={loading}
        onChange={(e, option) => {
          return option && option.onChange();
        }}
        renderOption={(option: any, state: any) => {
          const { type, stimulusScore, name } = option;
          const optionClass = type === 'action' ? classes.actionOption : '';
          return (
            <div className={clsx(classes.option, optionClass)}>
              <div>
                <SearchIcon className={classes.icon} />
                <span className={classes.optionCompany}>{name}</span>
              </div>
              {type.type === 'company' ? (
                <div className={classes.score}>
                  <span>{t('Score')}:</span>
                  <span>
                    {stimulusScore && stimulusScore?.results
                      ? Math.round(stimulusScore?.results[0]?.scoreValue || 0)
                      : null}
                  </span>
                </div>
              ) : null}
            </div>
          );
        }}
        renderInput={(params) => (
          <div className={classes.wrapperInput}>
            <SearchIcon className={classes.iconInput} />
            <TextField
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={classes.searchInput}
              {...params}
              placeholder={t('Search Companies')}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default Search;
