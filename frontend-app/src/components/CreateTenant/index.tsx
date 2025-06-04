import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './style';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import CreateCompany from '../CreateCompany/index';
import PickPlan from '../PickPlan/index';
import CreditCard from '../CreditCard/index';
import { RouteComponentProps, navigate } from '@reach/router';
import { useStimulusToast } from '../../hooks';
import { utcStringToLocalDate } from '../../utils/date';
import OtherMutations from '../../graphql/Mutations/OtherMutations';

const { CREATE_TENANT_GQL } = OtherMutations;

const CreateTenant = (props: RouteComponentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(1);
  const departmentHook = useState<string>('');
  const companyNameHook = useState<string>('');
  const einHook = useState<string>('');
  const dunsHook = useState<number>(0);
  const planHook = useState<string>('');
  const cardNameHook = useState<string>('');
  const cardNumberHook = useState<string>('');
  const cardExpirationDate = useState<any>(utcStringToLocalDate(moment().toString()));
  const cardPostalCode = useState<string>('');
  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);
  const { enqueueSnackbar } = useStimulusToast();

  const [saveData] = useMutation(CREATE_TENANT_GQL, {
    update: () => {
      const message = `${t('Company')} ${companyNameHook[0]} was created.`;

      enqueueSnackbar(message, { status: 'success' });
      navigate('/');
    },
  });

  let renderStep = null;
  const saveDetails = () => {
    saveData({
      variables: {
        companyName: companyNameHook[0],
        stimulusPlan: planHook[0],
        postalCode: cardPostalCode[0],
        nameOnCard: cardNameHook[0],
        cardNumber: cardNumberHook[0].split(' ').join(''),
        cardExpirationDate: cardExpirationDate[0],
        duns: `${dunsHook[0]}`,
        departmentName: departmentHook[0],
        ein: `${einHook[0]}`,
      },
    });
  };

  switch (step) {
    case 1:
      renderStep = (
        <CreateCompany
          companyNameHook={companyNameHook}
          departmentHook={departmentHook}
          einHook={einHook}
          dunsHook={dunsHook}
          next={next}
        />
      );
      break;
    case 2:
      renderStep = <PickPlan next={next} prev={prev} planHook={planHook} />;
      break;
    case 3:
      renderStep = (
        <CreditCard
          next={saveDetails}
          prev={prev}
          cardNameHook={cardNameHook}
          cardNumberHook={cardNumberHook}
          cardExpirationDate={cardExpirationDate}
          cardPostalCode={cardPostalCode}
        />
      );
      break;
    default:
      renderStep = (
        <CreateCompany
          companyNameHook={companyNameHook}
          departmentHook={departmentHook}
          einHook={einHook}
          dunsHook={dunsHook}
          next={next}
        />
      );
      break;
  }

  return <div className={classes.root}>{renderStep}</div>;
};

export default CreateTenant;
