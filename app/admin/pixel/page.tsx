import TikTokPixelManager from "@/components/admin-components/pixel/TikTokPixelManager";
import MetaPixelManager from "@/components/admin-components/pixel/MetaPixelManager";

const Page = () => {
    return (
      <section className="w-full px-10 py-20 max-[360px]:px-4"> 
        <h1 className="w-full text-heading1-bold drop-shadow-text-blue">Pixels</h1>
        <div className="w-full flex gap-4 mt-10">
          {/* <MetaPixelManager /> */}
          {/* <TikTokPixelManager /> */}
        </div>
      </section>
    )
}

export default Page;