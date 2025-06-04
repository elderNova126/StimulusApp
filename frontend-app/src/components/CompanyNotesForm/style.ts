import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      justifyContent: 'center',
      padding: '5px',
      maxWidth: '100%',
      borderRadius: 4,
      height: 50,
      border: '1px solid #848484',
    },
    form: {
      width: '90%',
      height: '100%',
    },
    buttonSend: {
      width: 80,
      fontsize: 12,
    },
  })
);
