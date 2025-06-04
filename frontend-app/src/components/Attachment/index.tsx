import { Box, Input, Stack, Text, Checkbox } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './style';
import AttachedDocument, { Attachment, AttachmentURIHook } from './AttachedDocument';
import StimButton from '../ReusableComponents/Button';

interface AttachmentPropsInterface {
  handleAttachmentUpload: (file: File[], isPrivate: boolean) => Promise<boolean>;
  handleAttachmentDelete: (id: number) => Promise<boolean>;
  attachments: Attachment[];
  isDeleting: boolean;
  loading: boolean;
  useAttachmentURI: (id: string) => AttachmentURIHook;
}

const Attachments = ({
  handleAttachmentUpload,
  handleAttachmentDelete,
  attachments,
  isDeleting,
  loading,
  useAttachmentURI,
}: AttachmentPropsInterface) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [fileToUpload, setFileToUpload] = useState<File[]>();
  const [isPrivate, setIsPrivate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileCapture = ({ target }: any) => {
    setFileToUpload(Array.from(target.files));
  };

  const onFileUpload = async () => {
    if (await handleAttachmentUpload(fileToUpload!, isPrivate)) {
      setFileToUpload(undefined);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Stack id="attachment">
      <Stack spacing={1}>
        {attachments.map((attachmentItem: Attachment) => (
          <AttachedDocument
            key={attachmentItem.id}
            data={attachmentItem}
            isDeleting={isDeleting}
            onDelete={(id: number) => handleAttachmentDelete(id)}
            useAttachmentURI={useAttachmentURI}
          />
        ))}
      </Stack>
      <Box mt="1rem">
        <Input
          ref={fileInputRef}
          display="none"
          data-cy="choose-doc-input"
          accept=".pdf, .csv, .doc, .xls, .docx, .xlsx"
          type="file"
          multiple
          onChange={handleFileCapture}
        />
        <label>
          <StimButton
            data-cy="choose-doc"
            size="stimSmall"
            variant="stimOutline"
            as="span"
            cursor="pointer"
            onClick={handleButtonClick}
          >
            {t('Choose Docs')}
          </StimButton>
        </label>
        {fileToUpload && fileToUpload.length !== 0 && (
          <>
            <StimButton
              isLoading={loading}
              data-cy="upload-doc"
              className={classes.uploadFileButton}
              variant="stimOutline"
              size="stimSmall"
              disabled={loading}
              onClick={onFileUpload}
            >
              {t('Upload Docs')}
            </StimButton>
            <Checkbox
              className={classes.checkBox}
              isChecked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            >
              {t('Private')}
            </Checkbox>
            <Text as="h5" textStyle="h6" pt="5px">
              <ul>
                {fileToUpload.map((file, idx) => (
                  <li key={file.name + idx}>
                    <a href={URL.createObjectURL(file)} target="_blank" rel="noreferrer">
                      <b>{file.name}</b>
                    </a>
                  </li>
                ))}
              </ul>
            </Text>
          </>
        )}
        <Text as="h6" textStyle="h6" pt="5px">
          {t('Acceptable document file types include doc, docx, pdf, excel, CSV, 50MB limit.')}
        </Text>
      </Box>
    </Stack>
  );
};

export default Attachments;
