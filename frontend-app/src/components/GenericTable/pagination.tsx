import React, { memo } from 'react';
import { TablePagination } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  count: number;
  rowsPerPage: number;
  page: number;
  rowsPerPageOptions?: any[];
  onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Pagination = (props: PaginationProps) => {
  const { t } = useTranslation();
  const { rowsPerPageOptions, count, rowsPerPage, page, onChangePage, onChangeRowsPerPage } = props;

  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions || [3, 5, 10, 100, 500, 1000]}
      colSpan={3}
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      SelectProps={{
        inputProps: { 'aria-label': t('rows per page') },
        native: true,
      }}
      onPageChange={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      component="div"
    />
    // <>asd</>
  );
};

export default memo(Pagination);
