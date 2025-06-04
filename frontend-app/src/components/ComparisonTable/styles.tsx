// index comparison table styles

export const styleCompanyDropdown = {
  position: 'absolute',
  ml: '220px',
  mt: '13px',
  zIndex: '2',
};

export const containerDropdown = {
  position: 'absolute',
  right: '30px',
  zIndex: '2',
};

export const containerBulkCompaniesCompare = {
  my: '2',
  zIndex: '10',
};

export const tableBox = (isLargerThan1400: boolean) => {
  return {
    w: isLargerThan1400 ? '79vw' : '89vw',
    overflow: 'scroll',
  };
};

export const ThCompareTable = {
  zIndex: 'dropdown',
  bg: '#fff',
  position: 'sticky',
  top: '0',
  left: '0',
  border: '0.5px solid #D5D5D5',
  _hover: { bg: '#F6F6F6' },
  nowrap: 'nowrap',
  minW: '280px',
  maxw: '300px',
};

export const flexContainerCompanyName = {
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const menuBoxCheckbox = {
  ml: '-8px',
  _hover: { bg: 'gradient.iconbutton', borderRadius: '15px' },
  p: '0 8px',
};

export const menuBottomCheckbox = {
  size: 'sm',
  display: 'flex',
};

export const textMarkedCompanies = {
  ml: '-5px',
  fontSize: '13px',
  fontWeight: 600,
};

export const menuListCheckbox = {
  zIndex: 'overlay',
  borderRadius: 0,
  border: '1px solid #E4E4E4',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25);',
};

export const menuListItemCheckbox = {
  fontStyle: 'bold',
  fontWeight: 'bold',
  _hover: { color: 'white' },
};

export const companyNameText = {
  _hover: { textDecor: 'underline', cursor: 'pointer' },
  ml: '2px',
  mt: '9px',
};

export const upDownIconStyle = {
  ml: '5px',
  mt: '12px',
  fontSize: '8px',
};

export const tableActionHeader = {
  zIndex: 9,
  position: 'sticky',
  bg: '#fff',
  top: '0',
  border: '0.5px solid #D5D5D5',
  transition: 'all .1s ease',
  _hover: { transform: 'scale(0.99)', bg: '#F6F6F6' },
};

export const bodyActionHeader = {
  position: 'sticky',
  bg: '#fff',
  left: '0',
  border: '0.5px solid #D5D5D5',
  zIndex: 'docked',
  transition: 'all .1s ease',
  _hover: { transform: 'scale(0.99)', bg: '#F6F6F6' },
};

export const tdBorder = (headerName: string) => {
  return {
    minW: headerName === 'diverseOwnership' ? '200px' : '',
    maxW: '220px',
  };
};

/// metric dropdown styles

export const menuButtonMetricDropdown = (transpose: boolean) => {
  return {
    mt: transpose ? '0px' : '10px',
    bg: '#FFFFFF',
  };
};

export const menuListMetricDropdown = {
  overflow: 'scroll',
  maxHeight: '50vh',
};

// action header styles
export const flexContainerActionHeader = {
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const buttonActionHeader = {
  p: '0',
  fontSize: 'xs',
};

export const stackActionHeader = {
  alignItems: 'center',
  cursor: 'pointer',
};

export const tooltipTextHeader = {
  textOverflow: 'ellipsis',
  maxW: '250px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

export const popoverContentHeader = {
  maxH: '500px',
  overflowY: 'scroll',
  p: '0',
  width: '200px',
  borderRadius: '0',
  border: '1px solid #E4E4E4',
  borderColor: '#E4E4E4',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25) !important',
};

export const popoverIconHeader = {
  size: 'xs',
  _hover: { bg: 'gradient.iconbutton', borderRadius: '20' },
  bg: 'transparent',
};
