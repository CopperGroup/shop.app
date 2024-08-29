import { findAllProductsCategories } from "@/lib/actions/product.actions";

const Page = async () => {

  const categories = await findAllProductsCategories();
  return (
    <div>Page</div>
  )
}

export default Page;