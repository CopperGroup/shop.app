import EditProduct from "@/components/forms/EditProduct";

const Page = ({ params }: { params: { id: string } }) => {
    if(!params.id) return null;

    return (
      <section className="px-10 py-20">
        <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Редагувати товар</h1>
        <div className="mt-16">
          <EditProduct productId={params.id}/>
        </div>
      </section>
    )
  }
  
  export default Page;