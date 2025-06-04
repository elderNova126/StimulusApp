import { Stack, IconButton, Link, Flex } from '@chakra-ui/react';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { removeHttp } from '../../../../utils/string';

interface CompanyNetWorksProps {
  company: {
    facebook: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
}

export const CompanyNetWorks = ({ company }: CompanyNetWorksProps) => {
  const { facebook, linkedin, twitter, website } = company;
  return (
    <Stack id="netWork" mb="0.5rem">
      <Flex alignItems="center" justify="normal">
        {facebook && (
          <Stack>
            <IconButton
              ml="-12px"
              variant="simple"
              color="green.600"
              aria-label="facebook"
              id="facebook"
              data-testid="facebook"
              icon={
                <Link href={`http://${removeHttp(facebook)}`} target="_blank">
                  <FaFacebookF />
                </Link>
              }
            />
          </Stack>
        )}
        {linkedin && (
          <Stack>
            <IconButton
              ml="-12px"
              variant="simple"
              color="green.600"
              aria-label="linkedin"
              id="linkedin"
              data-testid="linkedin"
              icon={
                <Link href={`http://${removeHttp(linkedin)}`} target="_blank">
                  <FaLinkedinIn />
                </Link>
              }
            />
          </Stack>
        )}
        {twitter && (
          <Stack>
            <IconButton
              ml="-12px"
              variant="simple"
              color="green.600"
              aria-label="twitter"
              id="twitter"
              data-testid="twitter"
              icon={
                <Link href={`http://${removeHttp(twitter)}`} target="_blank">
                  <FaTwitter />
                </Link>
              }
            />
          </Stack>
        )}
        {website && (
          <Stack>
            <Link
              href={`http://${removeHttp(website)}`}
              target="_blank"
              fontWeight="semibold"
              textDecor="underline"
              id="website"
              data-testid="website"
            >
              {removeHttp(website)}
            </Link>
          </Stack>
        )}
      </Flex>
    </Stack>
  );
};
