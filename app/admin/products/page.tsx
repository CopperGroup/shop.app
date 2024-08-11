import ProductsTable from "../../../components/admin-components/ProductsTable"
import { fetchProducts } from "@/lib/actions/product.actions"




const Page = async () => {

  const products = await fetchProducts(); 

  return (
    <section className="px-10 py-20 w-full"> 
      <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Товар</h1>
      <div className="w-full h-[2px] bg-gray-400 mt-20 rounded-lg"></div>
      
      
      <ProductsTable stringifiedProducts={JSON.stringify(products)}/>

    </section>
  )
}

export default Page