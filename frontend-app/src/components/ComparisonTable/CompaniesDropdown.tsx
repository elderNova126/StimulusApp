import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import MoreVert from '@material-ui/icons/MoreVert';
import { useState } from 'react';
import { SwitchButton } from '../GenericComponents';
import { getCompanyName } from '../../utils/dataMapper';
import { menuListMetricDropdown } from './styles';

export const CompaniesDropDown = (props: {
  companies: any[];
  blockedCompanies: string[];
  setBlockedCompanies: (companies: any[]) => void;
}) => {
  const { companies, setBlockedCompanies, blockedCompanies } = props;

  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu closeOnSelect={false} isOpen={isOpen}>
      <MenuButton
        as={IconButton}
        aria-label="Companies Options"
        icon={<MoreVert />}
        variant="simple"
        onClick={(e) => {
          e.stopPropagation();
          return setIsOpen(!isOpen);
        }}
      />
      <MenuList sx={menuListMetricDropdown}>
        {companies.map((company: any) => (
          <MenuItem
            key={company.id}
            onClick={(e: any) => {
              if (blockedCompanies.indexOf(company.id) === -1) {
                if (blockedCompanies.length < companies.length - 1) {
                  setBlockedCompanies([company.id, ...blockedCompanies]);
                }
              } else {
                setBlockedCompanies(blockedCompanies.filter((m) => m !== company.id));
              }
            }}
            icon={
              <SwitchButton
                onClick={(e: any) => e.stopPropagation()}
                onChange={(e: any) => {}}
                isChecked={!blockedCompanies.find((m: any) => m === company.id)}
              />
            }
          >
            {getCompanyName(company)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
