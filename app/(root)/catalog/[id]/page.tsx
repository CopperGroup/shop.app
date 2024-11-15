'use server'

import Product from '@/lib/models/product.model';
import ProductPage from '@/components/shared/ProductPage';

const Page = async (context: any) => {
  function getFirstTwoWords(text: string) {
    // Trim spaces, split the string into an array of words
    const words = text.trim().split('_');

    // Find the word that contains a hyphen or default to the second word
    const secondWord = words.find(word => word.includes('-')) || words[1] || '';

    // Join the first word with the found second word
    return `${words[0]}_${secondWord}`; 
  }

  const searchQuery = getFirstTwoWords(context.params.id);
  const product = await Product.findOne({ 'params.0.value': context.params.id });

  // Find products whose model includes the search query (first two words with hyphen preference)
  const colors = await Product.find({ 'params.0.value': { $regex: searchQuery, $options: "i" } });

  let garantia = { name: '', value: '' };

  //@ts-ignore
  if (product) {
    garantia = product.params.find((obj: any) => obj.name === 'Гарантія');
  }

  return (
    <section className="max-lg:-mt-24">
      <ProductPage productJson={JSON.stringify(product)} colorsJson={JSON.stringify(colors)} />
    </section>
  );
};

export default Page;

