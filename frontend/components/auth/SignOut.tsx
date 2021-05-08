import { useMutation } from '@apollo/client';
import { MenuItem } from '@material-ui/core';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from '../../lib/hooks/useUser';

const SIGN_OUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export default function SignOut({ postSignOut }: { postSignOut: () => void }) {
  const [signout] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const handleClick = () => {
    signout();
    postSignOut();
  }
  return (
    <MenuItem onClick={handleClick}>Sign Out</MenuItem>
  );
}
