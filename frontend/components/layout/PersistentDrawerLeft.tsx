import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PostAddIcon from '@material-ui/icons/PostAdd';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';
import { useDrawer } from '../../lib/drawerState';
import { useUser } from '../User';
import CustomAppBar from './CustomAppBar';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);

export default function PersistentDrawerLeft({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const { drawerOpen, closeDrawer } = useDrawer();
  const user = useUser();
  const router = useRouter();

  const navigateTo = href => e => {
    e.preventDefault()
    router.push(href);
    closeDrawer();
  }

  return (
    <div className={classes.root}>
      
      <CustomAppBar />

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={closeDrawer}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={navigateTo('/products')}>
            <ListItemIcon><ListAltIcon /></ListItemIcon>
            <ListItemText primary='Products' />
          </ListItem>
          {user && <ListItem button onClick={navigateTo('/sell')}>
            <ListItemIcon><PostAddIcon /></ListItemIcon>
            <ListItemText primary='Sell' />
          </ListItem>}
        </List>
        <Divider />
      </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />

        <Container maxWidth="md">
          {children}
        </Container>

      </main>
    </div>
  );
}
