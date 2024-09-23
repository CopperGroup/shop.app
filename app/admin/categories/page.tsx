import CategoryCard from "@/components/cards/CategoryCard";
import { fetchCategoriesProperities, findAllProductsCategories } from "@/lib/actions/product.actions";

const Page = async () => {

  const categories = await fetchCategoriesProperities();
  return (
    <section className="w-full px-10 py-20 h-screen max-md:pb-36 max-[360px]:px-4"> 
      <h1 className="w-full text-heading1-bold drop-shadow-text-blue">Категорії</h1>
      <div className="grid grid-cols-4 gap-6 mt-20 pb-20 max-[1800px]:grid-cols-3 max-[1250px]:grid-cols-2 max-[650px]:grid-cols-1">
        {categories.map((cat, index) => (
            <CategoryCard key={index} categoryInfo={cat}/>
        ))}
      </div>
    </section>
  )
}

export default Page;