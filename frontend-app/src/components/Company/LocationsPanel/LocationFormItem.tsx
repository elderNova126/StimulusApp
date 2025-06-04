import { useMutation } from '@apollo/client';
import * as R from 'ramda';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LocationMutations from '../../../graphql/Mutations/LocationMutations';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import { Location } from '../company.types';
import { EditCompanyRowAccordion, EditCompanyTextField } from '../shared';
const { UPDATE_LOCATION_GQL, CREATE_LOCATION_GQL } = LocationMutations;
const { COMPANY_DETAILS_GQL } = CompanyQueries;

const LocationFormItem = forwardRef(
  (props: { location?: Location; hideTopBorder: boolean; companyId: string }, ref) => {
    const { location, hideTopBorder, companyId } = props;
    const { t } = useTranslation();
    const [name, setName] = useState(location?.name ?? '');
    const [addressStreet, setAddressStreet] = useState(location?.addressStreet ?? '');
    const [addressStreet2, setAddressStreet2] = useState(location?.addressStreet2 ?? '');
    const [addressStreet3, setAddressStreet3] = useState(location?.addressStreet3 ?? '');
    const [city, setCity] = useState(location?.city ?? '');
    const [latitude, setLatitude] = useState(location?.latitude ?? '');
    const [longitude, setLongitude] = useState(location?.longitude ?? '');
    const [phone, setPhone] = useState(location?.phone ?? '');
    const [fax, setFax] = useState(location?.fax ?? '');
    const [postalCode, setPostalCode] = useState(location?.postalCode ?? '');
    const [country, setCountry] = useState(location?.country ?? '');
    const [state, setState] = useState(location?.state ?? '');
    const [updateLocation] = useMutation(UPDATE_LOCATION_GQL);

    const [createLocation] = useMutation(CREATE_LOCATION_GQL, {
      update: async (cache, data) => {
        const clonedList = (await R.clone(
          cache.readQuery({ query: COMPANY_DETAILS_GQL, variables: { id: companyId } })
        )) as any;

        const location = data.data.createLocation;

        if (clonedList.searchCompanyById.results[0].locations.results) {
          const companyUpdated = [...clonedList.searchCompanyById.results[0].locations.results, location];
          clonedList.searchCompanyById.results[0].locations.results = companyUpdated;

          cache.writeQuery({
            query: COMPANY_DETAILS_GQL,
            variables: { id: companyId },
            data: { ...clonedList },
          });
        } else {
          clonedList.searchCompanyById.results[0].locations.results = [location];

          cache.writeQuery({
            query: COMPANY_DETAILS_GQL,
            variables: { id: companyId },
            data: { ...clonedList },
          });
        }
      },
    });

    const save = () => {
      if (location?.id) {
        const updates = {
          ...(!!name && name !== location.name && { name }),
          ...(!!addressStreet && addressStreet !== location.addressStreet && { addressStreet }),
          ...(!!addressStreet2 && addressStreet2 !== location.addressStreet2 && { addressStreet2 }),
          ...(!!addressStreet3 && addressStreet3 !== location.addressStreet3 && { addressStreet3 }),
          ...(!!city && city !== location.city && { city }),
          ...(!!latitude && latitude !== location.latitude && { latitude }),
          ...(!!longitude && longitude !== location.longitude && { longitude }),
          ...(!!phone && phone !== location.phone && { phone }),
          ...(!!fax && fax !== location.fax && { fax }),
          ...(!!postalCode && postalCode !== location.postalCode && { postalCode }),
          ...(!!country && country !== location.country && { country }),
          ...(!!state && state !== location.state && { state }),
        };

        if (Object.keys(updates).length) {
          return updateLocation({ variables: { ...updates, id: location.id } });
        }
      } else {
        return createLocation({
          variables: {
            companyId,
            name,
            addressStreet,
            addressStreet2,
            addressStreet3,
            city,
            latitude,
            longitude,
            phone,
            fax,
            postalCode,
            country,
            state,
          },
        });
      }
    };

    useImperativeHandle(ref, () => ({
      save,
    }));

    return (
      <EditCompanyRowAccordion name={name ?? t('New Location')} {...(hideTopBorder && { borderTopWidth: '0' })}>
        <EditCompanyTextField
          type="text"
          label={t('Name')}
          locked={false}
          value={name}
          onChange={(val) => setName(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Address')}
          locked={false}
          value={addressStreet}
          onChange={(val) => setAddressStreet(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Address Line 2')}
          locked={false}
          value={addressStreet2}
          onChange={(val) => setAddressStreet2(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Address Line 3')}
          locked={false}
          value={addressStreet3}
          onChange={(val) => setAddressStreet3(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('City')}
          locked={false}
          value={city}
          onChange={(val) => setCity(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('State')}
          locked={false}
          value={state}
          onChange={(val) => setState(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Zip Code')}
          locked={false}
          value={postalCode}
          onChange={(val) => setPostalCode(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Country')}
          locked={false}
          value={country}
          onChange={(val) => setCountry(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Latitude')}
          locked={false}
          value={latitude}
          onChange={(val) => setLatitude(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Longitude')}
          locked={false}
          value={longitude}
          onChange={(val) => setLongitude(val as string)}
        />

        <EditCompanyTextField
          type="text"
          label={t('Phone')}
          locked={false}
          value={phone}
          onChange={(val) => setPhone(val as string)}
        />

        <EditCompanyTextField
          type="text"
          label={t('Fax')}
          locked={false}
          value={fax}
          onChange={(val) => setFax(val as string)}
        />
      </EditCompanyRowAccordion>
    );
  }
);

export default LocationFormItem;
