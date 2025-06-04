import { FC, createContext } from 'react';
import { useForm, UseFormMethods } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import companyValidationSchema from './FormValidations';

interface FormContextProps {
  formMethods: UseFormMethods;
}

const FormCompanyContext = createContext<FormContextProps | null>(null);

const FormCompanyProvider: FC = ({ children }) => {
  const formMethods = useForm({
    resolver: yupResolver(companyValidationSchema as any),
    reValidateMode: 'onBlur',
  });

  return <FormCompanyContext.Provider value={{ formMethods }}>{children}</FormCompanyContext.Provider>;
};

export { FormCompanyProvider, FormCompanyContext };
