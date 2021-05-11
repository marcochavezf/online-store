import { useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import DisplayError from '../ErrorMessage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap', 
      flexDirection: 'row',
      marginTop: '25px',
    },
    breadcrumbs: {
      marginTop: '10px',
    },
    content: {
      flexGrow: 1,
    },
    cover: {
      height: '400px',
      flexGrow: 3,
      minWidth: '300px',
    },
  }),
);

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function SingleProduct({ id }) {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id,
    },
  });
  if (loading) return <CircularProgress />;
  if (error) return <DisplayError error={error} />;
  const { Product } = data;
  // console.log(Product);
  return (
    <>
    <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
      <Link color="inherit" onClick={() => router.push('/products')}>
        Products
      </Link>
      <Link
        color="textPrimary"
        underline="none"
      >
        {Product.name}
      </Link>
    </Breadcrumbs>
    <Card className={classes.root}>
      <Head>
        <title>Online Store | {Product.name}</title>
      </Head>
      <CardMedia
        className={classes.cover}
        image={Product.photo.image.publicUrlTransformed}
        title={Product.photo.altText}
      />
      <CardContent className={classes.content}>
        <Typography component="h5" variant="h5">
          {Product.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {Product.description}
        </Typography>
      </CardContent>
    </Card>
    
    </>
  );
}