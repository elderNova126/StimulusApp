const styleDropdownList = {
  bg: '#fff',
  zIndex: 'tooltip',
  w: '100%',
  maxH: '193px',
  position: 'absolute',
  border: '1px solid #E4E4E4',
  boxSizing: 'border-box',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
};

const styleDropdownSubList = (ml: string, maxH: string) => {
  return {
    position: 'absolute',
    l: '0',
    r: '0',
    mt: '-50px',
    ml,
    bg: '#fff',
    zIndex: 'tooltip',
    maxH,
    overflow: 'scroll',
    w: '410px',
    border: '1px solid #E4E4E4',
    boxSizing: 'border-box',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
  };
};

const naicsTooltipBox = {
  bg: '#fff',
  p: '5px',
  border: '1px solid #E4E4E4',
  borderColor: '#E4E4E4',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
};

export { styleDropdownList, styleDropdownSubList, naicsTooltipBox };
