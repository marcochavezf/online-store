import { useQuery } from '@apollo/client';
import { CardActionArea, CircularProgress, createStyles, Theme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import ErrorMessage from '../components/ErrorMessage';
import formatMoney from '../lib/formatMoney';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 275,
    },
    totalItems: {
      borderBottom: `2px solid ${ theme.palette.secondary.main }`,
      marginBottom: '1rem',
      paddingBottom: '1rem',
    },
    totalProducts: {
      paddingBottom: '0.5rem',
    },
    images: {
      display: 'grid',
      gridGap: '10px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
      marginTop: '1rem',
      '& img': {
        height: '200px',
        objectFit: 'cover',
        width: '100%'
      }
    },
    ul: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gridGap: '4rem',
    },
  })
);

export const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

function countItemsInAnOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {
  const classes = useStyles();
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);
  if (loading) return <CircularProgress />;
  if (error) return <ErrorMessage error={error} />;
  const allOrders = data.allOrders.filter(order => order.items.length); // TODO: remove empty orders from database when all products are deleted
  return (
    <div>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <ul className={classes.ul}>
        {allOrders.map((order) => (
          <Card key={order.id} className={classes.root}>
            <CardActionArea onClick={() => Router.push(`/order/${order.id}`)}>
              <div className={classes.images}>
                {order.items.map((item) => (
                  <img
                    key={item.id}
                    src={item.photo?.image?.publicUrlTransformed}
                    alt={item.name}
                  />
                ))}
              </div>
              <CardContent>
                <Typography className={classes.totalProducts} variant="h5" component="h2">
                  {order.items.length} Product
                  {order.items.length === 1 ? '' : 's'}
                </Typography>
                <Typography className={classes.totalItems} color="textSecondary">
                  {countItemsInAnOrder(order)} Items
                </Typography>
                <Typography variant="body2" component="p">
                  Total: {formatMoney(order.total)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </ul>
    </div>
  );
}
