import { useLazyQuery } from '@apollo/client';
import { CircularProgress, fade, InputBase, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/dist/client/router';
import React from 'react';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    dropDown: {
      position: 'absolute',
      width: '75%',
      zIndex: 2,
      marginLeft: '24px',
      borderLeft: '1px solid var(--lightGrey)',
      borderRight: '1px solid var(--lightGrey)',
    },
    dropDownItem: props => ({
      borderBottom: '1px solid var(--lightGrey)',
      background: props.highlighted ? '#f7f7f7' : 'white',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      transition: theme.transitions.create('all'),
      paddingLeft: props.highlighted ? '2rem' : null,
      '&:hover': {
        paddingLeft: '2rem',
        background: '#f7f7f7',
      },
      '& img': {
        marginRight: '10px',
      },
      '& span': {
        color: 'black'
      }
    }),
    dropDownBlankItem: {
      borderBottom: '1px solid var(--lightGrey)',
      background: 'white',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      '& span': {
        color: 'black'
      }
    }
  }),
);

export default function Search() {
  const router = useRouter();
  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const items = data?.searchTerms || [];
  const findItemsButChill = debounce(findItems, 350);
  resetIdCounter();
  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
    selectItem,
    closeMenu,
  } = useCombobox({
    items,
    onInputValueChange() {
      findItemsButChill({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      closeMenu();
      router.push({
        pathname: `/product/${selectedItem.id}`,
      });
    },
    itemToString: (item) => item?.name || '',
  });
  const classes = useStyles();

  const DropDownItem = ({ highlighted, item, children }) => {
    const classes = useStyles({ highlighted });
    return (<div 
      {...getItemProps({ item })} 
      className={classes.dropDownItem}
      key={item.id}
      onClick={() => selectItem(item)}
    >
      {children}
    </div>)
  };

  return (
    <div>
      <div className={classes.search} {...getComboboxProps()}>
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
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an Item',
            id: 'search',
          })}
        />
      </div>

      <div className={classes.dropDown} {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem key={index} highlighted={index === highlightedIndex} item={item}>
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width="50"
              />
              <span>{item.name}</span>
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <div className={classes.dropDownBlankItem}>
            <span>Sorry, No items found for <b>{inputValue}</b></span>
          </div>
        )}
        {isOpen && loading && (
          <div className={classes.dropDownBlankItem}>
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
}
