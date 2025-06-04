import { useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  HStack,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import Plot from 'react-plotly.js';
import { dummyInsights } from './DummyAiGrantData';
import Beta from '../Common/Beta';
import { Data, DataFrame, ChartData } from './aiSuggestion.types';
import { useDashboard3DMapContext } from '../../context/DashboardAIMap';

export const InsightsModel = (props: { companyName: string; suggestion: string }) => {
  const { companyName, suggestion } = props;
  const { isOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Text fontSize="14px" lineHeight="25px">
        <Text
          as="span"
          bg="#F1F1F1"
          color="#2A2A28"
          lineHeight="20px"
          borderRadius="4px"
          p="3px 8px"
          fontFamily="poppins"
          mr="2px"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          maxWidth="calc(5ch + 8px)"
          cursor="pointer" // Added cursor to indicate clickable element
        >
          {companyName.length > 15 ? `${companyName.substring(0, 15)}...` : companyName}
        </Text>
        {suggestion}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
        <ModalContent border="1px solid #E4E4E4" rounded="4px" boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)">
          <ModalHeader>Insights</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="14px" fontWeight="800">
              {companyName}
            </Text>
            <UnorderedList mt="6px">
              <ListItem fontSize="13px" p="2px">
                {suggestion}
              </ListItem>
            </UnorderedList>
          </ModalBody>
          <ModalFooter>
            <HStack spacing="auto" w="100%">
              <Button colorScheme="green" size="sm" onClick={onClose} disabled>
                Add To Profile
              </Button>
              <Button colorScheme="green" size="sm" onClick={onClose} disabled>
                Next Steps Suggestions
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export const ScatterPlot3D = ({ companyId }: { companyId: string }) => {
  const { companies, loading, fetchCompanies } = useDashboard3DMapContext();
  useEffect(() => {
    if (!companies.length) {
      fetchCompanies(companyId);
    }
  }, [companyId]);

  const companyMap = useMemo(() => {
    return new Map(companies.map((company) => [company.company_id, company.legal_business_name]));
  }, [companies]);
  const chartData = useMemo(() => {
    const data: ChartData = {
      companiesName: [],
      column1: [],
      column2: [],
      column3: [],
    };

    if (companies.length > 0) {
      for (const company of companies) {
        if (Array.isArray(company.vectors) && company?.vectors?.length >= 3) {
          const [column1, column2, column3] = company.vectors;
          data.companiesName.push(company.legal_business_name || '');
          data.column1.push(column1);
          data.column2.push(column2);
          data.column3.push(column3);
        }
      }
    }

    return data;
  }, [companies, companyMap]);
  // Define the trace for the 3D scatter plot
  const data: Data = useMemo(() => {
    return {
      Company: chartData.companiesName,
      xAxis: chartData.column1,
      yAxis: chartData.column2,
      zAxis: chartData.column3,
    };
  }, [chartData]);
  const [min, max] = useMemo(() => {
    const zAxis = data.zAxis;
    return [Math.min(...zAxis), Math.max(...zAxis)];
  }, [data.zAxis]);
  const df: DataFrame = useMemo(() => {
    return {
      ...data,
      colorValue: data.zAxis.map((r) => (max !== min ? (r - min) / (max - min) : 0)),
    };
  }, [data, min, max]);

  const truncatedText = useMemo(() => {
    return df.Company.map((company) => (company.length > 10 ? `${company.substring(0, 10)}...` : company));
  }, [df.Company]);
  const trace: Partial<Plotly.ScatterData> & { z: number[]; type: 'scatter3d' } = {
    x: df.xAxis,
    y: df.yAxis,
    z: df.zAxis,
    mode: 'text+markers',
    text: truncatedText, // Truncated text shown on the scatter plot
    textposition: 'top center',
    hovertext: df.Company, // Full company name shown on hover for each marker
    hovertemplate: `
      <b>%{hovertext}</b><br> 
      <extra></extra>
    `,
    marker: {
      size: 8,
      color: df.colorValue,
      colorscale: 'YlGnBu',
      opacity: 0.8,
    },
    type: 'scatter3d',
  };
  const layout: Partial<Plotly.Layout> = {
    scene: {
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 }, // Camera position
        center: { x: 0, y: 0, z: 0 }, // Camera look-at point
        up: { x: 0, y: 0, z: 1 }, // Camera up direction
      },
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
    },
    width: 600, // Adjust the width of the chart
    height: 460, // Adjust the height of the chart
    hoverlabel: {
      align: 'left', // Align hover label text to the left
      namelength: -1, // Show the full text without truncation
    },
  };

  return (
    <Box h="500px" border="1px solid #E4E4E4" rounded="4px" p="15px" w="654px">
      <Stack isInline>
        <Box>
          <Text ml="6px" fontSize="16px" fontWeight="600">
            Supplier Intelligence Map
          </Text>
        </Box>
        <Beta />
      </Stack>
      {loading ? (
        <Box h="100%" textAlign="center" display="flex" alignItems="center" justifyContent="center" w="full">
          <Spinner my="150px" thickness="4px" speed="0.65s" emptyColor="gray.300" color="green.400" size="xl" />
        </Box>
      ) : companies?.length > 0 ? (
        <Plot data={[trace]} layout={layout} config={{ displayModeBar: true }} className="vertical-modebar" />
      ) : (
        <Box h="100%" textAlign="center" display="flex" alignItems="center" justifyContent="center">
          <Text>There is no information available</Text>
        </Box>
      )}
    </Box>
  );
};

const AiSuggestion = () => {
  return (
    <Box h="500px" border="1px solid #E4E4E4" rounded="4px" overflowY="scroll" p="15px" w="400px">
      <Stack isInline>
        <Box>
          <Text cursor="pointer" ml="6px" fontSize="16px" fontWeight="600">
            Insights
          </Text>
        </Box>
        <Beta />
      </Stack>
      <Stack isInline>
        <Box fontSize="16px" pt="18px" px="10px">
          <UnorderedList>
            {dummyInsights.map(
              (insight) =>
                insight.companyName && (
                  <ListItem key={insight.companyName} my="14px">
                    <InsightsModel companyName={insight.companyName} suggestion={insight.suggestion} />
                  </ListItem>
                )
            )}
          </UnorderedList>
        </Box>
      </Stack>
    </Box>
  );
};
export default AiSuggestion;
