import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  CompanyUpdateState,
  setCustomers,
  setFacebookFollowers,
  setLinkedInFollowers,
  setNetPromoterScore,
  setTwitterFollowers,
} from '../../../stores/features/company';
import { CompanyAccordion, EditCompanyRowAccordion, EditCompanyTextField } from '../shared';

const UpdateView: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customers = useSelector((state: { company: CompanyUpdateState }) => state.company.customers);
  const linkedInFollowers = useSelector((state: { company: CompanyUpdateState }) => state.company.linkedInFollowers);
  const facebookFollowers = useSelector((state: { company: CompanyUpdateState }) => state.company.facebookFollowers);
  const twitterFollowers = useSelector((state: { company: CompanyUpdateState }) => state.company.twitterFollowers);
  const netPromoterScore = useSelector((state: { company: CompanyUpdateState }) => state.company.netPromoterScore);
  return (
    <CompanyAccordion>
      <EditCompanyRowAccordion name={t('Customers')} borderTopWidth="0">
        <EditCompanyTextField
          type="number"
          label={t('Customers Total')}
          locked={false}
          value={customers ?? 0}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setCustomers(val as number));
            } else {
              dispatch(setCustomers(0));
            }
          }}
        />
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion name={t('Net Promoter Score')}>
        <EditCompanyTextField
          type="number"
          label={t('Score')}
          locked={false}
          value={netPromoterScore ?? 0}
          min={0}
          max={100}
          step={1}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setNetPromoterScore(val as number));
            } else {
              dispatch(setNetPromoterScore(0));
            }
          }}
        />
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion name={t('Linkedin')}>
        <EditCompanyTextField
          type="number"
          label={t('Followers')}
          locked={false}
          value={linkedInFollowers}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setLinkedInFollowers(val as number));
            } else {
              dispatch(setLinkedInFollowers(0));
            }
          }}
        />
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion name={t('Twitter')}>
        <EditCompanyTextField
          type="number"
          label={t('Followers')}
          locked={false}
          value={twitterFollowers}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setTwitterFollowers(val as number));
            } else {
              dispatch(setTwitterFollowers(0));
            }
          }}
        />
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion name={t('Facebook')}>
        <EditCompanyTextField
          type="number"
          label={t('Followers')}
          locked={false}
          value={facebookFollowers}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setFacebookFollowers(val as number));
            } else {
              dispatch(setFacebookFollowers(0));
            }
          }}
        />
      </EditCompanyRowAccordion>
    </CompanyAccordion>
  );
};

export default UpdateView;
