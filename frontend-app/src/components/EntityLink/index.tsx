import { Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/react';
import { Link } from '@reach/router';
import { useTranslation } from 'react-i18next';

export const AlertLink = (props: {
  entityId: string;
  name: string;
  class?: string;
  target: string;
  dashboard?: boolean;
}) => {
  const { t } = useTranslation();
  const stringLength = props?.target === 'projects' ? 10 : 23;
  return (
    <Link
      state={{ breadcrumb: { name: t('Home'), href: '/' } }}
      to={`/${props?.target}/${props?.entityId}`}
      data-testid="alert-link"
    >
      <Tooltip
        label={props?.name}
        visibility={!!props.name && props?.name?.length >= stringLength && props?.dashboard ? 'visible' : 'hidden'}
        bg="white"
        color="black"
        border="1px"
        borderColor="#E0E0E0"
      >
        <Text
          _hover={{ color: 'green.500' }}
          whiteSpace="nowrap"
          fontWeight={props?.dashboard ? '400' : 'bold'}
          display={'inline'}
          textOverflow="ellipsis"
          maxW="240px"
          fontSize={props?.dashboard ? '12px' : ''}
          overflow="hidden"
        >
          {!!props.name && props?.dashboard && props?.name?.length >= stringLength
            ? props?.name.slice(0, stringLength) + '...'
            : props?.name}
        </Text>
      </Tooltip>
    </Link>
  );
};

export const CompanyLink = (props: { id: string; name: string; class?: string; dashboard?: boolean }) => (
  <AlertLink entityId={props?.id} name={props?.name} target="company" dashboard={props?.dashboard} />
);

export const ProjectLink = (props: { id: string; name: string; class?: string; dashboard?: boolean }) => (
  <AlertLink entityId={props?.id} name={props?.name} target="project" dashboard={props?.dashboard} />
);
// Change this after Listo permissions are implemented
export const ListLink = (props: { id: string; name: string; class?: string; dashboard?: boolean }) => (
  <AlertLink
    entityId={`lists/${props?.id}/list/1` ?? ''}
    name={`${props?.name} List`}
    target="companies"
    dashboard={props?.dashboard}
  />
);

export const CommonLink = (props: { name: string; target?: string; class?: string }) => {
  const { t } = useTranslation();
  const { name, target } = props;
  return (
    <Link
      state={{ breadcrumb: { name: t('Home'), href: '/' } }}
      to={`/${target ? target : name}`}
      data-testid={`${name}-link`}
    >
      {props.name}
    </Link>
  );
};
