import Image from "next/image";
import Link from "next/link";
import { Truck, Package, Calendar, Phone, Mail, CreditCard } from "lucide-react";

interface Props {
  id: string;
  products: {
    product: {
      id: string;
      images: string[];
      name: string;
      priceToShow: number;
      price: number;
    };
    amount: number;
  }[];
  user: {
    _id: string;
    email: string;
  };
  value: number;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  paymentType: string;
  deliveryMethod: string;
  city: string;
  adress: string;
  postalCode: string;
  data: string;
  paymentStatus: "Pending" | "Success" | "Declined";
  deliveryStatus: "Proceeding" | "Fulfilled" | "Canceled";
  url: string;
}

export default function OrderCard({
  id,
  products,
  value,
  name,
  surname,
  phoneNumber,
  email,
  data,
  paymentStatus,
  deliveryStatus,
  url,
}: Props) {
  const totalProducts = products.reduce((sum, item) => sum + item.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
      case "Proceeding":
        return "gray-500";
      case "Success":
      case "Fulfilled":
        return "green-500";
      case "Declined":
      case "Canceled":
        return "red-500";
      default:
        return "gray-500";
    }
  };

  const getDeliveryBarStyle = () => {
    switch (deliveryStatus) {
      case "Proceeding":
        return "w-1/3 bg-gray-500";
      case "Fulfilled":
        return "w-full bg-green-500";
      case "Canceled":
        return "w-1/2 bg-red-500";
      default:
        return "w-0 bg-gray-200";
    }
  };

  const getTruckStyle = () => {
    switch (deliveryStatus) {
      case "Proceeding":
        return "left-0 text-gray-500";
      case "Fulfilled":
        return "right-0 text-green-500";
      case "Canceled":
        return "left-1/2 -translate-x-1/2 text-red-500";
      default:
        return "left-0 text-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-200">
      <div className="bg-black p-6 text-white rounded-b-3xl">
        <h4 className="text-xl font-semibold">{name} {surname}</h4>
        <p className="text-sm opacity-80 mt-1">Order ID: {id}</p>
      </div>
      <div className="p-8">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-6">
          <InfoItem icon={<Calendar className="w-5 h-5 text-gray-500" />} text={data} />
          <InfoItem icon={<Package className="w-5 h-5 text-gray-500" />} text={`${totalProducts} items`} />
          <InfoItem icon={<CreditCard className="w-5 h-5 text-gray-500" />} text={`${value} грн`} />
          <InfoItem icon={<Phone className="w-5 h-5 text-gray-500" />} text={phoneNumber} link={`tel:${phoneNumber}`} />
          <InfoItem icon={<Mail className="w-5 h-5 text-gray-500" />} text={email} link={`mailto:${email}`} />
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Статус доставки</span>
            <span className={`text-sm font-semibold text-${getStatusColor(deliveryStatus)}`}>{deliveryStatus}</span>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className={`absolute inset-y-0 left-0 transition-all duration-500 ease-out ${getDeliveryBarStyle()}`}></div>
          </div>
          <div className="relative h-10 mt-2">
            <Truck className={`absolute top-1/2 -mt-4 w-8 h-8 transition-all duration-500 ease-out ${getTruckStyle()}`} />
          </div>
        </div>
        <div className="w-full flex items-center gap-2 -mt-2">
            <span className={`w-3 h-3 rounded-full bg-${getStatusColor(paymentStatus)}`}></span>
            <span className={`text-sm font-medium text-${getStatusColor(paymentStatus)}`}>Оплата: {paymentStatus}</span>
          </div>
        <div className="flex justify-end items-center mt-3">
          <Link href={`${url}${id}`} className="inline-flex items-center px-6 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-blue transition-colors duration-300">
            Деталі
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, text, link }: { icon: React.ReactNode; text: string; link?: string }) {
  const content = (
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-sm whitespace-nowrap text-gray-700">{text}</span>
    </div>
  );

  return link ? (
    <Link href={link} className="text-gray-700 hover:text-blue transition-colors duration-300">
      {content}
    </Link>
  ) : content;
}