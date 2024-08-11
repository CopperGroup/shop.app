import FetchUrl from '@/components/admin-components/FetchUrl';

const Page = async () => {


  return (
    <section className="w-full px-10 py-20 h-screen"> 
      <h2 className="text-heading1-bold pr-2 drop-shadow-text-blue">Додайте товар посиланням</h2>
      <FetchUrl/>
    </section>
  )
}

export default Page;
