import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './style';
import StimButton from '../ReusableComponents/Button';

export interface Attachment {
  id: number;
  originalFilename: string;
  size: number;
}

export interface AttachmentURIHook {
  attachmentUri: string;
  refetch: (uri: string) => Promise<void>;
}

const AttachedDocument = (props: {
  useAttachmentURI: (id: string) => AttachmentURIHook;
  data: Attachment;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { data, onDelete, useAttachmentURI } = props;
  const [showHoverData, setShowHoverData] = useState(false);
  const { attachmentUri } = useAttachmentURI(`${data.id}`);
  const fileNameSplitter = data.originalFilename.split('.');
  const fileType = [...fileNameSplitter].pop() || 'UNKNOWN';
  const isPdf = fileType.toLowerCase() === 'pdf';
  const fileNameWithoutExtension = fileNameSplitter.slice(0, -1).join('.');

  const downloadAttachment = () => {
    const url = attachmentUri;
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = data.originalFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const openNewTab = () => {
    window.open(attachmentUri, '_blank');
  };

  const getIcon = () => {
    switch (fileType) {
      case 'doc': {
        return '/icons/doc.svg';
      }
      case 'pdf': {
        return '/icons/pdf.svg';
      }
      default: {
        return '/icons/file.svg';
      }
    }
  };

  return (
    <Flex
      className={classes.attachments}
      onMouseEnter={() => setShowHoverData(true)}
      onMouseLeave={() => setShowHoverData(false)}
      data-testid="attachment-container"
    >
      <Stack direction="row" spacing={1}>
        <Image src={getIcon()} alt="fav" h="35px" />
        <div>
          <Text cursor={isPdf ? 'pointer' : 'default'} textStyle="h5" as="h5" onClick={isPdf ? openNewTab : undefined}>
            {fileNameWithoutExtension}
          </Text>
          <Text textStyle="h6" as="h6">{`${fileType.toUpperCase()}, ${(data.size / 1024).toFixed(1)} KB`}</Text>
        </div>
      </Stack>
      <Stack direction="row" spacing={1}>
        {showHoverData && (
          <Box cursor="pointer">
            <StimButton
              isLoading={props.isDeleting}
              onClick={() => onDelete(data.id)}
              data-testid="company-attachment-deleteIcon"
              variant="stimDestructive"
              size="stimSmall"
              icon={<CloseIcon />}
            ></StimButton>
          </Box>
        )}
        {showHoverData && (
          <StimButton data-cy="choose-doc" variant="stimOutline" size="stimSmall" onClick={downloadAttachment}>
            {t('Download')}
          </StimButton>
        )}
      </Stack>
    </Flex>
  );
};

export default AttachedDocument;
