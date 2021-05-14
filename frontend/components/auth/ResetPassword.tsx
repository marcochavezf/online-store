import { useMutation } from '@apollo/client';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import gql from 'graphql-tag';
import React from 'react';
import useForm from '../../lib/hooks/useForm';
import AuthLayout from './AuthLayout';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function ResetPassword({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });
  const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });
  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;
  console.log(error);
  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    console.log(inputs);
    const res = await reset().catch(console.error);
    // console.log(res);
    // console.log({ data, loading, error });
    resetForm();
    // Send the email and password to the graphqlAPI
  }
  return (
    <AuthLayout 
      AvatarIcon={VpnKeyIcon}
      title="Reset Your Password"
      successMessage={data?.redeemUserPasswordResetToken === null && 'Success! You can Now sign in'}
      fields={[
        {
          id: 'email',
          name: 'email',
          label: 'Email Address',
          value: inputs.email,
          type: 'email'
        },
        {
          id: 'password',
          name: 'password',
          label: 'Password',
          value: inputs.password,
          type: 'password'
        },
      ]}
      submitLabel="Request Reset"
      error={error || successfulError}
      footerLinks={{
        left: { href: '/signin', label: 'Sign In' },
        right: { href: '/signup', label: 'Don\'t have an account? Sign Up' },
      }}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      loading={loading}
    />
  );
}
