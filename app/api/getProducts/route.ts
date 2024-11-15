
import xmlParse from "@/lib/fetchProducts";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  
  
  try {

      const body = await request.json();

      const {url} = body

      //console.log(url)

      const response = await fetch(url, { cache: 'no-store'});

      if (!response.ok) {
         throw new Error('Failed to fetch products');
       }

      const data = await response.text();
      const fetchedProducts = await xmlParse(data);
      //console.log('dfssdfsd')
  
      
      
      return NextResponse.json({
      
        fetchedProducts
    });
  } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
};