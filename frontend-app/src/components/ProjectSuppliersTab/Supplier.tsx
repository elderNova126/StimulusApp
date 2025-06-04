import { FC } from 'react';
import { Flex, Text, Stack, IconButton, Box } from '@chakra-ui/react';
import { capitalizeFirstLetter, getCompanyName } from '../../utils/dataMapper';
import FavoriteCompany from './FavoriteCompany';
import CompanyActions from './CompanyActions';
import { CompanyToMove, CompanyType } from './index';
import { MdQuestionAnswer } from 'react-icons/md';
import { navigate } from '@reach/router';
import SupplierTier from './SupplierTier';
import { localeUSDFormatProject } from '../../utils/number';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import StimButton from '../ReusableComponents/Button';
interface Props {
  projectCompany: any;
  changeCompanyType?: (companyToMove: CompanyToMove) => void;
  setCompanyToAnswerCriteria?: (companyToMove: CompanyToMove) => void;
  nextType?: CompanyType;
  buttonLabel?: string;
  childrencompany?: any | boolean;
}

const Supplier: FC<Props> = ({
  projectCompany,
  changeCompanyType,
  setCompanyToAnswerCriteria,
  nextType,
  buttonLabel,
  childrencompany,
}) => {
  const { company, evaluations } = projectCompany;
  const { tenantCompanyRelation } = company;
  const { supplierTier: tier } = tenantCompanyRelation;
  const scores = company?.stimulusScore?.results;
  const showTier = tier && childrencompany && !nextType;

  return (
    <Stack
      flexDirection="row"
      display={'flex'}
      alignItems={'flex-start'}
      width="100%"
      marginTop={tier ? '-0.4rem' : '0'}
    >
      {showTier ? (
        <Box width={'4.5rem'} marginTop={'0.3rem'} display={'flex'} alignItems={'center'}>
          <Text
            as="h3"
            textStyle="h3"
            color="#000"
            fontSize="15px"
            borderRadius="20"
            bg="gradient.iconbutton"
            padding={'0.2rem 0.5rem 0.2rem 0.5rem'}
          >
            Tier {tier}
          </Text>
        </Box>
      ) : null}
      <Stack spacing={1} flexDirection="column" width="100%">
        <Flex flexDirection="row" width="100%">
          <Text
            as="h3"
            textStyle="h3"
            onClick={() => navigate(`/company/${company?.id}`)}
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
          >
            {getCompanyName(company)}
          </Text>
          {!isNaN(scores?.[0]?.scoreValue) && (
            <>
              <span style={{ margin: '0 0.3rem 0rem 0.3rem' }}>&#8729;</span>
              <Text mt=".1rem" textStyle="body">
                {`Score: ${Math.round(scores?.[0]?.scoreValue)}`}
              </Text>
            </>
          )}
        </Flex>
        {evaluations?.[0]?.budgetSpend ? (
          <Box>
            <Text mt=".1rem" textStyle="body">
              {localeUSDFormatProject(evaluations?.[0]?.budgetSpend)}
            </Text>
            <Text mt=".1rem" textStyle="body" fontSize="11px">
              Total Spent
            </Text>
          </Box>
        ) : null}
        <Stack direction="row" spacing={4}>
          {nextType && changeCompanyType && buttonLabel && (
            <StimButton
              variant="stimTextButton"
              onClick={() => changeCompanyType({ company, nextType, action: buttonLabel })}
              maxH="34px"
              paddingLeft="0px"
            >
              {buttonLabel && capitalizeFirstLetter(buttonLabel)}
            </StimButton>
          )}
          {setCompanyToAnswerCriteria && (
            <Box as="span" position="relative" left="-8px" _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}>
              <IconButton
                size="sm"
                variant="simple"
                aria-label="criteria"
                icon={<MdQuestionAnswer />}
                onClick={() => setCompanyToAnswerCriteria({ company })}
              />
            </Box>
          )}
          <FavoriteCompany company={company} />
          <CompanyActions company={company} />
        </Stack>
        {childrencompany ? (
          <Box>
            {childrencompany?.map?.((childrenProjectCompany: any, index: number) => (
              <SupplierTier projectCompany={childrenProjectCompany} key={index} />
            ))}
          </Box>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default withLDConsumer()(Supplier) as any;
