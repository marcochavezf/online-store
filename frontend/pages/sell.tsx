import PleaseSignIn from '../components/auth/PleaseSignIn';
import CreateProduct from '../components/product/CreateProduct';

export default function SellPage() {
  return (
    <div>
      <PleaseSignIn>
        <CreateProduct />
      </PleaseSignIn>
    </div>
  );
}
