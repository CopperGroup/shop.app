import CreateProduct from "@/components/forms/CreateProduct"

const Page = () => {
    return (
        <section className="px-10 py-20">
        <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Створити товар</h1>
        <div className="w-full h-[2px] bg-gray-400 mt-20 rounded-lg"></div>
        <div className="mt-16">
            <CreateProduct/>
        </div>
        </section>
    )
}

export default Page;