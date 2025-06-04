import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import UserMutations from '../graphql/Mutations/UserMutations';
import { setLoadingLogoUser, setLoadingLogoCompany } from '../stores/features/generalData';
import * as R from 'ramda';
import CompanyQueries from '../graphql/Queries/CompanyQueries';
import { useStimulusToast, useErrorTranslation } from '.';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const { DELETE_ASSET, UPLOAD_ASSET } = UserMutations;
const { COMPANY_OR_USER_ASSETS } = CompanyQueries;

const useUploadImage = () => {
  const [uploadImage, { loading }] = useMutation(UPLOAD_ASSET);
  const [loadingImage, setLoading] = useState(false);
  const { enqueueSnackbar } = useStimulusToast();
  const errTranslations = useErrorTranslation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const uploadProfileImage = (
    file: File,
    userId: string | null,
    companyId: string | null,
    refetch: any,
    clearAsset: any
  ) => {
    const queryVariables = userId ? { userId } : { companyId };
    dispatch(userId ? setLoadingLogoUser(true) : setLoadingLogoCompany(true));
    uploadImage({
      variables: { file, ...(userId ? { userId } : { companyId }) },
      update: (cache, { data: { uploadAsset } }) => {
        clearAsset();
        const { assetDetails } = R.clone(
          cache.readQuery({
            query: COMPANY_OR_USER_ASSETS,
            variables: queryVariables,
          })
        ) as any;
        assetDetails.results = [...(assetDetails?.results || []), uploadAsset];

        cache.writeQuery({
          query: COMPANY_OR_USER_ASSETS,
          variables: queryVariables,
          data: { assetDetails: { ...assetDetails } },
        });

        if (uploadAsset?.id) {
          refetch(uploadAsset.id);
          enqueueSnackbar(t('Photo was uploaded'), { status: 'success' });
          dispatch(userId ? setLoadingLogoUser(false) : setLoadingLogoCompany(false));
        }
        if (uploadAsset?.error) {
          enqueueSnackbar(errTranslations[uploadAsset.code], { status: 'error' });
          dispatch(userId ? setLoadingLogoUser(false) : setLoadingLogoCompany(false));
        }
      },
    });
  };

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  return { uploadProfileImage, loadingImage };
};

const useRemovePhoto = () => {
  const [deleteImage] = useMutation(DELETE_ASSET);
  const { enqueueSnackbar } = useStimulusToast();
  const errTranslations = useErrorTranslation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const deleteProfileimage = (userId: string | null, companyId: string | null, clearAsset: any) => {
    const queryVariables = userId ? { userId } : { companyId };
    dispatch(userId ? setLoadingLogoUser(true) : setLoadingLogoCompany(true));
    deleteImage({
      variables: queryVariables,
      update: (cache, { data: { deleteAsset } }) => {
        const { assetDetails } = R.clone(
          cache.readQuery({ query: COMPANY_OR_USER_ASSETS, variables: queryVariables })
        ) as any;
        assetDetails.results = assetDetails.results.filter((asset: any) =>
          userId ? asset.user.id !== userId : asset.company.id !== companyId
        );

        cache.writeQuery({
          query: COMPANY_OR_USER_ASSETS,
          variables: queryVariables,
          data: { assetDetails: { ...assetDetails } },
        });

        if (deleteAsset?.error) {
          enqueueSnackbar(errTranslations[deleteAsset.code], { status: 'error' });
          dispatch(userId ? setLoadingLogoUser(false) : setLoadingLogoCompany(false));
        }
        if (deleteAsset?.done) {
          clearAsset();
          enqueueSnackbar(t('Photo was deleted'), { status: 'success' });
          dispatch(userId ? setLoadingLogoUser(false) : setLoadingLogoCompany(false));
        }
      },
    });
  };

  return { deleteProfileimage };
};

export { useUploadImage, useRemovePhoto };
