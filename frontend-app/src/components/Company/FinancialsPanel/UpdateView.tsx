import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  CompanyUpdateState,
  setNetProfit,
  setRevenue,
  setTotalAssets,
  setTotalLiabilities,
} from '../../../stores/features/company';
import { CompanyAccordion, EditCompanyRowAccordion, EditCompanyTextField } from '../shared';

const UpdateView: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const revenue = useSelector((state: { company: CompanyUpdateState }) => state.company.revenue);
  const netProfit = useSelector((state: { company: CompanyUpdateState }) => state.company.netProfit);
  const totalAssets = useSelector((state: { company: CompanyUpdateState }) => state.company.totalAssets);
  const totalLiabilities = useSelector((state: { company: CompanyUpdateState }) => state.company.totalLiabilities);

  return (
    <CompanyAccordion>
      <EditCompanyRowAccordion name={t('Revenue')} borderTopWidth="0">
        <EditCompanyTextField
          type="number"
          label={t('Amount (USD)')}
          locked={false}
          value={revenue as number}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setRevenue(val as number));
            } else {
              dispatch(setRevenue(0));
            }
          }}
        />
        {/* <EditCompanyTextField
          type="number"
          label={t('Growth')}
          locked={true}
          min={0}
          max={1}
          value={revenueGrowthCAGR as number}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setRevenueCAGR(val as number));
            } else {
              dispatch(setRevenueCAGR(0));
            }
          }}
        /> */}
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion name={t('Net Profit')}>
        <EditCompanyTextField
          type="number"
          label={t('Amount (USD)')}
          locked={false}
          value={netProfit as number}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setNetProfit(val as number));
            } else {
              dispatch(setNetProfit(0));
            }
          }}
        />
        {/* <EditCompanyTextField
          type="number"
          label={t('Growth')}
          locked={true}
          value={netProfitGrowthCAGR as number}
          min={0}
          max={1}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setNetProfitCAGR(val as number));
            } else {
              dispatch(setNetProfitCAGR(0));
            }
          }}
        /> */}
      </EditCompanyRowAccordion>

      <EditCompanyRowAccordion name={t('Assets')}>
        <EditCompanyTextField
          type="number"
          label={t('Amount (USD)')}
          locked={false}
          value={totalAssets as number}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setTotalAssets(val as number));
            } else {
              dispatch(setTotalAssets(0));
            }
          }}
        />
        {/* <EditCompanyTextField
          type="number"
          label={t('Growth')}
          locked={true}
          value={assetsRevenueRatio as number}
          max={1}
          min={0}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setAssetsRatio(val as number));
            } else {
              dispatch(setAssetsRatio(0));
            }
          }}
        /> */}
      </EditCompanyRowAccordion>

      <EditCompanyRowAccordion name={t('Liabilities')}>
        <EditCompanyTextField
          type="number"
          label={t('Amount (USD)')}
          locked={false}
          value={totalLiabilities as number}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setTotalLiabilities(val as number));
            } else {
              dispatch(setTotalLiabilities(0));
            }
          }}
        />
        {/* <EditCompanyTextField
          type="number"
          label={t('Growth')}
          locked={false}
          value={liabilitiesRevenueRatio as number}
          max={1}
          min={0}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setLiabilitiesRatio(val as number));
            } else {
              dispatch(setLiabilitiesRatio(0));
            }
          }}
        /> */}
      </EditCompanyRowAccordion>
    </CompanyAccordion>
  );
};

export default UpdateView;
