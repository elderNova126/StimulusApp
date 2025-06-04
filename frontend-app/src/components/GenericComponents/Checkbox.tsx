import { Image, ImageProps } from '@chakra-ui/react';
import { FC } from 'react';

interface Props {
  checked: boolean;
  onClick?: () => void;
  width?: string;
  height?: string;
  testId?: string;
}

const Checkbox: FC<Props & ImageProps> = ({ checked, onClick, width, height, testId, ...imageProps }) => {
  return (
    <Image
      data-testid={testId ?? 'checkbox'}
      onClick={onClick}
      {...(checked && {
        bg: 'linear-gradient(179.97deg, rgba(176, 226, 187, 0.75) 0.03%, rgba(146, 214, 193, 0.75) 99.97%), #FFFFFF',
        bgPosition: 'center',
        bgRepeat: 'no-repeat',
        bgSize: '10px 10px',
      })}
      width={width || '14px'}
      height={height || '14px'}
      src={`/icons/checkbox_${checked ? 'checked' : 'unchecked'}.svg`}
      {...imageProps}
      color={checked ? 'blue' : 'gray'}
    />
  );
};

export default Checkbox;
