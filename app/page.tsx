import stat from "../public/books/stat.jpg";
import line from "../public/books/line.jpg";
import java from "../public/books/java.jpg";
import phy from "../public/books/phy.jpg";
import atom from "../public/books/atom.jpg";
import data1 from "../public/books/data1.jpg";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  
  const books = [
    {
      id: 1,
      title: "Data Analysis using SQL and Excel",
      author: "Gordon S.Linoff",
      publisher: "Wiley Publishing",
      image: data1,
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 2,
      title: "JavaScript: The Complete Guide",
      author: "David Flanagan",
      publisher: "O'Reilly Media",
      image: atom,
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 3,
      title: "Linear Algebra and Its Applications",
      author: "David C. Lay",
      publisher: "Pearson",
      image: java,
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 4,
      title: "Physics: Principles and Problems",
      author: "Paul W. Zitzewitz",
      publisher: "McGraw-Hill",
      image: phy,
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 5,
      title: "Java Programming Fundamentals",
      author: "Oracle Press",
      publisher: "McGraw-Hill",
      image: line,
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 6,
      title: "Atomic Structure and Chemical Bonding",
      author: "Linus Pauling",
      publisher: "Academic Press",
      image: stat,
      pdfUrl: "/books/data.pdf"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br bg-cover bg-center min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/read.jpg')"
        }}
      >
        <div className="text-center py-8 md:py-16 lg:py-20 px-4 max-w-4xl mx-auto">
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-4 font-light tracking-wide">
            Welcome To
          </h2>
          <h1 className=" md:text-6xl lg:text-7xl  text-yellow-700 text-4xl  font-bold mb-4 md:mb-6 tracking-tight">
             BookHeaven
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white font-light">
            Your Gateway To Knowledge
          </p>
        </div>
      </div>

      {/* Library Section */}
      <div className="bg-white shadow-lg w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h2 className="text-center py-12 md:py-16 lg:py-20 text-3xl md:text-4xl lg:text-5xl text-yellow-700 font-bold tracking-wide">
           Featured Books
          </h2>

          {/* Search Bar 
          <div className="flex justify-center items-center mb-12 md:mb-16 lg:mb-20">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                placeholder="Search books..." 
                className="w-full p-3 md:p-4 pr-12 border-2 border-yellow-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-700 hover:text-yellow-800 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>*/}

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {books.map((book) => (
              <div 
                key={book.id}
                className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <a 
                  href={book.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block mb-4"
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-100">
                    <Image 
                      src={book.image} 
                      alt={book.title}
                      width={200}
                      height={280}
                      className="w-full h-48 md:h-56 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </a>
                
                <div className="space-y-2">
                  <h3 className="text-gray-900 font-semibold text-sm md:text-base line-clamp-2 leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    <span className="font-medium">Author:</span> {book.author}
                  </p>
                  <p className="text-gray-600 text-xs md:text-sm">
                    <span className="font-medium">Publisher:</span> {book.publisher}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-16 md:pb-20">
          <Link href="/shop">

            <button className="w-full sm:w-auto bg-gray-900 hover:bg-blue-800 hover:scale-105 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-xl">
              Browse 
            </button> </Link>
            <Link href="/categories">
            <button className="w-full sm:w-auto bg-gray-900  hover:bg-blue-800 hover:scale-105 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-xl inline-flex items-center justify-center">
              Category
              <MoveRight size={20} className="ml-2" />
            </button> </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
  {/* <div className="items-center bg-[url('/images/book1.jpg')] bg-cover bg-center  h-100 w-full -z-10 ">
      <div className="text-center py-20 tracking-wide">
        <h2 className="text-white text-4xl mb-2 ">Welcome To</h2>
        <h1 className="text-7xl text-yellow-800 font-bold mb-2 ">BookHeaven</h1>
         <p className="text-lg text-white">Your Gateway To Knowledge</p>
      </div>
   </div>
   <div className="bg-white shadow-md w-full h-[180vh]">
        <h2 className="text-center py-20 tracking-wide text-5xl text-yellow-800 font-bold">My Library</h2>
        <div className="flex justify-center items-center mb-20 ">
          <div className="relative">
        <input type="text" placeholder="search books..." className="w-3xl p-2 border border-yellow-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-800 "><Search size={20}/></button>
        </div>
        </div>
        <div className="grid grid-cols-3 grid-rows-2 gap-4 px-40">
          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-transparent border border-blue-600 rounded-md">
            <a href="/books/data.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={data1} alt="data1" width={98} height={98} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>

          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-transparent border border-blue-600 rounded-md">
            <a href="/books/javascript.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={stat} alt="data1" width={98} height={98} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>

          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-transparent border border-blue-600 rounded-md">
            <a href="/books/linear.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={line} alt="data1" width={98} height={98} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>

          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-transparent border border-blue-600 rounded-md">
            <a href="/books/data.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={phy} alt="data1" width={98} height={98} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>

          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-transparent border border-blue-600 rounded-md">
            <a href="/books/javascript.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={java} alt="data1" width={98} height={98} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div>

          <div className="items-center py-10 w-64 h-58 top-1 p-4 bg-transparent border border-blue-600 rounded-md">
            <a href="/books/linear.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <Image src={atom} alt="data1" width={98} height={98} className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"/>
            </a>
            <h1 className="text-black text-xs">Data analysis using SQL and Excel</h1>
            <h2 className="text-black text-xs" >Author: Gordon S.Linoff</h2>
            <p className="text-black text-xs" >publisher: Wiley publishing</p>
          </div> 
          
            <button className=" hover:scale-105 hover:shadow-xl hover:bg-blue-700 mt-20 bg-yellow-700 top-20 items-center rounded-md text-white p-2 w-30 ml-60  shadow-md">Add to Cart</button>
        
            <button className=" hover:scale-105 hover:shadow-xl hover:bg-blue-700 mt-20 top-20 bg-yellow-700 rounded-md items-center  text-white p-2  w-30 ml-60  shadow-md inline-flex ">Category<MoveRight size={24} className="text-white ml-3"/></button>
      
        </div>

   </div>

   
   

   </>
  )
} 
*/}
