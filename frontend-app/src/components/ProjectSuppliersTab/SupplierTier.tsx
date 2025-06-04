import { FC } from 'react';
import {
  Text,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import Supplier from './Supplier';

interface Props {
  projectCompany: any;
}

const SupplierTier: FC<Props> = ({ projectCompany }) => {
  const { company } = projectCompany;
  const { tenantCompanyRelation } = company;
  const { supplierTier } = tenantCompanyRelation;
  return (
    <Stack direction="row" spacing={4}>
      <Accordion allowToggle width="100%">
        <AccordionItem>
          <AccordionButton
            aria-label="add"
            onClick={(e) => e.stopPropagation()}
            _hover={{ bg: 'transparent', borderRadius: '20' }}
          >
            <AccordionIcon />
            <Text
              bg="transparent"
              as="h3"
              textStyle="h3"
              _hover={{ borderRadius: '20', cursor: 'pointer', textDecoration: 'underline', bg: 'gradient.iconbutton' }}
            >
              Tier {supplierTier} Suppliers
            </Text>
          </AccordionButton>
          <AccordionPanel pb={2}>
            <Supplier
              key={company.id + 'tier-' + supplierTier}
              projectCompany={projectCompany}
              childrencompany={true}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
};

export default SupplierTier;
