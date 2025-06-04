import { Skeleton, Stack } from '@chakra-ui/react';
import React from 'react';

function LoadingSkeletonList() {
  return (
    <Stack direction="column" alignItems={'center'} spacing={3}>
      <Skeleton height="15px" width="75%" startColor="green.100" endColor="green.400" />
      <Skeleton height="15px" width="75%" startColor="green.100" endColor="green.400" />
      <Skeleton height="15px" width="75%" startColor="green.100" endColor="green.400" />
    </Stack>
  );
}

export default LoadingSkeletonList;
