import MessageComponent from '../components/GenericComponents/MessageComponent';
import { GeoFilters, setLocation, setLocationFilter, setCurrentLocationIsCheck } from '../stores/features';
import { setErrorMap } from '../stores/features/generalData';
export const getGeolocation = ({
  setFetchData,
  closeToast,
  isChecked,
  toast,
  toastIdRef,
  dispatch,
  t,
}: {
  setFetchData: (fetchData: boolean) => void;
  isChecked: boolean;
  toast: any;
  toastIdRef: any;
  closeToast: () => void;
  dispatch: any;
  t: any;
}) => {
  if (isChecked) {
    dispatch(setLocationFilter({}));
    dispatch(setCurrentLocationIsCheck(!isChecked));
    return null;
  }
  dispatch(setLocation(''));
  dispatch(setErrorMap(false));
  if (navigator.geolocation) {
    if (!isChecked) setFetchData(true);
    dispatch(setLocationFilter({ radius: !isChecked ? 10 : 0 }));
    closeToast();
    dispatch(setCurrentLocationIsCheck(!isChecked));
  } else {
    const stringForMessage = t(`We can't get your location. Please, check your browser settings and try again.`);
    const message = <span>{stringForMessage}</span>;
    toastIdRef.current = toast({
      render: () => <MessageComponent bg={'#e53e3e'} color="white" message={message} close={closeToast} />,
    });
  }
};

export const showErrorMessage = ({
  closeToast,
  dispatch,
  toast,
  toastIdRef,
  t,
  message,
}: {
  closeToast: () => void;
  dispatch: (e: any) => void;
  toast: (e: any) => void;
  toastIdRef: any;
  t: any;
  message: string;
}): void => {
  dispatch(setLocation(''));
  dispatch(setErrorMap(true));
  const stringForMessage = t(message);
  const HTMLmessage = <span>{stringForMessage}</span>;
  toastIdRef.current = toast({
    render: () => <MessageComponent bg={'#e53e3e'} color="white" message={HTMLmessage} close={closeToast} />,
  });
};

export const handleGoogleAutoComplete = ({
  closeToast,
  setIsInvalid,
  dispatch,
  inputRef,
  localFilters,
}: {
  closeToast: () => void;
  setIsInvalid: (isInvalid: boolean) => void;
  dispatch: (e: any) => void;
  inputRef: any;
  localFilters: GeoFilters;
}) => {
  const place = inputRef.current.getPlace();
  dispatch(setErrorMap(false));
  if (place) {
    dispatch(setLocation(place.formatted_address));
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const hasAddress = place.address_components?.find((ac: any) => ac.types.includes('route'))?.long_name;
    const newFilters = {
      ...localFilters,
      latitude: lat,
      longitude: lng,
      city: place.address_components?.find((ac: any) => ac.types.includes('locality'))?.long_name,
      state: place.address_components?.find((ac: any) => ac.types.includes('administrative_area_level_1'))?.short_name,
      country: place.address_components?.find((ac: any) => ac.types.includes('country'))?.short_name,
      postalCode: place.address_components?.find((ac: any) => ac.types.includes('postal_code'))?.long_name,
      addressStreet: place.address_components?.find((ac: any) => ac.types.includes('route'))?.long_name,
      radius: hasAddress ? 10 : 0,
    };
    dispatch(setLocationFilter(newFilters));
    closeToast();
    setIsInvalid(false);
    return { ...newFilters, hasAddress: hasAddress ? true : false };
  }
  return { ...localFilters, hasAddress: false };
};
