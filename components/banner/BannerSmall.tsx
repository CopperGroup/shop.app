const BannerSmall = () => {
  return (
    <article className="w-full h-72 flex justify-center items-center rounded-3xl" style={{ backgroundImage: `url(/assets/loginbackground.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <h1 className="text-[56px] font-medium text-white max-[440px]:text-[48px] max-[370px]:text-[40px]">SANTEHVAN</h1>
    </article>
  )
}

export default BannerSmall;