import Image from "next/image";
import Link from "next/link";

interface Props {
    id: string;
    name: string;
    image: string;
    priceToShow: number;
    model: string;
    amount: number;
}

const OrderedProductCard = ({ id, name, image, priceToShow, model, amount}: Props) => {
  return (
    <article className="w-full flex flex-col border border-gray-200 rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="w-full h-48 sm:h-56 flex justify-center items-center p-4 bg-gray-50">
        <Link href={`/catalog/${model}`} className="block w-full h-full relative">
          <Image
            src={image}
            layout="fill"
            objectFit="contain"
            alt={name}
            className="rounded-lg transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <Link href={`/catalog/${model}`} className="block mb-2 hover:underline">
            <h2 className="text-heading4-medium text-gray-800 mb-1 line-clamp-2">{name}</h2>
            <p className="text-base-medium text-gray-600 break-words">Модель: {model}</p>
            <p className="text-small-regular text-gray-500">ID: {id}</p>
          </Link>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <div className="text-base-regular text-gray-600 mb-2 sm:mb-0">
            <p>Кількість: {amount}</p>
            <p>Ціна за одиницю: {priceToShow}₴</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-body-semibold text-green-600">
              {(priceToShow * amount).toFixed(2)}₴
            </p>
            <p className="text-subtle-medium text-gray-500">Загальна сума</p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default OrderedProductCard;