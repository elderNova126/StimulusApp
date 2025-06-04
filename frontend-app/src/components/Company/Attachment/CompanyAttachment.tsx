import { Box, Button, Flex, Image, Stack, Text } from '@chakra-ui/react';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Attachment from './Attachment.interface';
import { useCompanyAttachmentUri } from '../../../hooks';
import useStyles from './style';

const CompanyAttachment = (props: { data: Attachment; onDelete: (id: number) => void; isDeleting: boolean }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { data, onDelete } = props;
  const [showHoverData, setShowHoverData] = useState(false);
  const { attachmentUri } = useCompanyAttachmentUri(`${data.id}`);
  const fileNameSplitter = data.originalFilename.split('.');
  const fileType = [...fileNameSplitter].pop() || 'UNKNOWN';
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
      data-testid="company-attachment-container"
    >
      <Stack direction="row" spacing={1}>
        <Image src={getIcon()} alt="fav" h="35px" />
        <div>
          <Text textStyle="h5" as="h5">
            {fileNameWithoutExtension}
          </Text>
          <Text textStyle="h6" as="h6">{`${fileType.toUpperCase()}, ${(data.size / 1024).toFixed(1)} KB`}</Text>
        </div>
      </Stack>
      <Stack direction="row" spacing={1}>
        {showHoverData && (
          <Box cursor="pointer">
            <Button
              className={classes.deleteButton}
              isLoading={props.isDeleting}
              onClick={() => onDelete(data.id)}
              data-testid="company-attachment-deleteIcon"
              variant="ghost"
              size="xs"
            >
              <CloseIcon />
            </Button>
          </Box>
        )}
        {showHoverData && (
          <Button data-cy="choose-doc" variant="outline" size="xs" onClick={downloadAttachment}>
            {t('Download')}
          </Button>
        )}
      </Stack>
    </Flex>
  );
};

export default CompanyAttachment;
