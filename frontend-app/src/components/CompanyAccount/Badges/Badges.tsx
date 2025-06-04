import { Stack, Text, Flex, Box } from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import { useState } from 'react';
import BadgeTable from './BadgeTable';
import { CompanyProfileDivider } from '../../Company/shared';
import BadgeForm from './BadgeForm';
import { Badge } from './badge.types';
import { FormCompanyProvider } from '../../../hooks/companyForms/companyForm.provider';
import { useTranslation } from 'react-i18next';
import { addBadgeButton, badgeMainTitles } from './styles';
import { useBadgeQuery } from './badgesHooks';
import LoadingScreen from '../../LoadingScreen';

const Badges = (props: RouteComponentProps) => {
  const [form, setForm] = useState(false);
  const [badge, setBadge] = useState<Badge | boolean>(false);
  const { t } = useTranslation();

  const { data, loading } = useBadgeQuery(form, badge);

  return (
    <>
      {form || badge ? (
        <FormCompanyProvider>
          <BadgeForm setBadge={setBadge} setForm={setForm} badge={badge as any} />
        </FormCompanyProvider>
      ) : (
        <Stack id="badge-page" data-testid="badge-page">
          <Text sx={badgeMainTitles}>{t('Badges')}</Text>
          <Flex justify="flex-end" pr="2rem">
            <Box display="flex" cursor="pointer" onClick={() => setForm(true)}>
              <Text mx="5px" lineHeight="22px" fontSize="13px" fontWeight="500">
                +
              </Text>
              <Text sx={addBadgeButton}>{t('Add Badge')}</Text>
            </Box>
          </Flex>
          <CompanyProfileDivider mb="-10px !important" />
          {loading ? <LoadingScreen /> : <BadgeTable badges={data?.badges?.results ?? []} setBadge={setBadge} />}
        </Stack>
      )}
    </>
  );
};

export default Badges;
