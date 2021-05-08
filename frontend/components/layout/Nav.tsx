import Link from 'next/link';
import { useUser } from '../../lib/hooks/useUser';
import { useCart } from '../../lib/providers/cartState';
import SignOut from '../auth/SignOut';
import CartCount from '../cart/CartCount';
import NavStyles from '../styles/NavStyles';

export default function Nav() {
  const user = useUser();
  const { openCart } = useCart();
  return (
    <NavStyles>
      <Link href="/products">Products</Link>
      {user && (
        <>
          <Link href="/sell">Sell</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link>
          <SignOut />
          <button type="button" onClick={openCart}>
            My Cart
            <CartCount
              count={user.cart.reduce(
                (tally, cartItem) =>
                  tally + (cartItem.product ? cartItem.quantity : 0),
                0
              )}
            />
          </button>
        </>
      )}
      {!user && (
        <>
          <Link href="/signin">Sign In</Link>
        </>
      )}
    </NavStyles>
  );
}
