import { FC, forwardRef, useImperativeHandle } from 'react';
import { useAssetUri } from '../../hooks';
import { Avatar, AvatarProps, Image } from '@chakra-ui/react';

const UserAvatar: FC<any> = forwardRef((props, ref) => {
  const { userId, name, ...avatarProps } = props;
  const { assetUri, refetch, clearAsset } = useAssetUri({ ...(userId && { userId }) });

  useImperativeHandle(ref, () => ({
    canRemove: () => !!assetUri,
    refetch: (val: string) => {
      refetch(val);
    },
    clearAsset: () => clearAsset(),
  }));

  return <Avatar name={name ?? ''} size="sm" src={assetUri ?? name} {...avatarProps} />;
});

const CompanyAvatar: FC<AvatarProps & { companyId: string; name?: string; createSupplier?: boolean }> = forwardRef(
  (props, ref) => {
    const { companyId, createSupplier, name, ...avatarProps } = props;
    const { assetUri, refetch, clearAsset } = useAssetUri({ ...(companyId && { companyId }) });

    useImperativeHandle(ref, () => ({
      canRemove: () => !!assetUri,
      refetch: (val: string) => {
        refetch(val);
      },
      clearAsset: () => clearAsset(),
    }));

    return (
      <Avatar
        size="md"
        src={assetUri || ''}
        bg="#D4D4D4"
        {...(createSupplier && { icon: <Image w="24px" h="24px" src={'/icons/home.svg'} /> })}
        {...avatarProps}
      />
    );
  }
);

export { UserAvatar, CompanyAvatar };
