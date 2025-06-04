import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjectAttachmentUri } from '../../hooks';
import Attachment from './Attachment.interface';
import StimButton from '../ReusableComponents/Button';

const ProjectAttachment = (props: { data: Attachment; onDelete: (id: number) => void }) => {
  const { t } = useTranslation();
  const { data, onDelete } = props;
  const [showHoverData, setShowHoverData] = useState(false);
  const { attachmentUri } = useProjectAttachmentUri(`${data.id}`);
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
    window.URL.revokeObjectURL(url);
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
      justifyContent="space-between"
      onMouseEnter={() => setShowHoverData(true)}
      onMouseLeave={() => setShowHoverData(false)}
      data-cy="project-attachment-container"
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
      <Stack direction="row" spacing={2} alignItems="center">
        {showHoverData && (
          <Box cursor="pointer">
            <StimButton
              onClick={() => onDelete(data.id)}
              data-cy="project-attachment-deleteIcon"
              size="stimSmall"
              variant="stimDestructive"
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

export default ProjectAttachment;
