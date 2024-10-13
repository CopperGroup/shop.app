import { DOMParser } from "xmldom";
import { replaceDescription } from "./utils";


export default async function xmlParse(xmlString: string){


    if(!xmlString){
        console.log("No XML data found");

        return [];
    }
    
    const xmlDocument = new DOMParser().parseFromString(xmlString, "text/xml");
    const products = xmlDocument.getElementsByTagName("offer");
    if(!products){
        return[];
    }
    const fetchedProducts = [];

    if(products) {
        // await deleteUrlProducts();

        for(let i = 0; i < products.length; i++){
            const product = products[i];

            const id = product.getAttribute("id");
            const isAvailableAttribute = product.getAttribute("available");
            const quantityElement = product.getElementsByTagName("stock_quantity")[0];
            const urlElement = product.getElementsByTagName("url")[0];
            const priceToShowElement = product.getElementsByTagName("price")[0];
            const priceElement = product.getElementsByTagName("price_old")[0];
            const categoryIdElement = product.getElementsByTagName("categoryId")[0];
            const imagesElements = product.getElementsByTagName("picture");
            const vendorElement = product.getElementsByTagName("vendor")[0];
            const nameElement = product.getElementsByTagName("name_ua")[0] ? product.getElementsByTagName("name_ua")[0] : product.getElementsByTagName("name")[0];
            const descriptionElement = product.getElementsByTagName("description_ua")[0] ? product.getElementsByTagName("description_ua")[0] : product.getElementsByTagName("description")[0];
            const paramElements = product.getElementsByTagName("param");
            const images = [];
            const params = [];
           

            
           
            let isAvailable;
            if(isAvailableAttribute === "true"){
                isAvailable = true;
            } else {
                isAvailable = false;
            }
            const quantity = quantityElement ? parseFloat(quantityElement.textContent || '0') : 0;
            const url = urlElement ? urlElement.textContent : "";
            const priceToShow = priceToShowElement ? parseFloat(priceToShowElement.textContent || '0') : 0;
            let price = priceElement ? parseFloat(priceElement.textContent || '0') : 0;
            if (price === 0 || price === null) {
                price = priceToShow;
              }
            const categoryId = categoryIdElement ? categoryIdElement.textContent : "";
            const vendor = vendorElement ? vendorElement.textContent : "";
            const name = nameElement ? nameElement.textContent : "";
            const description = descriptionElement ? replaceDescription(descriptionElement.textContent as string) : "";
            
            let category = ''


            if(categoryId!=null){
                if(categoryId[0]=='1'){
                    category = 'Меблі для ванної кімнати'
                }else if(categoryId[0]=='2'){
                    category = 'Житлові меблі'
                }else if(categoryId[0]=='3'){
                    category = 'Дитячі меблі'
                }
            }

            



            for (let i = 0; i < imagesElements.length; i++) {
                const image = imagesElements[i].textContent;
    
                images.push(image)
            }

            
        
            let widthParam = null;
            let heightParam = null
            let modelParam = null
            let deepParam = null
            let typeParam = null
            let colorParam = null
            let productParam = null


            for (let i = 0; i < paramElements.length; i++) {
                const paramName = paramElements[i].getAttribute("name");
                const paramValue = paramElements[i].textContent;
    
                // Check if the parameter is "Ширина"
                if (["Ширина, см", "Width, cm"].includes(paramName ? paramName : "")) {
                    widthParam = { name: paramName, value: paramValue };
                } else if(["Висота, см", "Height, cm"].includes(paramName ? paramName : "")){
                    heightParam = { name: paramName, value: paramValue };
                }else if(["Артикул", "SKU"].includes(paramName ? paramName : "")){
                    let first = paramValue?.replace(/ /g, '_');

                    modelParam = { name: "Товар", value: first };
                  
                }else if(["Глибина, см", "Depth, cm"].includes(paramName ? paramName : "")){
                    deepParam = { name: paramName, value: paramValue };
                }else if(["Вид", "Kind"].includes(paramName ? paramName : "")){
                    typeParam = { name: paramName, value: paramValue };
                }else if(["Колір", "Color"].includes(paramName ? paramName : "")){
                    colorParam = { name: paramName, value: paramValue };
                }else {
                    params.push({ name: paramName, value: paramValue });
                }
            }
     
            // Add the "Ширина" parameter at the beginning of the params array if found

            if(colorParam !== null){
                params.unshift(colorParam);
            }

            if(typeParam !== null){
                params.unshift(typeParam);
            }

            if(deepParam !== null){
                params.unshift(deepParam);
            }

            if(heightParam !== null){
                params.unshift(heightParam);
            }

            if (widthParam !== null) {
                params.unshift(widthParam);
            }

            if (modelParam !== null) {
                params.unshift(modelParam);
            }

            if (productParam !== null) {
                params.unshift(productParam);
            }


            const isFetched = true;

           
            const fetchedProduct = {
                id: id,
                name: name,
                isAvailable: isAvailable,
                quantity: quantity,
                url: url,
                priceToShow: priceToShow,
                price: price,
                images: images,
                vendor: vendor,
                description: description,
                params: params,
                isFetched: isFetched,
                category: category,
            };

           
       
            fetchedProducts.push(fetchedProduct);

            // await createUrlProduct({ id: id, name: name, isAvailable: isAvailable, quantity: quantity, url: url, priceToShow: priceToShow, price: price, images: images, vendor: vendor, description: description, params: params, isFetched: isFetched })
        }
            
    }
    return(fetchedProducts);
}




