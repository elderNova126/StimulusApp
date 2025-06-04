import { ArrowUpIcon } from '@chakra-ui/icons';
import { Flex, Stack } from '@chakra-ui/layout';
import { useTranslation } from 'react-i18next';
import { getColorByPercentage, localeUSDFormat } from '../../../utils/number';
import { Company } from '../company.types';
import ItemPanel from './ItemPanel';
import SubItemPanel from './SubItemPanel';

const DisplayView = (props: { company: Company }) => {
  const { company } = props;
  const { t } = useTranslation();

  return (
    <Flex justifyContent="space-between" w="80%">
      <Stack>
        <ItemPanel name={t('Revenue')} value={localeUSDFormat(company.revenue ? company.revenue : 0) + ' USD'} />
        <SubItemPanel
          icon={<ArrowUpIcon fontSize="8px" verticalAlign="text-top" />}
          label={t('CAGR')}
          value={company.revenueGrowthCAGR ? `${company.revenueGrowthCAGR}%` : '-'}
          color={getColorByPercentage(company.revenueGrowthCAGR)}
        />
      </Stack>
      <Stack>
        <ItemPanel name={t('Net Profit')} value={localeUSDFormat(company.netProfit ? company.netProfit : 0) + ' USD'} />
        <SubItemPanel
          icon={<ArrowUpIcon fontSize="8px" verticalAlign="text-top" />}
          label={t('CAGR')}
          value={company.netProfitGrowthCAGR ? `${company.netProfitGrowthCAGR}%` : '-'}
          color={getColorByPercentage(company.netProfitGrowthCAGR)}
        />
      </Stack>
      <Stack>
        <ItemPanel name={t('Assets')} value={localeUSDFormat(company.totalAssets ? company.totalAssets : 0) + ' USD'} />
        <SubItemPanel
          icon={<ArrowUpIcon fontSize="8px" verticalAlign="text-top" />}
          label={t('CAGR')}
          value={company.assetsRevenueRatio ? `${company.assetsRevenueRatio}%` : '-'}
          color={getColorByPercentage(company.assetsRevenueRatio)}
        />
      </Stack>
      <Stack>
        <ItemPanel
          name={t('Liabilities')}
          value={localeUSDFormat(company.totalLiabilities ? company.totalLiabilities : 0) + ' USD'}
        />
        <SubItemPanel
          icon={<ArrowUpIcon fontSize="8px" verticalAlign="text-top" />}
          label={t('CAGR')}
          value={company.liabilitiesRevenueRatio ? `${company.liabilitiesRevenueRatio}%` : '-'}
          color={getColorByPercentage(company.liabilitiesRevenueRatio)}
        />
      </Stack>
    </Flex>
  );
};

export default DisplayView;
