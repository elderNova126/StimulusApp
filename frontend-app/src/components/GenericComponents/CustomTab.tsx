import { Tab, TabProps } from '@chakra-ui/react';
import { FC } from 'react';
import { useSelector } from 'react-redux';
const CustomTab: FC<TabProps> = (props) => {
  const { children, ...tabProps } = props;
  const filterOpen = useSelector((state: { generalData: any }) => state.generalData.openModal.filter);

  return (
    <Tab
      sx={{
        '@media only screen and (max-width: 1336px)': {
          w: '20%',
          marginRight: '20px',
        },
      }}
      opacity={filterOpen ? '.4' : '.6'}
      _hover={{
        color: 'primary',
        borderColor: 'primary',
        opacity: '.8',
      }}
      _selected={{
        color: 'green.600',
        borderColor: 'green.600',
        opacity: filterOpen ? '.4' : '1',
      }}
      borderBottom="4px solid"
      {...tabProps}
    >
      {children}
    </Tab>
  );
};

export default CustomTab;
