import { useMutation } from '@apollo/client';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import gql from 'graphql-tag';
import React from 'react';
import useForm from '../../lib/hooks/useForm';
import AuthLayout from './AuthLayout';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetField, resetForm } = useForm({
    email: '',
    name: '',
    password: '',
  });
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
    // refectch the currently logged in user
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    console.log(inputs);
    const res = await signup().catch(console.error);
    // console.log(res);
    // console.log({ data, loading, error });
    if (res) {
      resetForm();
    } else {
      resetField('password');
    }
    // Send the email and password to the graphqlAPI
  }
  return (
    <AuthLayout 
      title="Sign Up For an Account" 
      AvatarIcon={VpnKeyIcon} 
      error={error}
      successMessage={data?.createUser && `Signed up with ${data.createUser.email} - Please Go Head and Sign in!`}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      loading={loading}
      fields={[
        {
          id: 'name',
          name: 'name',
          label: 'Your Name',
          value: inputs.name,
          type: 'text'
        },
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
      submitLabel="Sign Up"
      footerLinks={{
        left: { href: '/reset_password', label: 'Forgot password?' },
        right: { href: '/signin', label: 'Sign In' },
      }}
    />
  );
}
