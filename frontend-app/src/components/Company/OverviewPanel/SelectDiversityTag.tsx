import { Box, Button, Flex, Select, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Tag from '../../GenericComponents/Tag';
import { OWNERSHIP_TAGS_EMPTY_VALUE } from '../company.types';
import { MinorityOwnership } from '../../../stores/features';

const SelectDiversityTag = (props: {
  label?: string;
  ownerships: string[];
  options: any[];
  setReduxMethod: (arg: string[]) => void;
  minorityOwnershipDetails?: MinorityOwnership[];
}) => {
  const { ownerships, label, options, setReduxMethod, minorityOwnershipDetails } = props;
  const selectRef = useRef<HTMLSelectElement>(null);
  const dispatch = useDispatch();
  const [currentOwnership, setCurrentOwnership] = useState<string[]>(
    ownerships.filter((item) => item !== OWNERSHIP_TAGS_EMPTY_VALUE)
  );
  const [preSelectOption, setPreSelectOption] = useState<string | null>(null);
  const [newOwnership, setNewOwnership] = useState<string[]>([]);
  const placeholder = 'Select Diversity Tag';
  const allSelectedOptions = [...currentOwnership, ...newOwnership];

  useEffect(() => {
    const newTags = [...currentOwnership, ...newOwnership];
    if (newTags.length === 0 && ownerships?.length > 0) {
      dispatch(setReduxMethod([OWNERSHIP_TAGS_EMPTY_VALUE]));
    } else {
      dispatch(setReduxMethod([...currentOwnership, ...newOwnership]));
    }
  }, [newOwnership, currentOwnership]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeOwnership = (Ownership: string) => {
    setCurrentOwnership(currentOwnership.filter((item) => item !== Ownership));
    setNewOwnership(newOwnership.filter((item) => item !== Ownership));
  };

  const addOwnership = (Ownership: string) => {
    if (Ownership === placeholder) return;
    if (newOwnership.includes(Ownership)) return;
    if (currentOwnership.includes(Ownership)) return;
    setNewOwnership([...newOwnership, Ownership]);
  };

  const allOptionsNotSelected = options.filter((option) => !allSelectedOptions.includes(option));

  return (
    <Box>
      {label ? (
        <Text marginBottom="0.5rem" textStyle="filterFieldHeading">
          {label}
        </Text>
      ) : null}
      <Flex id={`Currents-${label}`} width="100%" flexWrap="wrap">
        {(allSelectedOptions ?? []).map((Ownership: string) => (
          <Tag value={Ownership} onRemove={(value) => removeOwnership(value)} key={Ownership} />
        ))}
      </Flex>
      <Select
        ref={selectRef}
        id={`Edit-Select-${label ? label : 'Diversity'}`}
        fontSize="13px"
        w="369px"
        onChange={(e: any) => {
          if (label === 'Minority Tag') {
            const filterMinorityOwnership: any = minorityOwnershipDetails?.filter(
              (item) => item.displayName === e.target.value
            );
            setPreSelectOption(filterMinorityOwnership?.[0]?.minorityOwnershipDetail);
          } else {
            setPreSelectOption(e.target.value);
          }
        }}
      >
        {allOptionsNotSelected.map((option) => (
          <option id={`Edit-Options-Select-${label ? label : option}`} key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      {preSelectOption && (
        <Button
          mt="5px"
          id={`Add-Tag-Button`}
          data-testid="Add-Tag-Button"
          colorScheme="green"
          size="xs"
          onClick={() => {
            addOwnership(preSelectOption);
            setPreSelectOption(null);
            selectRef.current && (selectRef.current.value = placeholder);
          }}
        >
          ADD
        </Button>
      )}
    </Box>
  );
};

export default SelectDiversityTag;
