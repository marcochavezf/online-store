import { useMutation } from '@apollo/client';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import gql from 'graphql-tag';
import React from 'react';
import useForm from '../../lib/hooks/useForm';
import AuthLayout from './AuthLayout';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });
  const [requestReset, { data, loading, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
      // refectch the currently logged in user
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    console.log(inputs);
    const res = await requestReset().catch(console.error);
    console.log(res);
    console.log({ data, loading, error });
    resetForm();
    // Send the email and password to the graphqlAPI
  }
  return (
    <AuthLayout 
      AvatarIcon={VpnKeyIcon}
      title="Request a Password Reset"
      successMessage={data?.sendUserPasswordResetLink === null && 'Success! Check your email for a link!'} 
      fields={[
        {
          id: 'email',
          name: 'email',
          label: 'Email Address',
          value: inputs.email,
          type: 'email'
        },
      ]}
      submitLabel="Request Reset"
      footerLinks={{
        left: { href: '/signin', label: 'Sign In' },
        right: { href: '/signup', label: 'Don\'t have an account? Sign Up' },
      }}
      error={error}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      loading={loading}
    />
  );
}
