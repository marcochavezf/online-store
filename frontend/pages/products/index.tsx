import { useRouter } from 'next/dist/client/router';
import CustomPagination from '../../components/Pagination';
import Products from '../../components/product/Products';

export default function ProductsPage() {
  const { query } = useRouter();
  const page = parseInt(query.page || 1);
  return (
    <div>
      <CustomPagination page={page} />
      <Products page={page} />
    </div>
  );
}
