"use client";

import Image from 'next/image';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SetStateAction, useState } from 'react';
import GatherProductsInfo from './GatherProductsInfo';

const FetchUrl = () => {
  const [url, setUrl] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleFetchStart = () => {
    setUrl(inputValue);
  };

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-2 flex-1 mt-16 mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Link"
            className="max-w-md"
            value={inputValue}
            onChange={handleChange}
          />
          <Button onClick={handleFetchStart}>Отримати товари</Button>
          <p className="text-small-regular max-w-lg max-[1265px]:hidden">Вставте посилання з вашим XML кодом, щоб передати товари до бази данних</p>
        </div>
        <p className="text-small-regular w-full min-[1266px]:hidden">Вставте посилання з вашим XML кодом, щоб передати товари до бази данних</p>
      </div>
      <div className="w-full h-[2px] bg-dark-1 shadow-md"></div>
      
      <GatherProductsInfo url={url}/>
    </ >
  );
};

export default FetchUrl;
