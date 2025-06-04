import { Input, Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';

const ProfileField: FC<{ label: string; value: string; onChange: (val: string) => void; name: string }> = (props) => {
  const { value, onChange, label, name } = props;

  return (
    <Stack spacing={1}>
      <Text textStyle="h4" as="h4">
        {label}
      </Text>
      <Input name={name} id={name} size="sm" type="text" onChange={(e) => onChange(e.target.value)} value={value} />
    </Stack>
  );
};

export default ProfileField;
