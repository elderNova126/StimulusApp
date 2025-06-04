import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  CompanyUpdateState,
  setBoardDiverse,
  setBoardTotal,
  setEmployeesDiverse,
  setEmployeesTotal,
  setLeadershipTeamTotal,
} from '../../../stores/features/company';
import { CompanyAccordion, EditCompanyRowAccordion, EditCompanyTextField } from '../shared';

const UpdateView: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const employeesTotal = useSelector((state: { company: CompanyUpdateState }) => state.company.employeesTotal);
  const employeesDiverse = useSelector((state: { company: CompanyUpdateState }) => state.company.employeesDiverse);
  const leadershipTeamTotal = useSelector(
    (state: { company: CompanyUpdateState }) => state.company.leadershipTeamTotal
  );
  const boardTotal = useSelector((state: { company: CompanyUpdateState }) => state.company.boardTotal);
  const boardDiverse = useSelector((state: { company: CompanyUpdateState }) => state.company.boardDiverse);

  return (
    <CompanyAccordion>
      <EditCompanyRowAccordion name={t('Employees')} borderTopWidth="0">
        <EditCompanyTextField
          type="number"
          label={t('Employees Total')}
          locked={false}
          value={employeesTotal as number}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setEmployeesTotal(val as number));
            } else {
              dispatch(setEmployeesTotal(0));
            }
          }}
        />
        <EditCompanyTextField
          type="number"
          label={t('Employees Diverse')}
          locked={false}
          value={employeesDiverse as number}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setEmployeesDiverse(val as number));
            } else {
              dispatch(setEmployeesDiverse(0));
            }
          }}
        />
      </EditCompanyRowAccordion>

      <EditCompanyRowAccordion name={t('Leadership')}>
        <EditCompanyTextField
          type="number"
          label={t('Leadership Team Total')}
          locked={false}
          value={leadershipTeamTotal as number}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setLeadershipTeamTotal(val as number));
            } else {
              dispatch(setLeadershipTeamTotal(0));
            }
          }}
        />
      </EditCompanyRowAccordion>

      <EditCompanyRowAccordion name={t('Board')}>
        <EditCompanyTextField
          type="number"
          label={t('Board Total')}
          locked={false}
          value={boardTotal as number}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setBoardTotal(val as number));
            } else {
              dispatch(setBoardTotal(0));
            }
          }}
        />
        <EditCompanyTextField
          type="number"
          label={t('Board Diverse')}
          locked={false}
          value={boardDiverse as number}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              dispatch(setBoardDiverse(val as number));
            } else {
              dispatch(setBoardDiverse(0));
            }
          }}
        />
      </EditCompanyRowAccordion>
    </CompanyAccordion>
  );
};

export default UpdateView;
