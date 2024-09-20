import CreateProduct from "@/components/forms/CreateProduct"

const Page = () => {
    return (
        <section className="px-10 py-20 max-[360px]:px-4">
        <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Створити товар</h1>
        <div className="mt-16">
            <CreateProduct/>
        </div>
        </section>
    )
}

export default Page;