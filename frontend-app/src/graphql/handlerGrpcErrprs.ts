import { GraphQLErrors } from '@apollo/client/errors';
import { useTranslation } from 'react-i18next';
import { throttle } from 'throttle-debounce';
import { useStimulusToast } from '../hooks';
import { GrpcStatus } from './GrpcStatus.enum';

const HandleGrpcHook = () => {
  const { enqueueSnackbar } = useStimulusToast();
  const { t } = useTranslation();

  const handleGrpcErrors = (err: GraphQLErrors | undefined) => {
    if (!err) return;
    if (err.length > 0) {
      if (err[0]?.extensions?.code in GrpcStatus) {
        throttleSnackbarMessage(err[0].extensions?.details);
      }
    }
  };

  const throttleSnackbarMessage = (message: string) => {
    const throttleSnackbar = throttle(
      1000,
      () => {
        enqueueSnackbar(t(`${message}`), { status: 'error' });
      },
      { noLeading: false, noTrailing: true }
    );

    throttleSnackbar();
  };

  return [handleGrpcErrors];
};

export default HandleGrpcHook;
