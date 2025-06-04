export const avatarBox = {
  w: '25px',
  h: '25px',
};
export const avatarBoxChat = (reply: boolean) => {
  return {
    w: reply ? '24px' : '32px',
    h: reply ? '24px' : '32px',
    mt: '-3px',
  };
};

export const timeCommentTab = {
  lineHeight: '28px',
  fontSize: '12px',
  fontWeight: '400',
  color: '#2A2A28',
};

export const namesCommentTab = {
  fontSize: '12px',
  fontWeight: '600',
  ml: '10px',
  mr: '5px',
  lineHeight: '28px',
};

export const stackCommentBody = (reply: boolean) => {
  return {
    pl: '5px',
    w: reply ? '247px' : '275px',
    mt: '0px !important',
    borderRadius: '20px',
    bg: '#E9F8ED',
    minH: '70px',
    ml: '32px !important',
  };
};

export const textCommentBody = {
  p: '10px 5px 5px 6px',
  fontSize: '14px',
  fontWeight: '400',
  overflow: 'auto',
};

export const boxCommentSection = {
  my: '10px',
  minW: '360px',
  mr: '30px',
};

export const boxPopoverAndDeleteModal = {
  mt: '10px',
  w: '388px',
  bg: '#FFFFFF',
  border: '1px solid #E4E4E4',
  borderRadius: '4px',
};

export const boxPopoverTrigger = {
  visibility: 'hidden',
  w: '0',
  h: '0',
  position: 'fixed',
  bottom: '10px',
  right: '10px',
};

export const boxPopoverContent = {
  maxHeight: '680px',
  border: 'none',
  bg: '#FCFBFB',
  minWidth: '380px',
  maxWidth: '20vw',
  mr: '5',
  width: 'auto',
};

export const popoverHeader = {
  borderColor: '#E4E4E4',
  ml: '-11px !important',
  w: '380px !important',
  p: '20px',
  fontWeight: '400',
  fontSize: '18px',
  color: '#2A2A28',
};

export const popoverBody = {
  bg: '#FCFBFB',
  shadow: '-4px 0px 14px -1px rgba(0, 0, 0, 0.11)',
  h: '460px',
};

export const containerCommentTab = {
  bg: '#FCFBFB',
  h: '377px',
  maxWidth: '380px',
  overflowY: 'scroll',
};

export const deleteButton = {
  borderColor: '#12814B',
  borderRadius: '4px',
  color: '#12814B',
  h: '30px',
  w: '70px',
  fontSize: '13px',
};

export const cancelButtonModal = {
  h: '30px',
  w: '70px',
  mr: '15px',
  fontSize: '13px',
};

export const namesCommentDisplay = {
  fontSize: '12px',
  fontWeight: '600',
  mx: '10px',
  lineHeight: '25px',
};

export const timeCommentDisplay = {
  lineHeight: '25px',
  fontSize: '11px',
  fontWeight: '300',
  color: '#2A2A28',
};

export const bodyCommentsDisplay = {
  pl: '5px',
  fontSize: '12px',
  fontWeight: '400',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  w: '348px',
  whiteSpace: 'nowrap',
};

export const noCommentsTextArea = {
  _focus: { border: 'none' },
  resize: 'none',
  border: 'none',
  type: 'text',
  color: '#2A2A28CC',
  fontWeight: '400',
  fontSize: '14px',
};

export const noCommentsButton = {
  w: '52px',
  height: '34px',
  fontSize: '13px',
};

export const cancelButton = {
  fontWeight: '600',
  color: '#2A2A28',
  fontSize: '13px',
  textDecoration: 'underline',
  mr: '20px',
};

export const flexNoCommentButton = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  mr: '10px',
  mt: '4px',
};

export const boxTextAreaComment = {
  mt: '0px',
  mb: '10px',
  border: '1px solid #848484',
  borderRadius: '4px',
  bg: '#FFFFFF',
  w: '344px',
  h: '107px',
};

export const textAreaComments = {
  _focus: { border: 'none' },
  resize: 'none',
  type: 'text',
  border: 'none',
  color: '#2A2A28CC',
  fontWeight: '400',
  fontSize: '14px',
};

export const iconsStyle = {
  margin: '0px 5px 0px 5px',
  color: '#2A2A28',
  width: '15px',
  cursor: 'pointer',
};

export const replyIconsStyle = {
  margin: '-3px 3px 0px 5px',
  color: '#2A2A28',
  width: '19px',
  cursor: 'pointer',
};

export const styleFormControl = {
  p: '0',
  mx: '5px',
};

export const noCommentsBox = {
  p: '10px 10px 0px 10px',
  h: '90px',
  border: '1px solid #848484',
  maxW: '388px',
  borderRadius: '4px',
  mt: '10px',
};

export const setCounterColor = (newValueText: string, total: number) => {
  const percentage90 = total * 0.9;
  const percentage96 = total * 0.96;

  const length = newValueText.length;

  return length > percentage90 && length < percentage96 ? 'yellow.500' : length >= percentage96 ? 'red' : '#808079';
};

export const messageCommentError = {
  textStyle: 'h6',
  color: 'secondary',
};

export const deleteModal = {
  w: '500px',
  h: '196px',
  bg: '#f6f6f6',
  border: '1px solid var(--tooltip-box, #E4E4E4)',
  borderRadius: '2px',
  boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.25)',
  mt: '28vh',
};
