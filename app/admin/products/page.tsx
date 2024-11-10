import ProductsTable from "../../../components/admin-components/ProductsTable"
import { fetchProducts } from "@/lib/actions/product.actions"




const Page = async () => {

  const products = await fetchProducts(); 

  return (
    <section className="px-10 py-20 w-full max-[360px]:px-4"> 
      <h1 className="w-full text-heading1-bold drop-shadow-text-blue">Stock</h1> 
      
      <ProductsTable stringifiedProducts={JSON.stringify(products)}/>

    </section>
  )
}

export default Page