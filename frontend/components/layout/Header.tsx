import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { useUser } from '../../lib/hooks/useUser';
import { useDrawer } from '../../lib/providers/drawerState';
import PersistentDrawerLeft from './PersistentDrawerLeft';

const Logo = styled.h1`
  font-size: 4rem;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  background: red;
  transform: skew(-7deg);
  a {
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
  }
`;

const HeaderStyles = styled.header`
  .bar {
    border-bottom: 10px solid var(--black, black);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
  }

  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid var(--black, black);
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default function Header() {
  const user = useUser();
  const router = useRouter();
  const { closeDrawer } = useDrawer();

  const handleClick = href => e => {
    e.preventDefault()
    router.push(href);
    closeDrawer();
  }

  // return <ButtonAppBar />
  return <PersistentDrawerLeft >
    {/* <ListItem button onClick={handleClick('/products')}>
      <ListItemIcon><ListAltIcon /></ListItemIcon>
      <ListItemText primary='Products' />
    </ListItem>
    {user && <ListItem button onClick={handleClick('/sell')}>
      <ListItemIcon><PostAddIcon /></ListItemIcon>
      <ListItemText primary='Sell' />
    </ListItem>} */}
  </PersistentDrawerLeft>

  // return (
  //   <HeaderStyles>
  //     <div className="bar">
  //       <Logo>
  //         <Link href="/">Online Store</Link>
  //       </Logo>
  //       <Nav />
  //     </div>
  //     <div className="sub-bar">
  //       <Search />
  //     </div>
  //     <Cart />
  //   </HeaderStyles>
  // );
}