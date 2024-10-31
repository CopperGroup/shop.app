import CategoryPage from "@/components/admin-components/CategoryPage";
import { fetchCategory } from "@/lib/actions/product.actions"

const Page = async ({ params }: { params: { categoryName: string } }) => {

    if (!params.categoryName) {
        return null;
    }

    // Decode the category name to handle encoded characters
    const decodedCategoryName = decodeURIComponent(params.categoryName.replace('_', ' '));

    console.log("Decoded Category name:", decodedCategoryName);

    // Fetch category information based on the decoded name
    const categoryInfo = await fetchCategory({ categoryName: decodedCategoryName });

    return (
        <section className="w-full px-10 pt-10 h-screen ml-2 max-[400px]:px-6 max-[360px]:px-4">
            <CategoryPage {...categoryInfo} />
        </section>
    );
}

export default Page;
