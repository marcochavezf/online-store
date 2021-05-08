import { useMutation } from '@apollo/client';
import { IconButton, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import gql from 'graphql-tag';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  button: {
    width: '50px', 
    height: '50px'
  }
}));

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const classes = useStyles();
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update,
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id,
    //   },
    // },
  });
  return (
    <IconButton 
      className={classes.button}
      onClick={() => removeFromCart()}
      disabled={loading}
      aria-label="delete">
      <DeleteIcon />
    </IconButton>
  );
}
