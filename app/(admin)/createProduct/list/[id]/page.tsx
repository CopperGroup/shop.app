import ListProduct from "@/components/admin-components/create-product/ListProduct";
import { getProduct } from "@/lib/actions/product.actions";




const Page = async ({ params }: { params: { id: string } }) => {
    if(!params.id) return null;

    const product = await getProduct(params.id);
    
    return (
      <section className="px-10 py-20 h-full">
          <h1 className="text-heading1-bold drop-shadow-text-blue">Інформація про товар</h1>
     
          <ListProduct
                id={product.id}
                name={product.name}
                images={product.images}
                quantity={product.quantity}
                url={product.url}
                priceToShow={product.priceToShow}
                price={product.price}
                vendor={product.vendor}
                description={product.description}
                params={JSON.stringify(product.params)}
                category={product.category}
          />
      </section>
    )
}

export default Page;