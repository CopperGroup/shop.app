"use server"

import Categories from "@/components/shared/Categories";
import { fetchLastProducts } from "@/lib/actions/product.actions";
import Latest from "@/components/shared/Latest";
import Map from "@/components/shared/Map";
import Banner from "@/components/shared/Banner";
import Divider from "@/components/shared/Divider";
import Test from '@/components/Test'
import AboutUs from "@/components/shared/AboutUs";
import Header from "@/components/shared/Header";
import StickyCart from "@/components/shared/StickyCart";
import Footer from "@/components/shared/Footer";
import BannerHero from "@/components/banner/BannerHero";

export default async function Home() {
  

 

  
 
  

  
  return (
    <>
      <BannerHero/>
      <Divider iconUrl="/assets/arrow-down.svg" width={64} height={64} mt={32} mb={12} type="icon-only" />  
      <Categories/>
      <Divider iconUrl="" width={0} height={0} mt={0} mb={0} type="default"/>
      <AboutUs/>
      <Divider iconUrl="/assets/wave1-up.svg" width={1536} height={320} mt={32} mb={32} type="icon-only" />
      <Latest />
      <Divider iconUrl="/assets/wave1-down.svg" width={1536} height={320} mt={10} mb={32} type="icon-only" />
      <Map/>
      <StickyCart/>   
    </>
  );
}
