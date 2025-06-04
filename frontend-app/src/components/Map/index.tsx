import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import { useState, useCallback, useRef, useEffect } from 'react';
import mapStyles from './mapstyle';
import config from '../../config/environment.config';
import { Divider, Flex, Text } from '@chakra-ui/layout';
import CompanyAddActionPanel from '../CompanyAddActionPanel';
import { getCompanyName } from '../../utils/dataMapper';
import { useSelector } from 'react-redux';

const { googleMapsApiKey } = config;
const mapContainerStyle = {
  height: '70vh',
  width: '100%',
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places'];
const Map = (props: { companies: any[] }) => {
  const { companies } = props;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  const [markers, setMarkers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [center, setCenter] = useState<any>({ lat: 40.7128, lng: -74.006 });

  const actualLocation: any = useSelector<any>((selector) => selector.discovery.mapLocation);
  useEffect(() => {
    if (mapRef.current && actualLocation.id) {
      const position = { lat: Number(actualLocation.latitude), lng: Number(actualLocation.longitude) };
      mapRef.current?.panTo(position);
    }
  }, [actualLocation]);

  useEffect(() => {
    setMarkers(
      companies
        .filter((company) => company.locationsByIndex)
        .flatMap((company) =>
          company.locationsByIndex
            .filter(({ latitude, longitude }: any) => typeof latitude === 'string' && typeof longitude === 'string')
            .map(
              ({
                latitude,
                longitude,
                addressStreet,
                addressStreet2,
                addressStreet3,
              }: {
                latitude: string;
                longitude: string;
                addressStreet: string;
                addressStreet2: string;
                addressStreet3: string;
              }) => ({
                lat: parseFloat(latitude),
                lng: parseFloat(longitude),
                time: new Date(),
                location: `${addressStreet || ''} ${addressStreet2 || ''} ${addressStreet3 || ''}`,
                company,
              })
            )
        )
    );
  }, [companies]);

  useEffect(() => {
    if (markers.length > 0) {
      const newCenter = markers.find(({ lat, lng }: any) => lat && lng);
      if (newCenter) {
        setCenter(newCenter);
      }
    }
  }, [markers]);

  const mapRef = useRef<any>(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) {
    return <>Error</>;
  }
  if (!isLoaded) {
    return <>Loading...</>;
  }

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center} options={options} onLoad={onMapLoad}>
      {markers.map((marker: any, index: any) => (
        <Marker
          key={`${marker.lat}-${marker.lng}-${index}`}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => {
            setSelected(marker);
          }}
          icon={{
            url: `/icons/location.svg`,
            scaledSize: new (window as any).google.maps.Size(30, 30),
          }}
        />
      ))}

      {selected ? (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => {
            setSelected(null);
          }}
        >
          <Flex direction="column" maxW="240px">
            <Text as="h4" textStyle="h4" p="0px">
              {getCompanyName(selected.company)}
            </Text>
            <Text as="h4" textStyle="h4" p="0px 15px" fontWeight={400}>
              {selected.location}
            </Text>
            <Divider />
            <CompanyAddActionPanel company={selected.company} />
          </Flex>
        </InfoWindow>
      ) : null}
    </GoogleMap>
  );
};
export default Map;
