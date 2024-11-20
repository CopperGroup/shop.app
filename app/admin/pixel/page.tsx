import TikTokPixelManager from "@/components/admin-components/pixel/TikTokPixelManager";
import MetaPixelManager from "@/components/admin-components/pixel/MetaPixelManager";

const Page = () => {
    return (
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-10 sm:py-16 md:py-20"> 
        <h1 className="w-full text-heading1-bold drop-shadow-text-blue">Pixels</h1>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-9">
          <MetaPixelManager />
          <TikTokPixelManager />
        </div>
      </section>
    )
}

export default Page;