import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ProductType, TypeScriptPrimitiveTypes } from "./types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

export function totalProducts(products : { 
  product: {
      id: string;
      images: string[];
      name: string;
      priceToShow: number;
      price: number;
  }, 
  amount: number
} []) {
  let total = 0;

  for(const product of products){
      total += 1 * product.amount
  }

  return total;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function replaceDescription(str: string) {
  return str
    .replace(/&amp;lt;/g, '<')
    .replace(/&amp;gt;/g, '>')
    .replace(/&amp;quot;/g, '"')
    .replace(/&amp;amp;/g, '&')
    .replace(/&amp;#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&euro;/g, '€')
    .replace(/&pound;/g, '£')
    .replace(/&yen;/g, '¥')
    .replace(/&cent;/g, '¢')
    .replace(/&bull;/g, '•')
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')   
    .replace(/&ndash;/g, '–');  
}

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function isArrayOf<T>(value: unknown, type: typeof TypeScriptPrimitiveTypes[number]): value is T[]{
  return Array.isArray(value) && value.every(item => typeof item === type)
}

export function replace<T extends string | string[]>(item: T, replacable: string, replaceWith: string): T extends string[] ? string[] : string {
  if(isArrayOf<string>(item, "string")) {
    return item.map((subItem) => subItem.replace(replacable, replaceWith)) as T extends string[] ? string[] : string
  } else {
    return item.replace(replacable, replaceWith) as T extends string[] ? string[] : string
  }
}

export function createSearchString({
  pNumber,
  sort,
  categories,
  colors,
  types,
  search,
  vendors,
  series,
  price,
  width,
  height,
  depth,
  category,
  minPrice,
  maxPrice,
  maxMin
}: {
  pNumber: string;
  sort: string;
  categories: string[],
  colors: string[];
  types: string[];
  search: string;
  vendors: string[];
  series: string[];
  price: [number, number];
  width: { min: number, max: number };
  height: { min: number, max: number };
  depth: { min: number, max: number };
  category: string | null;
  minPrice: number;
  maxPrice: number;
  maxMin: { minWidth: number, maxWidth: number, minHeight: number, maxHeight: number, minDepth: number, maxDepth: number };
}) {
  const queryObject: Record<string, string> = {
    page: pNumber,
  };

  if (sort !== '') queryObject.sort = sort;
  if (categories.length > 0) queryObject.category = categories.join(",");
  if (colors.length > 0) queryObject.color = colors.join(',');
  if (types.length > 0) queryObject.type = types.join(',');
  if (search) queryObject.search = search;
  if (vendors.length > 0) queryObject.vendor = vendors.join(',');
  if (series.length > 0) queryObject.series = series.join(',');

  if (price[0] !== minPrice || price[1] !== maxPrice) {
    queryObject.minPrice = price[0].toString();
    queryObject.maxPrice = price[1].toString();
  }

  if (width.min !== maxMin.minWidth || width.max !== maxMin.maxWidth) {
    queryObject.minWidth = width.min.toString();
    queryObject.maxWidth = width.max.toString();
  }

  if (height.min !== maxMin.minHeight || height.max !== maxMin.maxHeight) {
    queryObject.minHeight = height.min.toString();
    queryObject.maxHeight = height.max.toString();
  }

  if (depth.min !== maxMin.minDepth || depth.max !== maxMin.maxDepth) {
    queryObject.minDepth = depth.min.toString();
    queryObject.maxDepth = depth.max.toString();
  }

  return new URLSearchParams(queryObject).toString();
}

export function getKeyValuePairs<T, K extends keyof T, V extends keyof T>(list: T[], keyProp: K, valueProp: V): Record<string, string> {
  return list.reduce((acc, item) => {
    const key = String(item[keyProp]); // Convert the key to a string
    const value = String(item[valueProp]);
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}


export function getFiltredProducts(products: ProductType[], searchParams: { [key: string]: string }) {
  return products.filter(product => {
    const { 
      search, maxPrice, minPrice, 
      minWidth, maxWidth, 
      minHeight, maxHeight, 
      minDepth, maxDepth, 
      vendor, series, color, type 
    } = searchParams;

    // Check for series match
    const matchesSeries = series ? 
      product.params[0].value
        .toLowerCase()
        .split(/[\s_]+/)  // Split by space or underscore
        .some(part => series.toLowerCase().includes(part)) : true;  // Match part of series value if exists

    const matchesSearch = search ? product.name.toLowerCase().includes(search.toLowerCase()) : true;
    const matchesPrice = (minPrice || maxPrice) ? 
      product.priceToShow >= parseFloat(minPrice || '0') && product.priceToShow <= parseFloat(maxPrice || 'Infinity') : true;
    const matchesWidth = (minWidth || maxWidth) ? 
      parseFloat(product.params[1].value) >= parseFloat(minWidth || '0') && parseFloat(product.params[1].value) <= parseFloat(maxWidth || 'Infinity') : true;
    const matchesHeight = (minHeight || maxHeight) ? 
      parseFloat(product.params[2].value) >= parseFloat(minHeight || '0') && parseFloat(product.params[2].value) <= parseFloat(maxHeight || 'Infinity') : true;
    const matchesDepth = (minDepth || maxDepth) ? 
      parseFloat(product.params[3].value) >= parseFloat(minDepth || '0') && parseFloat(product.params[3].value) <= parseFloat(maxDepth || 'Infinity') : true;
    const matchesVendor = vendor ? vendor.includes(product.vendor) : true;
    const matchesColor = color ? color.includes(product.params[5]?.value) : true;
    const matchesType = type ? type.includes(product.params[4]?.value) : true;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesWidth &&
      matchesHeight &&
      matchesDepth &&
      matchesVendor &&
      matchesSeries &&
      matchesColor &&
      matchesType
    );
  });
}

function countByKey<T>(
  list: T[],
  keyExtractor: (item: T) => string | undefined,
  initialKey: string = ""
): { [key: string]: number } {
  return list.reduce((acc, item) => {
    const key = keyExtractor(item);
    if (key) {
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, { [initialKey]: list.length });
}

export function getCounts(filtredProducts: ProductType[]) {
  return {
      categoriesCount: countByKey(filtredProducts, product => product.category),
      vendorsCount: countByKey(filtredProducts, product => product.vendor),
      typesCount: countByKey(filtredProducts, product => product.params[4]?.value),
      seriesCount: countByKey(filtredProducts, product => product.params[0]?.value.split('_')[0].split('-')[0]),
      colorsCount: countByKey(filtredProducts, product => product.params[5]?.value),
  };
}