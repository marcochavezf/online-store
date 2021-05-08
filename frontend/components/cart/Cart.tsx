import { Avatar, Container, CssBaseline, Divider, Drawer, makeStyles, Typography } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import React from 'react';
import styled from 'styled-components';
import calcTotalPrice from '../../lib/calcTotalPrice';
import formatMoney from '../../lib/formatMoney';
import { useUser } from '../../lib/hooks/useUser';
import { useCart } from '../../lib/providers/cartState';
import { Checkout } from './Checkout';
import RemoveFromCart from './RemoveFromCart';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
  }
  h3,
  p {
    margin: 0;
  }
`;

function CartItem({ cartItem }) {
  const { product } = cartItem;
  if (!product) return null;
  return (
    <CartItemStyles>
      <img
        width="100"
        src={product.photo.image.publicUrlTransformed}
        alt={product.name}
      />
      <div>
        <Typography component="h3" variant="h6">
          {product.name}
        </Typography>
        <Typography>
          Price: {formatMoney(product.price)}
        </Typography>
        <Typography>
          Quantity: {cartItem.quantity}
        </Typography>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  cartList: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  checkout: {
    marginTop: theme.spacing(6),
  },
}));

export default function Cart() {
  const classes = useStyles();
  const me = useUser();
  const { cartOpen, closeCart } = useCart();
  if (!me) return null;
  return (
    <Drawer anchor={'right'} open={cartOpen} onClose={closeCart}>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <ShoppingCartIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {me.name}'s Cart
          </Typography>
        </div>

        <Divider />

        <div className={classes.cartList}>
        <ul>
          {me.cart.map((cartItem) => (
            <CartItem key={cartItem.id} cartItem={cartItem} />
          ))}
        </ul>
        </div>
        <Divider />

        <footer className={classes.checkout}>
        <Typography component="h3" variant="h6">
          Total: {formatMoney(calcTotalPrice(me.cart))}
        </Typography>

        <Checkout />
        
        </footer>
        <Divider />

      </Container>
    </Drawer>
  );
}
