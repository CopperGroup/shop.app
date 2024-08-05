import GetParams from "@/components/admin-components/create-product/GetParams";

const Page = ({ params }: { params: { id: string } }) => {
    if(!params.id) return null;

    return (
      <section className="px-10 py-20 h-full">
          <h1 className="text-heading1-bold drop-shadow-text-blue">Властивості</h1>

          <GetParams productId={params.id}/>
      </section>
    )
  }
  
  export default Page;