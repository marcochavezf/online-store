import { useMutation } from '@apollo/client';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import gql from 'graphql-tag';
import React from 'react';
import useForm from '../../lib/hooks/useForm';
import { CURRENT_USER_QUERY } from '../../lib/hooks/useUser';
import AuthLayout from './AuthLayout';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });
  const [signin, { data, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    console.log(inputs);
    const res = await signin();
    console.log(res);
    resetForm();
    // Send the email and password to the graphqlAPI
  }
  const error =
    data?.authenticateUserWithPassword.__typename ===
      'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;
  return (
    <AuthLayout 
      title="Sign in" 
      AvatarIcon={LockOutlinedIcon} 
      error={error}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      loading={loading}
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
      submitLabel="Sign In"
      footerLinks={{
        left: { href: '/reset_password', label: 'Forgot password?' },
        right: { href: '/signup', label: 'Don\'t have an account? Sign Up' },
      }}
    />
  );
}
