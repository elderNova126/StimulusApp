import { useMutation } from '@apollo/client';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  CircularProgress,
  Flex,
  Input,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import * as R from 'ramda';
import React, { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OtherMutations from '../../graphql/Mutations/OtherMutations';
import ReportQueries from '../../graphql/Queries/ReportQueries';
import { SwitchButton } from '../GenericComponents';
import StimButton from '../ReusableComponents/Button';

const { DATA_FILES_LIST } = ReportQueries;
const { SINGLE_UPLOAD, MULTIPLE_UPLOAD } = OtherMutations;

const storageUri = 'https://stimulusrawdwdev.blob.core.windows.net/templates';
const jsonTemplateUri = `${storageUri}/json.zip`;
const csvTemplateUri = `${storageUri}/csv.zip`;

const DataSourcesUpload = (props: { onClose: () => void; source: string }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { t } = useTranslation();
  const { source } = props;
  const [open, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <div data-testid="dataSourcesJson-container">
      <Box mb="3rem">
        <Breadcrumb aria-label="breadcrumb">
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={() => props.onClose()}>
              <Text color="green">{t('Connected Data Sources')}</Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{source.toUpperCase() + t(' Data Source')}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box>
        <Stack spacing={2} justifyContent="center" alignContent="center">
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Text>{source.toUpperCase() + t(' DATA SOURCES')}</Text>
            <Box marginLeft="10px">
              <Popover returnFocusOnClose={false} isOpen={open} onClose={handleClose}>
                <PopoverTrigger>
                  <HelpOutlineIcon
                    cursor="pointer"
                    htmlColor={open ? '#1BB062' : '#000'}
                    onClick={() => setIsOpen(true)}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <Box p="15px">
                    <Box display="flex" alignItems="flex-end" justifyContent="space-between">
                      <Text>{t('Guide')}</Text>
                      <Link href={`${storageUri}/Stimulus_DataUpload_Guide.docx`} target="_blank">
                        <Text textStyle="body" color="#1BB062" style={{ cursor: 'pointer' }}>
                          {t('Download')}
                        </Text>
                      </Link>
                    </Box>
                    <Box display="flex" alignItems="flex-end" justifyContent="space-between">
                      <Text>{t('Glossary')}</Text>
                      <Link href={`${storageUri}/Stimulus_Data_Glossary.xlsx`} target="_blank">
                        <Text textStyle="body" color="#1BB062" style={{ cursor: 'pointer' }}>
                          {t('Download')}
                        </Text>
                      </Link>
                    </Box>
                  </Box>
                </PopoverContent>
              </Popover>
            </Box>
          </Stack>
          <Text textStyle="body" textAlign="center">
            {t('Add a data source based on our provided template.')}
          </Text>
          <Center>
            <Box boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important">
              <Stack spacing={2}>
                <Flex direction="row-reverse">
                  <Stack direction="row" spacing={2} cursor="pointer" onClick={() => setShowAdvanced(!showAdvanced)}>
                    <Text textStyle="body">{showAdvanced ? t('Basic') : t('Advanced')}</Text>
                    <SwitchButton isChecked={showAdvanced} onClick={(e: any) => e.stopPropagation()} />
                  </Stack>
                </Flex>
                {!showAdvanced ? <BasicUploader source={source} /> : <AdvancedArchiveUploader source={source} />}
              </Stack>
            </Box>
          </Center>
        </Stack>
      </Box>
    </div>
  );
};

const BasicUploader: FC<{ source: string }> = (props) => {
  const { t } = useTranslation();
  const [companyFile, setCompanyFile] = useState<any>(null);
  const [certificationFile, setCertificationFile] = useState<any>(null);
  const [contingencyFile, setContingencyFile] = useState<any>(null);
  const [locationFile, setLocationFile] = useState<any>(null);
  const [contactFile, setContactFile] = useState<any>(null);
  const [insuranceFile, setInsuranceFile] = useState<any>(null);
  const [productFile, setProductFile] = useState<any>(null);
  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);
  const defaultName = useMemo(() => `Archive ${new Date().toDateString()}`, []);
  const [showForm, setShowForm] = useState(true);
  const [uploadFiles, { loading: loadingArchive, error: errorUploading, data: dataResponse }] = useMutation(
    MULTIPLE_UPLOAD,
    {
      onCompleted: () => setShowForm(false),
      onError: () => setShowForm(false),
      update: (cache, { data: { multipleUpload: uploadReport } }) => {
        if (uploadReport.id) {
          const { getUploadReports } = R.clone(cache.readQuery({ query: DATA_FILES_LIST })) as any;

          getUploadReports.results = [{ uploadReport, blob: null }, ...(getUploadReports.results ?? [])];

          cache.writeQuery({
            query: DATA_FILES_LIST,
            data: { getUploadReports: { ...getUploadReports } },
          });
        }
      },
    }
  );

  const isAnyFileSelected =
    companyFile || certificationFile || contingencyFile || locationFile || contactFile || insuranceFile || productFile;
  const { source } = props;

  const submit = () => {
    if (!isAnyFileSelected) {
      setShowError(true);
    } else {
      uploadFiles({
        variables: {
          archiveName: name || defaultName,
          ...(companyFile && { companyFile }),
          ...(certificationFile && { certificationFile }),
          ...(contingencyFile && { contingencyFile }),
          ...(locationFile && { locationFile }),
          ...(contactFile && { contactFile }),
          ...(insuranceFile && { insuranceFile }),
          ...(productFile && { productFile }),
        },
      });
      setShowForm(false);
    }
  };
  let stateContent = null;

  if (loadingArchive) {
    stateContent = <CircularProgress isIndeterminate color="inherit" data-testid="basicDataSourceUpload-loading" />;
  } else if (!showForm) {
    if (errorUploading) {
      stateContent = (
        <React.Fragment>
          <Box>
            <ErrorOutlineIcon />
          </Box>
          <Box>
            <Text textStyle="body">
              {t(
                'There is a Problem Uploading Your zip file. Please check the content and try again. If the problem persists, please contact us.'
              )}
            </Text>
          </Box>
          <Box>
            <StimButton variant="stimOutline" onClick={() => setShowForm(true)}>
              {t('upload again')}
            </StimButton>
          </Box>
        </React.Fragment>
      );
    } else if (dataResponse?.multipleUpload) {
      stateContent = (
        <React.Fragment>
          <Box>
            <CheckOutlinedIcon />
          </Box>
          <Box>
            <Text textStyle="body">{t('Successfully uploaded. We will process the data.')}</Text>
          </Box>
          <Box>
            <StimButton variant="stimOutline" onClick={() => setShowForm(true)}>
              {t('upload again')}
            </StimButton>
          </Box>
        </React.Fragment>
      );
    }
  }

  return !showForm ? (
    stateContent
  ) : (
    <Box padding="5px">
      <Table aria-label="simple table">
        <Thead>
          <Tr>
            <Th>
              <Box {...(showError && !isAnyFileSelected && { minHeight: '30px' })}>{t('Module')}</Box>
            </Th>
            <Th>
              <Box {...(showError && !isAnyFileSelected && { minHeight: '30px' })}>{t('Template')}</Box>
            </Th>
            <Th>
              <Box {...(showError && !isAnyFileSelected && { minHeight: '30px' })}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  {t('Upload Data')}
                </Box>
                <Box position="relative" left="20px">
                  {showError && !isAnyFileSelected && <p className="error">{t('Select at least one file')}</p>}
                </Box>
              </Box>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <BasicTableRow
            source={source}
            label={t('Company')}
            setFile={setCompanyFile}
            fileName={companyFile?.name}
            templateUri={`${storageUri}/company.${source}`}
          />
          <BasicTableRow
            source={source}
            label={t('Certification')}
            setFile={setCertificationFile}
            fileName={certificationFile?.name}
            templateUri={`${storageUri}/certification.${source}`}
          />
          <BasicTableRow
            source={source}
            label={t('Insurance')}
            setFile={setInsuranceFile}
            fileName={insuranceFile?.name}
            templateUri={`${storageUri}/insurance.${source}`}
          />
          <BasicTableRow
            source={source}
            label={t('Contingency')}
            setFile={setContingencyFile}
            fileName={contingencyFile?.name}
            templateUri={`${storageUri}/contingency.${source}`}
          />
          <BasicTableRow
            source={source}
            label={t('Contact')}
            setFile={setContactFile}
            fileName={contactFile?.name}
            templateUri={`${storageUri}/contact.${source}`}
          />
          <BasicTableRow
            source={source}
            label={t('Location')}
            setFile={setLocationFile}
            fileName={locationFile?.name}
            templateUri={`${storageUri}/location.${source}`}
          />
          <BasicTableRow
            source={source}
            label={t('Product')}
            setFile={setProductFile}
            fileName={productFile?.name}
            templateUri={`${storageUri}/product.${source}`}
          />
        </Tbody>
      </Table>
      <Flex direction="row-reverse" alignItems="center">
        <Flex gridGap={'5px'} p="15px">
          <Input
            size="small"
            placeholder={defaultName}
            fontSize="12px"
            p="5px"
            variant="outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <StimButton onClick={submit} size="stimSmall">
            {t('Submit')}
          </StimButton>
        </Flex>
        <Text textStyle="body">{t('give it a name for tracking')}</Text>
      </Flex>
    </Box>
  );
};
const BasicTableRow: FC<{
  source: string;
  label: string;
  fileName?: string;
  setFile: (file: any) => void;
  templateUri: string;
}> = ({ source, fileName, label, templateUri, setFile }) => {
  const { t } = useTranslation();
  const inputRef = useRef<any>(null);

  return (
    <Tr>
      <Td as="th" scope="row">
        {label}
      </Td>
      <Td>
        <Link href={templateUri} target="_blank">
          <Text textStyle="body" color="#1BB062" style={{ cursor: 'pointer' }}>
            {t('Download')}
          </Text>
        </Link>
      </Td>
      <Td>
        <Box>
          <div className="file-input" onClick={() => inputRef.current?.click?.()}>
            <input
              ref={inputRef}
              accept={source === 'csv' ? '.csv' : '.json'}
              type="file"
              onChange={({
                target: {
                  validity,
                  files: [file],
                },
              }: any) => validity.valid && setFile(file)}
              className="file"
            />
            <label>{fileName || t('Select file')}</label>
          </div>
        </Box>
      </Td>
    </Tr>
  );
};
const AdvancedArchiveUploader: FC<{ source: string }> = (props) => {
  const { t } = useTranslation();
  const [uploadArchive, { loading: loadingArchive, error: errorUploading, data: dataResponse }] = useMutation(
    SINGLE_UPLOAD,
    {
      onCompleted: () => setShowForm(false),
      onError: (err) => {
        setShowForm(false);
      },
      update: (cache, { data: { uploadFile: uploadReport } }) => {
        if (uploadReport.id) {
          const { getUploadReports } = R.clone(cache.readQuery({ query: DATA_FILES_LIST })) as any;

          getUploadReports.results = [{ uploadReport, blob: null }, ...(getUploadReports.results ?? [])];

          cache.writeQuery({
            query: DATA_FILES_LIST,
            data: { getUploadReports: { ...getUploadReports } },
          });
        }
      },
    }
  );
  const [file, setFile] = useState<any>(null);
  const [showForm, setShowForm] = useState(true);
  const { source } = props;
  const onChangeFile = ({
    target: {
      validity,
      files: [file],
    },
  }: any) => validity.valid && setFile(file);
  let renderContent = null;

  if (loadingArchive) {
    renderContent = <CircularProgress color="inherit" data-testid="dataSourceUpload-loading" />;
  } else if (!showForm) {
    if (errorUploading) {
      renderContent = (
        <React.Fragment>
          <Box>
            <ErrorOutlineIcon />
          </Box>
          <Box>
            <Text textStyle="body">
              {t(
                'There is a Problem Uploading Your zip file. Please check the content and try again. If the problem persists, please contact us.'
              )}
            </Text>
          </Box>
          <Box>
            <StimButton variant="stimOutline" onClick={() => setShowForm(true)}>
              {t('upload again')}
            </StimButton>
          </Box>
        </React.Fragment>
      );
    } else if (dataResponse?.uploadFile) {
      renderContent = (
        <React.Fragment>
          <Box>
            <CheckOutlinedIcon />
          </Box>
          <Box>
            <Text textStyle="body">{t('Successfully uploaded. We will process the data.')}</Text>
          </Box>
          <Box>
            <StimButton variant="stimOutline" onClick={() => setShowForm(true)}>
              {t('upload again')}
            </StimButton>
          </Box>
        </React.Fragment>
      );
    }
  } else {
    renderContent = (
      <Stack alignItems="center" p="50px">
        <Center>
          <DescriptionOutlinedIcon />
        </Center>
        <Stack justifyContent="center" alignItems="center" direction="column">
          <Text textStyle="body" color="textSecondary">
            {t('Choose file (only zip with ') + source + t(' files)')}:
          </Text>
          <Link href={source === 'json' ? jsonTemplateUri : csvTemplateUri}>
            <Text textStyle="body" color="textSecondary" style={{ cursor: 'pointer' }}>
              {t('Download template')}
            </Text>
          </Link>
        </Stack>
        <Stack alignItems="center" direction="column">
          <input accept=".zip" type="file" onChange={onChangeFile} data-testid="fileInput" />
        </Stack>
        <Box>
          <StimButton
            size="stimSmall"
            onClick={() => {
              if (file) {
                uploadArchive({ variables: { file } });

                setShowForm(false);
              }
            }}
          >
            {t('Submit')}
          </StimButton>
        </Box>
      </Stack>
    );
  }

  return renderContent;
};
export default DataSourcesUpload;
