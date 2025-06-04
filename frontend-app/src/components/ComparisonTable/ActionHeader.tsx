import { UpDownIcon } from '@chakra-ui/icons';
import {
  Box,
  BoxProps,
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  Th,
  Tooltip,
} from '@chakra-ui/react';
import { COMPARE_FIELDS } from './index';
import { Checkbox } from '../GenericComponents';
import { navigate } from '@reach/router';
import MoreVert from '@material-ui/icons/MoreVert';
import CompanyAddActionPanel from '../CompanyAddActionPanel';
import {
  buttonActionHeader,
  flexContainerActionHeader,
  popoverContentHeader,
  popoverIconHeader,
  stackActionHeader,
  tooltipTextHeader,
} from './styles';
import StimButton from '../ReusableComponents/Button';

interface ActionHeaderProps {
  header: any;
  sortBy: string;
  sortDirection: number;
  setSortBy: (name: string) => void;
  setSortDirection: (direction: number) => void;
  hideCompany: (companyId?: string) => void;
  hideMetric: (metric: string) => void;
}

export const ActionHeader = (props: BoxProps & ActionHeaderProps) => {
  const { header, sortBy, sortDirection, setSortBy, setSortDirection, hideCompany, hideMetric, ...thProps } = props;

  return (
    <Th {...thProps} className="companyNameRow">
      <Flex sx={flexContainerActionHeader}>
        {header.isMetric ? (
          <StimButton
            sx={buttonActionHeader}
            variant="stimTextButton"
            p="0 8px !important"
            aria-label={header.name}
            onClick={() => {
              if (sortBy === header.name) {
                setSortDirection(sortDirection === 1 ? -1 : 1);
              } else {
                setSortBy(header.name);
                setSortDirection(1);
              }
            }}
            rightIcon={<>{header.name === sortBy && sortDirection !== 0 && <UpDownIcon fontSize="8px" />}</>}
            textDecoration="None"
          >
            <Text as="h5" textStyle="h5">
              {COMPARE_FIELDS[header.name]}
            </Text>
          </StimButton>
        ) : (
          <Stack sx={stackActionHeader} direction="row" spacing={2}>
            <Checkbox
              testId={`checkbox-${header?.company?.id}`}
              id={`checkbox-${header?.company?.id}`}
              checked={header.checked}
              onClick={header?.onCheckClick}
            />
            <Tooltip label={header.name} visibility={header.name.length >= 25 ? 'visible' : 'hidden'}>
              <Text
                as="h5"
                textStyle="h5"
                onClick={() => navigate(`/company/${header?.company?.id}`)}
                sx={tooltipTextHeader}
              >
                {header.name.length >= 25 ? header.name.slice(0, 25) + '...' : header.name}
              </Text>
            </Tooltip>
          </Stack>
        )}
        <Box>
          {!header.isMetric && (
            <Popover placement="right-start">
              <PopoverTrigger>
                <IconButton
                  className="actionAddIcon"
                  aria-label="add"
                  sx={popoverIconHeader}
                  onClick={(e: any) => e.stopPropagation()}
                >
                  <MoreVert />
                </IconButton>
              </PopoverTrigger>
              <Portal>
                <PopoverContent onClick={(e: any) => e.stopPropagation()} sx={popoverContentHeader}>
                  <PopoverBody p="0">
                    <CompanyAddActionPanel company={header.company} />
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          )}
        </Box>
      </Flex>
    </Th>
  );
};
