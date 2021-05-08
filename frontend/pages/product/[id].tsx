import SingleProduct from '../../components/product/SingleProduct';

export default function SingleProductPage({ query }) {
  return <SingleProduct id={query.id} />;
}
