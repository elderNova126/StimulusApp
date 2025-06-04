import { useTranslation } from 'react-i18next';
import { CompanyAccordion, EditCompanyRowAccordion } from '../shared';

const UpdateView = () => {
  const { t } = useTranslation();

  return (
    <CompanyAccordion data-testid="score-panel-update" id="score-panel-update-mode">
      <EditCompanyRowAccordion isDisabled locked={true} name={t('Stimulus Score')} borderTopWidth="0px" />
    </CompanyAccordion>
  );
};

export default UpdateView;
