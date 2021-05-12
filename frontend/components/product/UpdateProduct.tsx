import { useMutation, useQuery } from '@apollo/client';
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

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

// form example using react-final-form: https://codesandbox.io/s/9ywq085k9w?file=/src/index.js
export default function UpdateProduct({ id }) {
  // 1. We need to get the existing product
  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });
  // 2. We need to get the mutation to update the product
  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);
  // 2.5 Create some state for the form inputs:
  const { inputs, handleChange, clearForm, resetForm } = useForm(
    data?.Product || {
      name: '',
      description: '',
      price: '',
    }
  );
  console.log(inputs);
  if (loading) return <CircularProgress />;
  // 3. We need the form to handle the updates
  return (
    <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await updateProduct({
            variables: {
              id,
              name: inputs.name,
              description: inputs.description,
              price: inputs.price,
            },
          }).catch(console.error);
          // console.log(res);
          if (res) {
            // Go to that product's page!
            Router.push({
              pathname: `/product/${id}`,
            });
          }
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
                disabled={updateLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Price"
                type="number"
                id="price"
                name="price"
                placeholder="price"
                value={inputs.price}
                onChange={handleChange}
                disabled={updateLoading}
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
                disabled={updateLoading}
              />
            </Grid>
            <Grid item style={{ marginTop: 16 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={updateLoading}
              >
                Update Product
                </Button>
            </Grid>
            { updateLoading && (
              <Grid item style={{ marginTop: 16 }}>
                <CircularProgress />
              </Grid>) }
          </Grid>
        </Paper>
        <DisplayError error={error || updateError} />
      </form>
    </div>
  );
}