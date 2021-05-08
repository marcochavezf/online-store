import { useMutation } from '@apollo/client';
import { Button, Card, CardContent, createStyles, makeStyles, Theme } from '@material-ui/core';
import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import nProgress from 'nprogress';
import React, { useState } from 'react';
import { CURRENT_USER_QUERY } from '../../lib/hooks/useUser';
import { useCart } from '../../lib/providers/cartState';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: '8px',
    },
    form: {
      display: 'grid',
      gridGap: '1rem',
    },
    cardContent: {
      paddingBottom: '16px !important',
    },
    checkoutButton: {
      marginTop: '1rem'
    }
  }),
);

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const classes = useStyles();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  async function handleSubmit(e) {
    // 1. Stop the form from submitting and turn the loader one
    e.preventDefault();
    setLoading(true);
    console.log('We gotta do some work..');
    // 2. Start the page transition
    nProgress.start();
    // 3. Create the payment method via stripe (Token comes back here if successful)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    console.log(paymentMethod);
    // 4. Handle any errors from stripe
    if (error) {
      setError(error);
      nProgress.done();
      return; // stops the checkout from happening
    }
    // 5. Send the token from step 3 to our keystone server, via a custom mutation!
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });
    console.log(`Finished with the order!!`);
    console.log(order);
    // 6. Change the page to view the order
    router.push({
      pathname: `/order/[id]`,
      query: {
        id: order.data.checkout.id,
      },
    });
    // 7. Close the cart
    closeCart();

    // 8. turn the loader off
    setLoading(false);
    nProgress.done();
  }

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <form className={classes.form} onSubmit={handleSubmit}>
          {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
          {graphQLError && <p style={{ fontSize: 12 }}>{graphQLError.message}</p>}
          <CardElement />
          <Button type="submit" variant="contained" color="primary">
            Check Out Now
          </Button>
        </form>

    </CardContent>
    </Card>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export { Checkout };

