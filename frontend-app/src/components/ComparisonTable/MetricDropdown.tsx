import { IconButton, Menu, MenuButton, MenuItem, MenuList, MenuDivider } from '@chakra-ui/react';
import { useState } from 'react';
import { COMPARE_FIELDS } from './index';
import MoreVert from '@material-ui/icons/MoreVert';
import { SwitchButton } from '../GenericComponents';
import { menuButtonMetricDropdown, menuListMetricDropdown } from './styles';

export const MetricDropDown = (props: {
  metrics: string[];
  activeMetrics: string[];
  setActiveMetrics: (metrics: string[]) => void;
  transpose?: boolean;
}) => {
  const { metrics, setActiveMetrics, activeMetrics, transpose } = props;
  const [showAll, setShowAll] = useState(true);

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        sx={menuButtonMetricDropdown(transpose ? transpose : false)}
        as={IconButton}
        aria-label="Metric Options"
        icon={<MoreVert />}
        variant="simple"
      />
      <MenuList sx={menuListMetricDropdown}>
        <MenuItem
          onClick={(e: any) => {
            if (!showAll) {
              setActiveMetrics(metrics);
            } else {
              setActiveMetrics([]);
            }
          }}
          icon={
            <SwitchButton
              onClick={(e: any) => e.stopPropagation()}
              onChange={(e: any) => {
                setShowAll(!showAll);
              }}
              isChecked={showAll}
            />
          }
        >
          Show All
        </MenuItem>
        <MenuDivider />
        {metrics.map((metric: string) => (
          <MenuItem
            key={metric}
            onClick={(e: any) => {
              if (activeMetrics.find((m) => m === metric)) {
                setActiveMetrics(activeMetrics.filter((m) => m !== metric));
              } else {
                setActiveMetrics(Array.from(new Set([metric, ...activeMetrics])));
              }
            }}
            icon={
              <SwitchButton
                onClick={(e: any) => e.stopPropagation()}
                onChange={(e: any) => {}}
                isChecked={!!activeMetrics.find((m: string) => m === metric)}
              />
            }
          >
            {COMPARE_FIELDS[metric]}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
