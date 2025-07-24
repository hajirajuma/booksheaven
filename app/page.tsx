import images from "next/image";
import data1 from "../public/books/data1.jpg";
import Image from "next/image";
import { MoveRight, Search } from "lucide-react";
export default function Home() {
  return (
    <>
   <div className="items-center bg-[url('/images/book1.jpg')] bg-cover bg-center  h-100 w-full -z-10 ">
      <div className="text-center py-20 tracking-wide">
        <h2 className="text-white text-4xl mb-2 ">Welcome To</h2>
        <h1 className="text-7xl text-yellow-800 font-bold mb-2 ">BookHeaven</h1>
         <p className="text-lg text-white">Your Gateway To Knowledge</p>
      </div>
   </div>
   <div className="bg-white shadow-md">
        <h2 className="text-center py-20 tracking-wide text-5xl text-yellow-800 font-bold">My Library</h2>
        <div className="flex justify-center items-center mb-20 ">
          <div className="relative">
        <input type="text" placeholder="search books..." className="w-3xl p-2 border border-yellow-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-800 "><Search size={20}/></button>
        </div>
        </div>
        <div className="grid grid-cols-3 grid-rows-2 gap-4 px-40">
          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-blue-500 border rounded-md">
            <a href="/books/data.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={data1} alt="data1" width={94} height={94} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>

          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-blue-500 border rounded-md">
            <a href="/books/javascript.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={data1} alt="data1" width={94} height={94} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>

          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-blue-500 border rounded-md">
            <a href="/books/linear.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={data1} alt="data1" width={94} height={94} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>

          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-blue-500 border rounded-md">
            <a href="/books/data.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={data1} alt="data1" width={94} height={94} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>

          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-blue-500 border rounded-md">
            <a href="/books/javascript.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={data1} alt="data1" width={94} height={94} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>

          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-blue-500 border rounded-md">
            <a href="/books/linear.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={data1} alt="data1" width={94} height={94} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>
          
            <button className=" hover:scale-105 hover:shadow-xl hover:bg-blue-700  bg-yellow-700 items-center rounded-md text-white p-2 w-40 ml-40 mt-5 shadow-md">Add to Cart</button>
            <button className=" hover:scale-105 hover:shadow-xl hover:bg-blue-700 bg-yellow-700 rounded-md items-center  text-white p-2  w-40 ml-40 mt-5 shadow-md inline-flex ">Category  <MoveRight size={24} className="text-white ml-10"/></button>
      
        </div>

   </div>
   </>
  )
}
