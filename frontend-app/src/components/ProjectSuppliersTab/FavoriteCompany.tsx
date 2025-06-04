import { useMutation } from '@apollo/client';
import { Box, IconButton, Image, Tooltip } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TCRMutations from '../../graphql/Mutations/TCRMutations';
import { useStimulusToast } from '../../hooks';

const { CHANGE_FAVORITE_SETTING_GQL } = TCRMutations;

interface Props {
  company: any;
}

const FavoriteCompany: FC<Props> = ({ company }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useStimulusToast();
  const { id, tenantCompanyRelation, legalBusinessName, doingBusinessAs } = company;
  const [IsFavorite, setIsFavorite] = useState(tenantCompanyRelation.isFavorite);

  const [changeFavoriteSetting, { loading: loadingFavorite }] = useMutation(CHANGE_FAVORITE_SETTING_GQL);

  const toggleFavorite = (company: any) => {
    const variables = { id, isFavorite: !IsFavorite };
    changeFavoriteSetting({ variables }).then(({ data }: any) => {
      if (!data.updateTenantCompanyRelation.errors) {
        const message = (
          <span>
            {`${legalBusinessName ?? doingBusinessAs} ${
              data.updateTenantCompanyRelation.isFavorite ? t(' added to favorites') : t(' removed from favorites')
            }`}
          </span>
        );
        setIsFavorite(data.updateTenantCompanyRelation.isFavorite);
        enqueueSnackbar(message, { status: 'success' });
      }
    });
  };

  return (
    <Box position="relative" left="-8px" _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}>
      <Tooltip
        id="testThis"
        label={IsFavorite ? t('Remove from favorites') : t('Add to favorites')}
        bg="#fff"
        border="1px solid #E4E4E4"
        boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
        boxSizing="border-box"
        color="#2A2A28"
      >
        <IconButton
          isLoading={loadingFavorite}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(company);
          }}
          variant="simple"
          aria-label="add"
          icon={<Image width="14px" src={`/icons/star_${IsFavorite ? 'filled' : 'outlined'}.svg`} />}
        />
      </Tooltip>
    </Box>
  );
};

export default FavoriteCompany;
