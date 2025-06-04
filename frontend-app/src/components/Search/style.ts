import { alpha, makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
    },
    icon: {
      position: 'relative',
      top: '5px',
      marginRight: '5px',
      color: 'rgba(0, 0, 0, 0.54)',
    },
    wrapperInput: {
      position: 'relative',
    },
    iconInput: {
      position: 'absolute',
      top: '4px',
      fontSize: '17px',
      color: '#D2D7BB',
    },
    searchInput: {
      '& input': {
        height: '14px',
        color: '#D2D7BB',
        fontWeight: 600,
        fontFamily: 'Open Sans',
        fontSize: '12px',
        letterSpacing: 0,
        lineHeight: '14px',
      },
      '& .MuiAutocomplete-inputRoot': {
        paddingLeft: '18px',
        '&:before': {
          borderBottom: '2px solid #D2D7BB',
        },
      },
    },
    optionCompany: {
      position: 'relative',
      top: '-2px',
      fontWeight: 'bold',
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      color: '#000000',
      fontFamily: 'Poppins',
      fontSize: '13px',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: '20px',
    },
    actionOption: {
      color: theme.palette.primary.main,
    },
    score: {
      position: 'relative',
      top: '2px',
      color: '#919482',
      fontFamily: 'Roboto',
      fontSize: '10px',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: '11px',
      textAlign: 'right',
    },
  })
);
