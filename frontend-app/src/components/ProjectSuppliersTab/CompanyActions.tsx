import React, { FC } from 'react';
import {
  Box,
  Button,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import CompanyAddActionPanel from '../CompanyAddActionPanel';

interface Props {
  company: any;
}

const CompanyActions: FC<Props> = ({ company }) => {
  return (
    <Box>
      <Popover placement="right-start">
        <PopoverTrigger>
          <Button
            as={IconButton}
            aria-label="add"
            size="sm"
            icon={<Image width="14px" src={`/icons/plus.svg`} />}
            bg="transparent"
            _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
            onClick={(e) => e.stopPropagation()}
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            onClick={(e) => e.stopPropagation()}
            maxHeight="500px"
            width="200px"
            overflow="auto"
            p="0 10px 10px 0"
            borderRadius="0"
            border="1px solid #E4E4E4"
            borderColor="#E4E4E4"
            boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
          >
            <PopoverArrow />
            <PopoverBody p="0">
              <CompanyAddActionPanel company={company} />
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Box>
  );
};

export default CompanyActions;
