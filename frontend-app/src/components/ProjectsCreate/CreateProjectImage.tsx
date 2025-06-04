import { Image } from '@chakra-ui/react';
import React from 'react';

const CreateProjectImage = () => (
  <Image
    position="absolute"
    width="600px"
    zIndex={-1}
    h="400px"
    mt="4rem"
    right={0}
    src="/icons/create_new_project.svg"
  />
);

export default CreateProjectImage;
