import { useMutation } from '@apollo/client';
import { CloseIcon } from '@chakra-ui/icons';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import { handleErrorFromAlerts, useStimulusToast } from '../../hooks';
import { CompanyUpdateState, Tag, setCompanyEdit, setLoading, initCompany } from '../../stores/features/company';
import { cleanEmptyValues } from '../../utils/dataMapper';
import { Company } from './company.types';
import { bannerEditMode, flexEditMode } from './styles';
import './styles.css';
import { FormCompanyContext } from '../../hooks/companyForms/companyForm.provider';
import { nameTypes } from './company.types';
import { removeDuplicatesInArrayOfString, checkIfArraysAreEqual } from '../../utils/string';
import { GeneralState } from '../../stores/features/generalData';
import { useDeleteBadgeRelationship } from './RelationShipPanel/Badges/hooksBadgeRelationships';
import StimButton from '../ReusableComponents/Button';

const { UPDATE_COMPANY, CREATE_INDUSTRY } = CompanyMutations;

const UpdatePanel: FC<{
  company: Company;
  onSubmit: () => void;
  getCompanies: () => void;
}> = ({ company, onSubmit, getCompanies }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useStimulusToast();
  const [updateCompany] = useMutation(UPDATE_COMPANY);
  const [createIndustry] = useMutation(CREATE_INDUSTRY);
  const { deleteBadgeRelationships } = useDeleteBadgeRelationship();
  const loading = useSelector((state: { company: CompanyUpdateState }) => state.company?.loading);
  const description = useSelector((state: { company: CompanyUpdateState }) => state.company?.description);
  const tags: Tag[] = useSelector((state: { company: CompanyUpdateState }) => state.company?.tags);
  const diverseOwnership = useSelector((state: { company: CompanyUpdateState }) => state.company?.diverseOwnership);
  const minorityOwnership = useSelector((state: { company: CompanyUpdateState }) => state.company?.minorityOwnership);
  const isSmallBusiness = useSelector((state: { company: CompanyUpdateState }) => state.company?.isSmallBusiness);
  const ownershipDescription = useSelector(
    (state: { company: CompanyUpdateState }) => state.company?.ownershipDescription
  );
  const legalBusinessName = useSelector((state: { company: CompanyUpdateState }) => state.company?.legalBusinessName);
  const doingBusinessAs = useSelector((state: { company: CompanyUpdateState }) => state.company?.doingBusinessAs);
  const previousBusinessNames = useSelector(
    (state: { company: CompanyUpdateState }) => state.company?.previousBusinessNames
  );
  const operatingStatus = useSelector((state: { company: CompanyUpdateState }) => state.company?.operatingStatus);
  const otherBusinessNames = useSelector((state: { company: CompanyUpdateState }) => state.company?.otherBusinessNames);
  const jurisdictionOfIncorporation = useSelector(
    (state: { company: CompanyUpdateState }) => state.company?.jurisdictionOfIncorporation
  );
  const yearFounded = useSelector((state: { company: CompanyUpdateState }) => state.company?.yearFounded);
  const typeOfLegalEntity = useSelector((state: { company: CompanyUpdateState }) => state.company?.typeOfLegalEntity);
  const creditScoreBusinessNo = useSelector(
    (state: { company: CompanyUpdateState }) => state.company?.creditScoreBusinessNo
  );
  const webDomain = useSelector((state: { company: CompanyUpdateState }) => state.company?.webDomain);
  const emailDomain = useSelector((state: { company: CompanyUpdateState }) => state.company?.emailDomain);
  const netPromoterScore = useSelector((state: { company: CompanyUpdateState }) => state.company.netPromoterScore);
  const linkedInFollowers = useSelector((state: { company: CompanyUpdateState }) => state.company?.linkedInFollowers);
  const facebookFollowers = useSelector((state: { company: CompanyUpdateState }) => state.company?.facebookFollowers);
  const twitterFollowers = useSelector((state: { company: CompanyUpdateState }) => state.company?.twitterFollowers);
  const currency = useSelector((state: { company: CompanyUpdateState }) => state.company?.currency);
  const website = useSelector((state: { company: CompanyUpdateState }) => state.company?.website);
  const linkedin = useSelector((state: { company: CompanyUpdateState }) => state.company?.linkedin);
  const facebook = useSelector((state: { company: CompanyUpdateState }) => state.company?.facebook);
  const twitter = useSelector((state: { company: CompanyUpdateState }) => state.company?.twitter);
  const revenue = useSelector((state: { company: CompanyUpdateState }) => state.company?.revenue);
  const revenueCAGR = useSelector((state: { company: CompanyUpdateState }) => state.company?.revenueCAGR);
  const netProfit = useSelector((state: { company: CompanyUpdateState }) => state.company?.netProfit);
  const netProfitCAGR = useSelector((state: { company: CompanyUpdateState }) => state.company?.netProfitCAGR);
  const totalAssets = useSelector((state: { company: CompanyUpdateState }) => state.company?.totalAssets);
  const assetsRatio = useSelector((state: { company: CompanyUpdateState }) => state.company?.assetsRatio);
  const totalLiabilities = useSelector((state: { company: CompanyUpdateState }) => state.company?.totalLiabilities);
  const liabilitiesRatio = useSelector((state: { company: CompanyUpdateState }) => state.company?.liabilitiesRatio);
  const boardTotal = useSelector((state: { company: CompanyUpdateState }) => state.company?.boardTotal);
  const boardDiverse = useSelector((state: { company: CompanyUpdateState }) => state.company?.boardDiverse);
  const leadershipTeamTotal = useSelector(
    (state: { company: CompanyUpdateState }) => state.company?.leadershipTeamTotal
  );
  const employeesDiverse = useSelector((state: { company: CompanyUpdateState }) => state.company?.employeesDiverse);
  const employeesTotal = useSelector((state: { company: CompanyUpdateState }) => state.company?.employeesTotal);
  const customers = useSelector((state: { company: CompanyUpdateState }) => state.company?.customers);
  const customersGrowthCAGR = useSelector(
    (state: { company: CompanyUpdateState }) => state.company?.customersGrowthCAGR
  );
  const industries = useSelector((state: { company: CompanyUpdateState }) => state.company?.industries);
  const parentCompanyTaxId = useSelector((state: { company: CompanyUpdateState }) => state.company?.parentCompanyTaxId);
  // tenant company relationship
  const internalName = useSelector(
    (state: { company: CompanyUpdateState }) => state.company.tenantCompanyRelation?.internalName
  );
  const internalId = useSelector(
    (state: { company: CompanyUpdateState }) => state.company.tenantCompanyRelation?.internalId
  );
  const badgesToRemove = useSelector((state: { generalData: GeneralState }) => state.generalData?.removedBadges);

  const { formMethods } = useContext(FormCompanyContext)!;
  const { errors: useFromErros, clearErrors } = formMethods;
  const addNewIndustries = (industries: any[]) => {
    return new Promise((resolve, reject) => {
      let newIndustries: any = [];
      const promise = industries.map(async (industry: any) => {
        const newIndustry: any = await createIndustry({
          variables: {
            id: 'NEW',
            ...industry,
          },
        });
        const { data } = newIndustry;
        newIndustries = [...newIndustries, data.createIndustry];
      });
      Promise.all(promise).then(() => {
        resolve(newIndustries);
      });
    });
  };

  const saveEdits = async () => {
    if (handleErrorFromAlerts({ errors: useFromErros, enqueueSnackbar })) return;

    dispatch(setLoading(true));
    const getIndustryUpdates = () => {
      return industries.reduce(
        (acc, curr) => {
          if (curr.id) {
            acc.industryIds.push(curr.id);
          } else {
            acc.newCustomIndustries.push(curr);
          }
          return acc;
        },
        { industryIds: [] as string[], newCustomIndustries: [] as any[] }
      );
    };
    const industriesChange =
      (industries && industries?.length !== company.industries?.length) ||
      industries?.filter?.((industry) => !company.industries?.find?.((ind) => ind?.id === industry?.id))?.length > 0;

    const recalculateNetPromoteScore = () => {
      if (netPromoterScore !== company.netPromoterScore) {
        if (netPromoterScore !== 0) {
          return Number(netPromoterScore) / 100;
        }
      }
    };

    const differentTags =
      tags?.filter?.((tag) => !company.tags?.find?.((t) => t === tag))?.length > 0 ||
      tags?.length !== company.tags?.length;

    const othersFromCompany = removeDuplicatesInArrayOfString(
      (company?.names?.filter?.((name) => name.type === nameTypes.OTHER).map((name) => name.name) as string[]) ?? []
    );
    const previousFromCompany = removeDuplicatesInArrayOfString(
      (company?.names?.filter?.((name) => name.type === nameTypes.PREVIOUS).map((name) => name.name) as string[]) ?? []
    );

    const updates = {
      ...(industriesChange && getIndustryUpdates()),
      ...(diverseOwnership?.join?.(',') !== company?.diverseOwnership?.join?.(',') && {
        diverseOwnership,
      }),
      ...(minorityOwnership?.join?.(',') !== (company?.minorityOwnership ?? [])?.join?.(',') && {
        minorityOwnership,
      }),
      ...(isSmallBusiness !== company.isSmallBusiness && { smallBusiness: isSmallBusiness }),
      ...(ownershipDescription !== company.ownershipDescription && { ownershipDescription }),
      ...(differentTags && { tags: tags.map((tag) => tag.tag) }),
      ...(description !== company.description && { description }),

      ...(legalBusinessName !== company.legalBusinessName && { legalBusinessName: legalBusinessName.trim() }),
      ...(!checkIfArraysAreEqual(
        removeDuplicatesInArrayOfString(previousBusinessNames?.filter((e) => e !== '')),
        previousFromCompany
      ) && { previousBusinessNames }),
      ...(!checkIfArraysAreEqual(
        removeDuplicatesInArrayOfString(otherBusinessNames?.filter((e) => e !== '')),
        othersFromCompany
      ) && { otherBusinessNames }),
      ...(doingBusinessAs !== company.doingBusinessAs && { doingBusinessAs: doingBusinessAs.trim() }),

      ...(operatingStatus !== company.operatingStatus && operatingStatus !== '' && { operatingStatus }),
      ...(jurisdictionOfIncorporation !== company.jurisdictionOfIncorporation && { jurisdictionOfIncorporation }),
      ...(Number(yearFounded) !== Number(company.yearFounded) && { yearFounded: Number(yearFounded) }),
      ...(typeOfLegalEntity !== company.typeOfLegalEntity && { typeOfLegalEntity }),
      ...(creditScoreBusinessNo !== company.creditScoreBusinessNo && {
        creditScoreBusinessNo,
      }),
      ...(website !== company.website && { website }),
      ...(facebook !== company.facebook && { facebook }),
      ...(twitter !== company.twitter && { twitter }),
      ...(linkedin !== company.linkedin && { linkedin }),
      ...(webDomain !== company.webDomain && { webDomain }),
      ...(emailDomain !== company.emailDomain && { emailDomain }),
      ...(recalculateNetPromoteScore() !== company.netPromoterScore && {
        netPromoterScore: recalculateNetPromoteScore(),
      }),
      ...(linkedInFollowers !== company.linkedInFollowers && { linkedInFollowers }),
      ...(facebookFollowers !== company.facebookFollowers && { facebookFollowers }),
      ...(twitterFollowers !== company.twitterFollowers && { twitterFollowers }),
      ...(currency !== company.currency && { currency }),
      ...(revenue !== company.revenue && { revenue }),
      ...(revenueCAGR !== company.revenueGrowthCAGR && { revenueGrowthCAGR: revenueCAGR }),
      ...(netProfit !== company.netProfit && { netProfit }),
      ...(netProfitCAGR !== company.netProfitGrowthCAGR && { netProfitGrowthCAGR: netProfitCAGR }),
      ...(totalAssets !== company.totalAssets && { totalAssets }),
      ...(assetsRatio !== company.assetsRevenueRatio && { assetsRevenueRatio: assetsRatio }),
      ...(liabilitiesRatio !== company.totalLiabilities && {
        totalLiabilities,
      }),
      ...(totalLiabilities !== company.liabilitiesRevenueRatio && {
        liabilitiesRevenueRatio: liabilitiesRatio,
      }),
      ...(boardTotal !== company.boardTotal && { boardTotal }),
      ...(boardDiverse !== company.boardDiverse && { boardDiverse }),
      ...(leadershipTeamTotal !== company.leadershipTeamTotal && {
        leadershipTeamTotal,
      }),
      ...(employeesDiverse !== company.employeesDiverse && { employeesDiverse }),
      ...(employeesTotal !== company.employeesTotal && { employeesTotal }),
      ...(customers !== company.customers && { customers }),
      ...(customersGrowthCAGR !== company.customersGrowthCAGR && {
        customersGrowthCAGR,
      }),
      ...(internalName !== company.tenantCompanyRelation.internalName && {
        internalName,
      }),
      ...(internalId !== company.tenantCompanyRelation.internalId && {
        internalId,
      }),
      ...(parentCompanyTaxId !== company?.parentCompanyTaxId && {
        parentCompanyTaxId,
      }),
    };
    try {
      if (badgesToRemove.length) {
        await deleteBadgeRelationships({ ids: badgesToRemove });
      }
      const newUpdate = cleanEmptyValues(updates);
      // create custom industry
      if (Object.keys(newUpdate).length) {
        if (newUpdate.newCustomIndustries) {
          const industries: any = await addNewIndustries(newUpdate.newCustomIndustries);
          newUpdate.industryIds = [...newUpdate.industryIds, ...industries.map((industry: any) => industry.id)];
          delete newUpdate.newCustomIndustries;
        }
        const { errors } = await updateCompany({
          variables: {
            id: company.id,
            ...newUpdate,
          },
          update: (cache, { data }) => {
            if (data?.updateCompany.results) {
              getCompanies();
              dispatch(setLoading(false));
            }
          },
        });
        if (!errors) {
          onSubmit();
        }
        dispatch(setLoading(false));
      } else {
        onSubmit();
      }
      getCompanies();
    } catch (err) {
      dispatch(setLoading(false));
    }
  };

  const handleCancel = () => {
    clearErrors();
    dispatch(setCompanyEdit(false));
    dispatch(setLoading(false));
    // @ts-ignore - Temporarily ignore type error until action creator is fixed
    dispatch(initCompany(company));
  };

  return (
    <Box sx={bannerEditMode} id="edit-mode-banner">
      <Flex sx={flexEditMode} bg="stimNeutral.white">
        <Stack flex="2">
          <Text as="h4" textStyle="h4">
            {t('Edit Mode')}
          </Text>
          <Text textStyle="tableSubInfoSecondary">
            {t(
              "Only data you have previously provided may be edited. Updates may not be immediately reflected on the profile due to user's access level."
            )}
          </Text>
        </Stack>
        <Stack direction="row-reverse" flex="1">
          <StimButton isLoading={loading} size="stimSmall" onClick={saveEdits}>
            {t('Save Changes')}
          </StimButton>
          <StimButton
            leftIcon={<CloseIcon fontSize="10px" />}
            onClick={handleCancel}
            size="stimSmall"
            variant="stimTextButton"
          >
            {t('Cancel')}
          </StimButton>
        </Stack>
      </Flex>
    </Box>
  );
};

export default UpdatePanel;
