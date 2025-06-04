import { Box, CircularProgress, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { OwnershipBox, onershipemployeesDiverseText } from '../Styles';
import { ContentTrimmer } from '../../../GenericComponents';

export const CompananyOwnership = (props: {
  employeesDiverse: number | null;
  companyOwners: string[];
  ownershipDescription: string;
}) => {
  const { employeesDiverse, companyOwners, ownershipDescription } = props;
  const parseEmployeesDiverse = (value: number | null) => (value === null || value > 100 ? 100 : value);
  const { t } = useTranslation();

  return (
    <Stack margin="0 1rem 0 1rem" spacing={1} alignItems="flex-start" data-testid="companany-ownership">
      <Text as="h5" textStyle="h5">
        {t('Ownership')}
      </Text>
      {employeesDiverse ? (
        <Box style={OwnershipBox}>
          <CircularProgress value={parseEmployeesDiverse(employeesDiverse)} color="#d1d1d1" size={10} />
          <Text style={onershipemployeesDiverseText} data-testid={`ownership-employees-diverse-${employeesDiverse}`}>
            {`${parseEmployeesDiverse(employeesDiverse)} % Diverse `}
          </Text>
        </Box>
      ) : null}
      <Box w="300px" data-testid="companyOwners">
        {(companyOwners ?? []).map((diverseOwnership: string) => (
          <Box
            mb="5px"
            key={diverseOwnership}
            bg={'#F1F1F1'}
            display="inline-block"
            borderRadius="4px"
            p="0 8px"
            mr="5px"
          >
            <Text color={'#717171'} display="inline-block" fontSize="14" lineHeight="21px" id={diverseOwnership}>
              {diverseOwnership}
            </Text>
          </Box>
        ))}
      </Box>
      {ownershipDescription && (
        <Box style={OwnershipBox} data-testid="ownershipDescription">
          <ContentTrimmer width="290px" body={ownershipDescription} />
        </Box>
      )}
    </Stack>
  );
};
