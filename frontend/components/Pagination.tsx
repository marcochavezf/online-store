import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import React from 'react';
import { perPage } from '../config';
import DisplayError from './ErrorMessage';

const useStyles = makeStyles((theme) => ({
  pagination: {
    marginTop: '10px',
    marginBottom: '30px',
  },
}));

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export default function CustomPagination({ page }) {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  const router = useRouter();
  const classes = useStyles();
  if (loading) return null;
  if (error) return <DisplayError error={error} />;
  const { count } = data._allProductsMeta;
  const pageCount = Math.ceil(count / perPage);
  return (
    <Pagination 
      page={page}
      count={pageCount}
      size="large"
      className={classes.pagination}
      onChange={(event, page) => router.push(`/products/${page}`)}
    />
  );
}
