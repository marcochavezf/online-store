import { useMutation } from '@apollo/client';
import {
  Button, CircularProgress,
  Grid,
  Paper,
  TextField
} from '@material-ui/core';
import gql from 'graphql-tag';
import Router from 'next/router';
import React from 'react';
import useForm from '../../lib/hooks/useForm';
import DisplayError from '../ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # Which variables are getting passed in? And What types are they
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    image: '',
    name: '',
    price: '',
    description: '',
  });
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );
  return (
    <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // Submit the inputfields to the backend:
          const res = await createProduct();
          clearForm();
          // Go to that product's page!
          Router.push({
            pathname: `/product/${res.data.createProduct.id}`,
          });
        }}
      >
        <Paper style={{ padding: 16 }}>
          <Grid container alignItems="flex-start" spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                name="name"
                id="name"
                type="text"
                label="Name"
                value={inputs.name}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Price (in cents)"
                type="number"
                id="price"
                name="price"
                placeholder="price"
                value={inputs.price}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                multiline
                label="Description"
                value={inputs.description}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="image"
                id="image"
                type="file"
                label="Image"
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item style={{ marginTop: 16 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                + Add Product
              </Button>
            </Grid>
            { loading && (
              <Grid item style={{ marginTop: 16 }}>
                <CircularProgress />
              </Grid>) }
          </Grid>
        </Paper>
        <DisplayError error={error} />
      </form>
    </div>
  );
}
