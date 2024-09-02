import EditProduct from "@/components/forms/EditProduct";
import { getProductsProperities } from "@/lib/actions/product.actions";

const Page = async ({ params }: { params: { id: string } }) => {
    if(!params.id) return null;
    
    const productProperities = await getProductsProperities(params.id, "json");

    return (
      <section className="px-10 py-20">
        <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Редагувати товар</h1>
        <div className="mt-16">
          <EditProduct productProperities={productProperities as string}/>
        </div>
      </section>
    )
  }
  
  export default Page;