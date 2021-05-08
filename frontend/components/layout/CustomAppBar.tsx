import { Badge, Menu } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser } from '../../lib/hooks/useUser';
import { useCart } from '../../lib/providers/cartState';
import { useDrawer } from '../../lib/providers/drawerState';
import SignOut from '../auth/SignOut';
import Search from './Search';

const drawerWidth = 240;
const menuId = 'primary-search-account-menu';
const mobileMenuId = 'primary-search-account-menu-mobile';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    grow: {
      flexGrow: 1,
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }),
);

export default function CustomAppBar() {
  const classes = useStyles();
  const { drawerOpen, openDrawer, closeDrawer } = useDrawer();
  const user = useUser();
  const router = useRouter();
  const { toggleCart } = useCart();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

  const getTotalCartItems = (user) => user && user.cart.reduce((tally, cartItem) => tally + (cartItem.product ? cartItem.quantity : 0), 0);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const navigateTo = href => e => {
    e.preventDefault()
    router.push(href);
    closeDrawer();
    handleMenuClose();
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user ? [
        <MenuItem key="1" onClick={navigateTo('/orders')}>My Orders</MenuItem>,
        <SignOut key="2" postSignOut={handleMenuClose} />
      ] : [
        <MenuItem key="1" onClick={navigateTo('/signin')}>Sign In</MenuItem>,
        <MenuItem key="2" onClick={navigateTo('/signup')}>Sign Up</MenuItem>,
        <MenuItem key="3" onClick={navigateTo('/reset_password')}>Reset Password</MenuItem>,
      ]}
    </Menu>
  );

  const cartMenuItem = (
    <MenuItem key="cart" onClick={toggleCart}>
      <IconButton aria-label={`show ${getTotalCartItems(user)} cart items`} color="inherit">
        <Badge badgeContent={getTotalCartItems(user)} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <p>Cart</p>
    </MenuItem>
  );
  const profileMenuItem = (
    <MenuItem key="profile" onClick={handleProfileMenuOpen}>
      <IconButton
        aria-label="account of current user"
        aria-controls="primary-search-account-menu"
        aria-haspopup="true"
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <p>Profile</p>
    </MenuItem>
  );

  const menuItems = user ? [cartMenuItem, profileMenuItem] : [profileMenuItem];
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {menuItems}
    </Menu>
  );

  return (<AppBar
    position="fixed"
    className={clsx(classes.appBar, {
      [classes.appBarShift]: drawerOpen,
    })}
  >
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={openDrawer}
        edge="start"
        className={clsx(classes.menuButton, drawerOpen && classes.hide)}
      >
        <MenuIcon />
      </IconButton>

      <Typography variant="h6" noWrap>
        Online Store
      </Typography>

      <Search />

      <div className={classes.grow} />
      <div className={classes.sectionDesktop}>

        {user && (
          <IconButton
            aria-label={`show ${getTotalCartItems(user)} cart items`}
            onClick={toggleCart}
            color="inherit">
            <Badge badgeContent={getTotalCartItems(user)} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        )}

        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </div>

      <div className={classes.sectionMobile}>
        <IconButton
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
      </div>

    </Toolbar>

    {renderMobileMenu}
    {renderMenu}

  </AppBar>)
}