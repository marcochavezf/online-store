import { useMutation } from '@apollo/client';
import { Button } from '@material-ui/core';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from '../../lib/hooks/useUser';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

export default function AddToCart({ id }) {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <Button disabled={loading} size="small" color="primary" onClick={() => addToCart()}>
      Add{loading && 'ing'} To Cart 🛒
    </Button>
  );
}
