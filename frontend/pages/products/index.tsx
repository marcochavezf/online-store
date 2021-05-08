import { useRouter } from 'next/dist/client/router';
import Pagination from '../../components/Pagination';
import Products from '../../components/product/Products';

export default function ProductsPage() {
  const { query } = useRouter();
  const page = parseInt(query.page || 1);
  return (
    <div>
      <Pagination page={page} />
      <Products page={page} />
      <Pagination page={page} />
    </div>
  );
}
