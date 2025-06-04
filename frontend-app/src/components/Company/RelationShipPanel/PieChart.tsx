import { PieChart, Pie } from 'recharts';
import { Box, Text } from '@chakra-ui/react';
import { ProjectCompanyType } from '../company.types';
import { useMouldDataForPieChart } from './Hooks';
import { useState } from 'react';

// Do a pie chart to show the status of the projects

export const PieChartRelationship = ({ dataChart }: { dataChart?: ProjectCompanyType; label?: boolean }) => {
  const { COLORS, data, maxType, relationShipsToShow } = useMouldDataForPieChart(dataChart);
  const [currentCell, setCurrentCell] = useState(maxType);
  const handleSelectCell = (fill: string, name: string, value: number, opacity: any) => {
    setCurrentCell({ fill, name, value, opacity });
  };

  if (COLORS.length === 0) return null;
  return (
    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} w={'100%'}>
      <StatusesAndCounters
        opacity={Number(currentCell?.opacity ?? 0)}
        bg={currentCell?.fill}
        status={currentCell?.name}
        count={currentCell?.value}
      />
      <PieChart width={90} height={90}>
        <Pie
          data={data}
          cx={40}
          cy={40}
          labelLine={false}
          label={false}
          outerRadius={35}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          strokeWidth={relationShipsToShow.length > 1 ? 2.5 : 0}
          onMouseEnter={(e: any) => handleSelectCell(e.fill, e.name, e.value, e.opacity)}
          onMouseLeave={() => handleSelectCell(maxType.fill, maxType.name, maxType.value, maxType.opacity)}
        />
      </PieChart>
    </Box>
  );
};

const StatusesAndCounters = ({
  status,
  count,
  bg,
  opacity,
}: {
  status?: string;
  count?: number;
  bg?: string;
  opacity: number;
}) => {
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        <Box w={'10px'} h={'10px'} {...(opacity && { opacity })} bg={bg ? bg : '#eb4869'} mr={'5px'} />
        <Text as="h2" textStyle="h2" w={'66px'}>
          {count ? count : '0'}
        </Text>
      </Box>
      <Text as="h5" textStyle="h5" w={'auto'}>
        {status ? status : '...'}
      </Text>
    </Box>
  );
};
