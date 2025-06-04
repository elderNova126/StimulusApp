import { FormControl, Grid, MenuItem, Paper, Select, Slider, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './style';

interface FilterPanelProps {
  title: string;
  fields: FieldProps[];
}

interface FieldProps {
  label: string;
  values: string[];
  current: string;
  importance: number;
  onChange: (object: { value: string; importance: number }) => void;
}

const FilterPanel = (props: FilterPanelProps) => {
  const { title, fields } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Paper elevation={3} variant="outlined" className={classes.paper}>
      <Grid container spacing={1}>
        <Grid item xs={12} className={classes.textCenter}>
          <Typography variant="subtitle1" color="textSecondary">
            {title}
          </Typography>
        </Grid>
        {fields.map(({ label, values, onChange, current, importance }) => (
          <Grid
            key={label}
            item
            xs={12}
            container
            direction="column"
            justifyContent="center"
            className={classes.panelGroup}
          >
            <Typography variant="body2" color="textSecondary">
              {label}
            </Typography>
            <FormControl className={classes.formControl}>
              <Select
                value={current}
                variant="outlined"
                onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                  onChange({ value: event.target.value as string, importance })
                }
                inputProps={{ 'data-testid': 'select-filter-field' }}
              >
                {values.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <div className={classes.importancePercentage}>
                <Typography variant="body2" color="textSecondary" className={classes.textCenter}>
                  {t('How important is it fit in your search?')}
                </Typography>
                <Slider
                  defaultValue={importance}
                  aria-labelledby="discrete-slider-custom"
                  step={1}
                  min={0}
                  max={10}
                  valueLabelDisplay="auto"
                />
              </div>
            </FormControl>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

const CustomDiscoveryFiltersPanel = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [filterState, setFilterState] = useState({
    organization: {
      organizationType: { value: 'Non-profit', importance: 3 },
      fieldOfInterests: { value: 'Agriculture', importance: 3 },
      organizationalAge: { value: 'Less than one year', importance: 3 },
      leadership: { value: 'African American', importance: 3 },
    },
    location: {
      state: { value: 'Pennsylvania', importance: 3 },
      city: { value: 'Philadelphia', importance: 3 },
    },
    program: {
      programType: { value: 'Grant', importance: 3 },
      fieldOfInterests: { value: 'Agriculture', importance: 3 },
      typeOfSupport: { value: 'Idea/Proof of Concept', importance: 3 },
      numbersOfEmployee: { value: 'Less Than Ten', importance: 3 },
    },
  });

  const onChangeFactory = (category: 'organization' | 'location' | 'program', field: any) => {
    const categoryFilters: any = filterState[category];

    return (obj: { value: string; importance: number }) => {
      categoryFilters[field] = obj;
      setFilterState({ ...filterState, [category]: categoryFilters });
    };
  };

  const organizationFields = [
    {
      label: 'Organization Type',
      importance: filterState.organization.organizationType.importance,
      current: filterState.organization.organizationType.value,
      values: ['Non-profit'],
      onChange: onChangeFactory('organization', 'organizationType'),
    },
    {
      label: 'Field of Interests',
      importance: filterState.organization.fieldOfInterests.importance,
      current: filterState.organization.fieldOfInterests.value,
      values: ['Agriculture'],
      onChange: onChangeFactory('organization', 'fieldOfInterests'),
    },
    {
      label: 'Organizational Age',
      importance: filterState.organization.organizationalAge.importance,
      current: filterState.organization.organizationalAge.value,
      values: ['Less than one year'],
      onChange: onChangeFactory('organization', 'organizationalAge'),
    },
    {
      label: 'Leadership/Race',
      importance: filterState.organization.leadership.importance,
      current: filterState.organization.leadership.value,
      values: ['African American', 'American'],
      onChange: onChangeFactory('organization', 'leadership'),
    },
  ];

  const locationFields = [
    {
      label: 'State',
      importance: filterState.location.state.importance,
      current: filterState.location.state.value,
      values: ['Pennsylvania'],
      onChange: onChangeFactory('location', 'state'),
    },
    {
      label: 'City',
      importance: filterState.location.city.importance,
      current: filterState.location.city.value,
      values: ['Philadelphia'],
      onChange: onChangeFactory('location', 'city'),
    },
  ];

  const programFields = [
    {
      label: 'Program Type',
      importance: filterState.program.programType.importance,
      current: filterState.program.programType.value,
      values: ['Grant'],
      onChange: onChangeFactory('program', 'programType'),
    },
    {
      label: 'Field of Interests',
      importance: filterState.program.fieldOfInterests.importance,
      current: filterState.program.fieldOfInterests.value,
      values: ['Agriculture'],
      onChange: onChangeFactory('program', 'fieldOfInterests'),
    },
    {
      label: 'Type of Support',
      importance: filterState.program.typeOfSupport.importance,
      current: filterState.program.typeOfSupport.value,
      values: ['Idea/Proof of Concept'],
      onChange: onChangeFactory('program', 'typeOfSupport'),
    },
    {
      label: 'Number of Employees',
      importance: filterState.program.numbersOfEmployee.importance,
      current: filterState.program.numbersOfEmployee.value,
      values: ['Less Than Ten'],
      onChange: onChangeFactory('program', 'numbersOfEmployee'),
    },
  ];

  return (
    <Grid container alignContent="center" justifyContent="center" spacing={2} item xs={12}>
      <Grid item xs={12} className={classes.textCenter}>
        <Typography variant="subtitle1">{t('CUSTOM FILTER')}</Typography>
      </Grid>
      <Grid item xs={12} data-testid="organization-filter">
        <FilterPanel title={t('Organization')} fields={organizationFields} />
      </Grid>
      <Grid item xs={12} data-testid="location-filter">
        <FilterPanel title={t('Location')} fields={locationFields} />
      </Grid>
      <Grid item xs={12} data-testid="programProfile-filter">
        <FilterPanel title={t('Program Profile')} fields={programFields} />
      </Grid>
    </Grid>
  );
};

export default CustomDiscoveryFiltersPanel;
