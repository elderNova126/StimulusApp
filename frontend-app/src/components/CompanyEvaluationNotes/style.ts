import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    notesGroup: {
      '& .replyNote__first :nth-child(1):before': {
        border: '1px solid #F5F5D9',
        borderBottomLeftRadius: '10%',
        display: 'inline',
        position: 'absolute',
        left: '-16px',
        borderWidth: '0px 0px 2px 2px',
        width: '2px',
        flexGrow: 1,
        height: 2,
      },
      '& .replyNote': {
        marginLeft: 30,
      },
    },
    root: {
      marginTop: 45,
    },
    divider: {
      marginTop: 10,
    },
    note: {
      // marginTop: 25,
      // marginBottom: 25,
    },
    addNoteBtn: {
      marginLeft: '5px',
    },
    loadMore: {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    sectionTitle: {
      fontFamily: 'Poppins',
      fontSize: '16px',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '25px',
      marginBottom: '5px',
    },
    notesSection: {
      marginTop: '25px',
    },
    modalIcon: {
      fontSize: '7.188rem',
    },

    rootItem: {
      flexGrow: 1,
      '&.MuiTreeItem-root .MuiTreeItem-label, &.MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover':
        {
          backgroundColor: 'transparent',
        },
      '&.MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
        backgroundColor: 'transparent',
      },
      '&.MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label': {
        backgroundColor: 'transparent',
      },
    },
    labelItem: {
      // cursor: 'auto',
    },
    group: {
      marginLeft: 7,
      paddingLeft: 15,
      // borderLeft: `2px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
    cancelAction: {
      fontFamily: 'Poppins',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '21px',
      textAlign: 'center',
    },
    backAction: {
      color: '#1BB062',
      fontFamily: 'Poppins',
      fontSize: '16px',
      letterSpacing: '0',
      lineHeight: '25px',
    },
    modalAction: {
      marginBottom: 15,
    },
    modalTitle: {
      margin: theme.spacing(2),
      fontFamily: 'Poppins',
      fontSize: '20px',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: '30px',
      textAlign: 'center',
    },
    modalSubtitle: {
      margin: theme.spacing(2),
      marginTop: 8,
      color: '#919482',
      fontFamily: 'Roboto',
      fontSize: '14px',
      letterSpacing: '0',
      lineHeight: '16px',
    },
  })
);
