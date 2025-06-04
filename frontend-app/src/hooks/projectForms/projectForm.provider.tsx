import { FC, createContext } from 'react';
import { useForm, UseFormMethods } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import projectValidationSchema from './projectFromValidations';

interface FormContextProps {
  formMethods: UseFormMethods;
}

const FormProjectContext = createContext<FormContextProps | null>(null);

const FormProjectProvider: FC = ({ children }) => {
  const formMethods = useForm({
    resolver: yupResolver(projectValidationSchema as any),
    reValidateMode: 'onBlur',
  });

  return <FormProjectContext.Provider value={{ formMethods }}>{children}</FormProjectContext.Provider>;
};

export { FormProjectProvider, FormProjectContext };
