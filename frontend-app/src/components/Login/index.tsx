import { Button, Card, CardMedia, Grid } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import { useTranslation } from 'react-i18next';
import useStyles from './style';

const Login = (props: RouteComponentProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sm={6}>
        <Card className={classes.card}>
          <CardMedia image={'/desk.jpg'} className={classes.media} data-testid="cardMedia" />
          <div className={classes.overlay}>{t('Stimulus')}</div>
        </Card>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sm={6}
        className={classes.loginForm}
        alignItems="flex-start"
        justifyContent="flex-end"
      >
        <Grid item>
          <Button variant="contained" color="primary" disableElevation>
            {t('Login')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;
