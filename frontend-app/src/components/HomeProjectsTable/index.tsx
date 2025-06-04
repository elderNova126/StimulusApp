import { useQuery } from '@apollo/client';
import { Box, CircularProgress, Grid, Typography } from '@material-ui/core';
import { navigate, RouteComponentProps } from '@reach/router';
import { useTranslation } from 'react-i18next';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { inProgressProjectTableMapper } from '../../utils/dataMapper';
import { utcStringToLocalDate } from '../../utils/date';
import { localeUSDFormat } from '../../utils/number';
import GenericTable from '../GenericTable';
import useStyles from './style';

const { HOME_PROJECTS_GQL } = ProjectQueries;

const HomeProjectsTable = (props: RouteComponentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { loading, data } = useQuery(HOME_PROJECTS_GQL(), { fetchPolicy: 'cache-first' });

  const projects = data?.searchProjects?.results;
  let renderProjects;
  if (loading) {
    renderProjects = (
      <div className={classes.loader}>
        <CircularProgress data-testid="loading" />
      </div>
    );
  } else if (projects?.length) {
    const labels = { score: t('Score'), startDate: t('Start Date'), endDate: t('Expected End Date') };

    const handleRowClick = (projectId: number) => {
      navigate(`/project/${projectId}`);
    };

    const content = {
      loading,
      showHeaders: false,
      headers: [
        {
          mappedKey: 'title',
          align: 'left',
          subtitleKey: 'subtitle',
          keyClass: classes.projectTitle,
          subtitleClass: classes.projectScore,
        },
      ],
      onRowClick: handleRowClick,
      rows: inProgressProjectTableMapper(data?.searchProjects, labels).map((project) => ({
        ...project,
        subtitle: (
          <Grid container justifyContent="space-between" alignItems="flex-end">
            <Grid item xs={8}>
              <Box textOverflow="elipsis" overflow="hidden">
                <Typography noWrap className={classes.projectScore}>
                  {project.companies}
                </Typography>
              </Box>
              <Typography className={classes.projectScore}>{localeUSDFormat(project.budget)}</Typography>
            </Grid>
            <Grid item xs={4} container direction="row-reverse">
              <Typography className={classes.projectScore}>
                {`${utcStringToLocalDate(project.startDate)}${
                  project.expectedEndDate ? ` to ${utcStringToLocalDate(project.expectedEndDate)}` : ''
                }`}
              </Typography>
            </Grid>
          </Grid>
        ),
      })),
    };

    renderProjects = <GenericTable className={classes.root} variant="regularSmallPadding" content={content} />;
  } else {
    renderProjects = (
      <Typography variant="body1" color="textSecondary" className={classes.noProjects}>
        {t('Currently, there are no active projects.')}
      </Typography>
    );
  }

  return <div className={classes.root}>{renderProjects}</div>;
};

export default HomeProjectsTable;
