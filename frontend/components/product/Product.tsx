import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import React from 'react';
import formatMoney from '../../lib/formatMoney';
import AddToCart from './AddToCart';
import DeleteProduct from './DeleteProduct';

const useStyles = makeStyles({
  cardMedia: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  }
});

export default function Product({ product }) {
  const classes = useStyles();
  const router = useRouter();
  return (
    <Card>
      <CardActionArea onClick={() => router.push(`/product/${product.id}`)}>
        <CardMedia
          component="img"
          alt={product.name}
          height="140"
          src={product?.photo?.image?.publicUrlTransformed}
          title={product.name}
          className={classes.cardMedia}
        />
        {/* <Divider light /> */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
          <Typography>
            {formatMoney(product.price)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button 
          size="small"
          color="primary"
          onClick={() => router.push({
            pathname: '/update',
            query: { id: product.id },
          })}>
          Edit ✏️
        </Button>
        <AddToCart id={product.id} />
        <DeleteProduct id={product.id}>Delete</DeleteProduct>
      </CardActions>
    </Card>
  );
}