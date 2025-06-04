import { Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ContentTrimmer } from '../../../GenericComponents';
import { CompanyName, nameTypes } from '../../company.types';
import { removeDuplicatesInArrayOfString as removeDuplicates } from '../../../../utils/string';
interface CompanyBussinesNamesProps {
  company: {
    legalBusinessName: string;
    doingBusinessAs: string;
    names: CompanyName[];
  };
}

export const CompanyBusinessNames = ({ company }: CompanyBussinesNamesProps) => {
  const { doingBusinessAs, legalBusinessName, names } = company;
  const { t } = useTranslation();

  const otherNames = removeDuplicates(
    (names?.filter((name) => name.type === nameTypes.OTHER)?.map((name) => name?.name) as string[]) || ([] as string[])
  );
  const previousNames = removeDuplicates(
    (names?.filter((name) => name.type === nameTypes.PREVIOUS)?.map((name) => name?.name) as string[]) ||
      ([] as string[])
  );
  return (
    <Stack alignItems="flex-start" mt="1rem">
      <Stack spacing={0}>
        <Text as="h5" fontSize="13px" textStyle="h5" id="Business-Name">
          {t('Business Name(s)')}
        </Text>
      </Stack>
      {legalBusinessName && (
        <Stack spacing={-0.5}>
          <Text as="h5" textStyle="h5" id="Business-Name-LEGAL" data-testid="Business-Name-LEGAL">
            {t('LEGAL')}
          </Text>
          <ContentTrimmer body={legalBusinessName} />
        </Stack>
      )}
      {doingBusinessAs && (
        <Stack spacing={-0.5}>
          <Text as="h5" textStyle="h5" id="Business-Name-DBA" data-testid="Business-Name-DBA">
            {t('DOING BUSINESS AS')}
          </Text>
          <ContentTrimmer body={doingBusinessAs} />
        </Stack>
      )}
      {otherNames?.length > 0 && otherNames?.[0] && (
        <Stack spacing={-0.5}>
          <Text as="h5" textStyle="h5" id={`Business-Name-OTHER`} data-testid="Business-Name-OTHER">
            {t('OTHER')}
          </Text>
          {otherNames.map((name) => (
            <ContentTrimmer key={name} body={name as never} />
          ))}
        </Stack>
      )}
      {previousNames?.length > 0 && previousNames?.[0] && (
        <Stack spacing={-0.5}>
          <Text as="h5" textStyle="h5" id="Business-Name-PREVIOUS" data-testid="Business-Name-PREVIOUS">
            {t('PREVIOUS')}
          </Text>
          {previousNames.map((name) => (
            <ContentTrimmer key={name} body={name as never} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
