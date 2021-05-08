import UpdateProduct from '../components/product/UpdateProduct';

export default function UpdatePage({ query }) {
  return (
    <div>
      <UpdateProduct id={query.id} />
    </div>
  );
}
