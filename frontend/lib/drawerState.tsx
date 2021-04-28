import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext(null);
const LocalStateProvider = LocalStateContext.Provider;

type DrawerFunction = () => void;

function DrawerStateProvider({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer: DrawerFunction = () => {
    setDrawerOpen(true);
  };

  const closeDrawer: DrawerFunction = () => {
    setDrawerOpen(false);
  };

  const toggleDrawer: DrawerFunction = () => {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <LocalStateProvider
      value={{ drawerOpen, setDrawerOpen, openDrawer, closeDrawer, toggleDrawer }}
    >
      {children}
    </LocalStateProvider>
  );
}



function useDrawer(): { drawerOpen: boolean, setDrawerOpen: DrawerFunction, openDrawer: DrawerFunction, closeDrawer: DrawerFunction, toggleDrawer: DrawerFunction } {
  const all = useContext(LocalStateContext);
  return all;
}
export { DrawerStateProvider, useDrawer };

