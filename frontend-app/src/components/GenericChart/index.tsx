import { CircularProgress } from '@chakra-ui/progress';
import { Center } from '@chakra-ui/react';
import { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface GenericChartProps {
  width?: number;
  height?: number;
  profile?: boolean;
  query?: any;
  companyId?: number | string | null;
}
interface CharData {
  name: string;
  data: any[];
}
const dataSkeleton: CharData = {
  name: 'name',
  data: [
    {
      name: '1999-01-01',
      Total: 4000,
    },
    {
      name: '1999-01-02',
      Total: 3000,
    },
    {
      name: '1999-01-03',
      Total: 5000,
    },
  ],
};

const strokeGenerator = function* () {
  const colors = ['#BD10E0', '#9AB3C7', '#DB4C5D', '#11B2BC'];
  let i = 0;

  while (true) {
    yield colors[i];
    if (i < colors.length) {
      i++;
    } else {
      i = 0;
    }
  }
};

const GenericChart = (props: GenericChartProps) => {
  const { width, height, profile } = props;
  const [dataChart] = useState(dataSkeleton);
  const [stroke] = useState(strokeGenerator());
  const [loadingChart] = useState(false);

  const { ...dataKeys } = dataChart.data[0];

  const renderLines = Object.keys(dataKeys).map((key: string) =>
    key !== dataChart.name ? <Line key={key} type="monotone" dataKey={key} stroke={stroke.next().value} /> : null
  );
  return (
    <div data-testid="linechart">
      {loadingChart ? (
        <Center>
          <CircularProgress isIndeterminate color="green.300" />
        </Center>
      ) : (
        <ResponsiveContainer width={width || profile ? '100%' : 600} height={height || 500}>
          <LineChart
            width={width || 600}
            height={height || 500}
            data={dataChart.data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis orientation="right" />
            <Tooltip cursor={{ stroke: '#000', strokeWidth: 0.3 }} />
            <Legend chartHeight={500} chartWidth={600} />
            {renderLines}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GenericChart;
