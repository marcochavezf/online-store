import { Badge, InputBase, Menu } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCart } from '../../lib/cartState';
import { useDrawer } from '../../lib/drawerState';
import Search from '../Search';
import SignOut from '../SignOut';
import { useUser } from '../User';

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
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
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

      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>

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