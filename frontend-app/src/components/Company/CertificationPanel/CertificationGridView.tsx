import { Grid, GridItem, Text } from '@chakra-ui/layout';
import { useTranslation } from 'react-i18next';
import { Certification } from '../company.types';
import { getExpirationInfo } from '../../../utils/companies/expirationInfo';

const CertificationGridView = (props: {
  certifications: Certification[];
  setCertificate: (data: boolean) => void;
  setIndex: (index: number) => void;
}) => {
  const { certifications, setIndex, setCertificate } = props;
  const { t } = useTranslation();

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      {certifications?.map((certification, index) => (
        <GridItem w="100%" key={certification.id}>
          <Text textStyle="h4" fontSize="12px" mb="8px">
            {certification.name}
          </Text>
          <Text textStyle="h4" fontSize="12px" fontWeight="normal">
            {certification.type ?? ''}
          </Text>
          <Text textStyle="h4" fontSize="12px" fontWeight="normal">
            {!!certification?.certificationDate || !!certification?.expirationDate
              ? `${certification?.certificationDate ?? 'N/A'} - ${certification?.expirationDate ?? 'N/A'}`
              : ''}
          </Text>
          {!!certification.remainingDays && (
            <Text textStyle="small" color="red" fontSize="11px">
              {certification.remainingDays ? getExpirationInfo(certification.remainingDays) : ''}
            </Text>
          )}
          <Text
            textStyle="textLink"
            fontSize="11px"
            cursor="pointer"
            onClick={() => {
              setCertificate(true);
              return setIndex(index);
            }}
          >
            {t('Show More')}
          </Text>
        </GridItem>
      ))}
    </Grid>
  );
};

export default CertificationGridView;
