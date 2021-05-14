import { useQuery } from '@apollo/client';
import { Card, CircularProgress, createStyles, makeStyles, Theme } from '@material-ui/core';
import gql from 'graphql-tag';
import Head from 'next/head';
import React from 'react';
import ErrorMessage from '../../components/ErrorMessage';
import formatMoney from '../../lib/formatMoney';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: '2rem',
      borderTop: `10px solid ${ theme.palette.secondary.main }`,
      '& > p': {
        display: 'grid',
        gridTemplateColumns: '1fr 5fr',
        margin: 0,
        borderBottom: '1px solid var(--offWhite)',
        '& span' : {
          padding: '1rem',
          '&:first-child': {
            fontWeight: 900,
            textAlign: 'right',
          }
        }
      }
    },
    orderItem: {
      borderBottom: '1px solid var(--offWhite)',
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      alignItems: 'center',
      gridGap: '2rem',
      margin: '2rem 0',
      paddingBottom: '2rem',
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }
    }
  }),
);

export default function SingleOrderPage({ query }) {
  const classes = useStyles();
  const { data, error, loading } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id: query.id },
  });
  if (loading) return <CircularProgress />;
  if (error) return <ErrorMessage error={error} />;
  const { order } = data;
  return (
    <Card className={classes.paper}>
      <Head>
        <title>Online Store - {order.id}</title>
      </Head>
      <p>
        <span>Order Id:</span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(order.total)}</span>
      </p>
      <p>
        <span>Item Count:</span>
        <span>{order.items.length}</span>
      </p>
      <div>
        {order.items.map((item) => (
          <div className={classes.orderItem} key={item.id}>
            <img src={item.photo.image.publicUrlTransformed} alt={item.title} />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Sub Total: {formatMoney(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
