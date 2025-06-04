import React, { memo } from 'react';
import Pagination from './pagination';
import { Theme, createStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import useStyles from './style';
import clsx from 'clsx';
import * as R from 'ramda';
import {
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Typography,
  withStyles,
  Grid,
} from '@material-ui/core';

interface TableHeaderProps {
  label?: string;
  align?: string;
  mappedKey: string;
  subtitleKey?: string;
  keyClass?: string;
  subtitleClass?: string;
  cellClass?: string;
}
const tableTypeValues = {
  regular: 'regular',
  painted: 'painted',
  small: 'small',
  smallPainted: 'smallPainted',
  regularSmallPadding: 'regularSmallPadding',
};
type TableVariant = 'regular' | 'painted' | 'small' | 'smallPainted' | 'regularSmallPadding';

interface TableProps {
  className?: string;
  disablePadding?: boolean;
  order?: {
    orderAscDirection: boolean;
    orderBy: string;
    onChangeDirection: (p: any) => void;
  };
  variant: TableVariant;
  content: {
    showHeaders: boolean;
    headers: TableHeaderProps[];
    rows: { [key: string]: any }[];
    onRowClick?: (id: any) => void;
    actions?: {
      label: string | ((data: any) => string);
      className?: string;
      onClick: (event: React.MouseEvent<HTMLButtonElement> | null, row: any) => void;
    }[];
    actionsCellClass?: any;
    ActionComponent?: any;
  };
  pagination?: {
    count: number;
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions?: any[];
    onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };
}

const StyledTableCell = (variant: TableVariant, disablePadding?: boolean) =>
  withStyles((theme: Theme) => {
    const body = {
      fontSize: 14,
      padding: 24,
      paddingLeft: 24,
      paddingRight: 24,
    };

    if (variant === tableTypeValues.small || variant === tableTypeValues.smallPainted) {
      body.padding = 12;
      body.fontSize = 16;
    }

    if (variant === tableTypeValues.regularSmallPadding) {
      body.padding = 15;
    }

    if (disablePadding) {
      body.paddingLeft = 0;
      body.paddingRight = 0;
    }
    return createStyles({ body });
  })(TableCell);

const StyledTableRow = (variant: TableVariant, isClickable = false) =>
  withStyles((theme: Theme) => {
    let variantStyle = {};
    let additionalStyle = {};

    if (variant === tableTypeValues.painted || variant === tableTypeValues.smallPainted) {
      variantStyle = {
        '&:nth-last-child(1)': {
          backgroundColor: '#88C28F',
          '& > td > p': {
            fontWeight: 'bold',
            color: theme.palette.common.white,
          },
        },
        '&:nth-child(1)': {
          backgroundColor: '#88C28F',
          '& > td > p': {
            fontWeight: 'bold',
            color: theme.palette.common.white,
          },
        },
      };
    }

    if (isClickable) {
      additionalStyle = {
        cursor: 'pointer',
      };
    }

    return createStyles({
      root: {
        '&:nth-of-type(odd)': {
          backgroundColor: '#F9FEFB',
        },
        ...variantStyle,
        ...additionalStyle,
      },
    });
  })(TableRow);

const GenericTable = (props: TableProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { content, variant, pagination, order, disablePadding } = props;
  const { headers, showHeaders, rows, actions, actionsCellClass, onRowClick, ActionComponent } = content;

  let renderHeader = null;
  let renderFooter = null;
  let renderToolbar = null;

  if (typeof pagination !== 'undefined' && rows.length) {
    renderFooter = (
      <>
        {/* <TableFooter> */}
        {/* <TableRow> */}
        <Pagination {...pagination} />
        {/* </TableRow> */}
        {/* </TableFooter> */}
      </>
    );
  }

  if (showHeaders) {
    let actionsHeader;
    let actionComponent;
    if (typeof actions !== 'undefined') {
      actionsHeader = (
        <TableCell className={classes.coloredCell} align="center">
          {t('Actions')}
        </TableCell>
      );
    }
    if (typeof ActionComponent !== 'undefined') {
      actionComponent = (
        <TableCell className={classes.coloredCell} align="center" colSpan={2}>
          <ActionComponent />
        </TableCell>
      );
    }

    renderHeader = (
      <TableHead>
        <TableRow data-testid="table-row">
          {headers.map((header: TableHeaderProps, i) => {
            const { label = '', align = 'left' } = header;
            return (
              <TableCell key={label} align={align as any}>
                {label}
              </TableCell>
            );
          })}
          {actionsHeader}
          {actionComponent}
        </TableRow>
      </TableHead>
    );
  }

  if (typeof order !== 'undefined') {
    renderToolbar = (
      <Toolbar className={classes.toolBar}>
        <Grid container direction="row-reverse">
          <span className={classes.icon} onClick={order.onChangeDirection}>
            <Typography variant="subtitle2" align="inherit" color="textSecondary" className={classes.order}>
              {t('Order by')} {order.orderBy}
              {order.orderAscDirection ? (
                <ArrowDropUpIcon className={classes.orderIcon} fontSize="small" />
              ) : (
                <ArrowDropDownIcon className={classes.orderIcon} fontSize="small" />
              )}
            </Typography>
          </span>
        </Grid>
      </Toolbar>
    );
  }

  const handleRowClick = (id: any) => {
    if (typeof onRowClick !== 'undefined') {
      onRowClick(id);
    }
  };

  const StyledRow = StyledTableRow(variant, typeof onRowClick !== 'undefined');
  const StyledCell = StyledTableCell(variant, disablePadding);

  return (
    <div className={classes.root} data-testid="genericTable">
      {renderToolbar}
      <TableContainer className={props.className}>
        <Table className={classes.table}>
          {renderHeader}
          <TableBody>
            {rows.map((row: any, rowIndex: number) => (
              <StyledRow data-testid="table-row" onClick={(event) => handleRowClick(row.id)} key={rowIndex}>
                {headers.map((header: TableHeaderProps, i: number) => {
                  const {
                    label = '',
                    align = 'left',
                    mappedKey,
                    subtitleKey,
                    keyClass,
                    subtitleClass,
                    cellClass,
                  } = header;

                  return (
                    <StyledCell key={label + i} align={align as any} className={cellClass || ''}>
                      <span className={keyClass || ''}>{row[mappedKey]}</span>
                      {subtitleKey ? (
                        typeof row[subtitleKey] === 'object' ? (
                          row[subtitleKey]
                        ) : (
                          <Typography color="textSecondary" className={clsx(classes.subtitle, subtitleClass || '')}>
                            {row[subtitleKey]}
                          </Typography>
                        )
                      ) : null}
                    </StyledCell>
                  );
                })}
                {actions ? (
                  <StyledCell data-testid="action-cell" align="right" colSpan={1} className={actionsCellClass ?? ''}>
                    {actions.map((action, i) => {
                      let { label } = action;
                      if (typeof label === 'function') {
                        label = label(row);
                      }
                      if (!label.length) {
                        return null;
                      }
                      return (
                        <b
                          onClick={(e: any) => action.onClick(e, row)}
                          key={`${action.label}_${i}`}
                          className={clsx(classes.actionCellItem, action.className, classes.actionCell)}
                        >
                          {label}
                        </b>
                      );
                    })}
                  </StyledCell>
                ) : null}
                {typeof ActionComponent !== 'undefined' ? (
                  <StyledCell className={classes.actionCell} align="right" colSpan={1}>
                    <ActionComponent row={row} />
                  </StyledCell>
                ) : null}
              </StyledRow>
            ))}
          </TableBody>
        </Table>
        {renderFooter}
      </TableContainer>
    </div>
  );
};

export default memo(GenericTable, (prev, next) => R.equals(prev.content.rows, next.content.rows));
