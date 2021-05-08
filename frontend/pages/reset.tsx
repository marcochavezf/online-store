import { any } from 'prop-types';
import RequestReset from '../components/auth/RequestReset';
import ResetPassword from '../components/auth/ResetPassword';

export default function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        <p>Sorry you must supply a token</p>
        <RequestReset />
      </div>
    );
  }
  return (
    <div>
      <ResetPassword token={query.token} />
    </div>
  );
}

ResetPage.propTypes = {
  query: any,
};
