import Image from "next/image";
import { MoveRight, Search } from "lucide-react";
import Link from "next/link";

export default function ShopPage () {
  
  const books = [
    {
      id: 1,
      title: "Data Analysis using SQL and Excel",
      author: "Gordon S.Linoff",
      publisher: "Wiley Publishing",
      price: "K40000/$4.5",
      image: "/books/data1.jpg",
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 2,
      title: "JavaScript: The Complete Guide",
      author: "David Flanagan",
      publisher: "O'Reilly Media",
      price: "K30000/$3.8",
      image: "/books/atom.jpg",
      pdfUrl: "/books/javascript.pdf"
    },
    {
      id: 3,
      title: "Linear Algebra and Its Applications",
      author: "David C. Lay",
      publisher: "Pearson",
      price: "K50000/$6.4",
      image: "/books/java.jpg",
      pdfUrl: "/books/linear.pdf"
    },
    {
      id: 4,
      title: "Physics: Principles and Problems",
      author: "Paul W. Zitzewitz",
      publisher: "McGraw-Hill",
      price: "K45000/$5.7",
      image: "/books/phy.jpg",
      pdfUrl: "/books/physics.pdf"
    },
    {
      id: 5,
      title: "Java Programming Fundamentals",
      author: "Oracle Press",
      publisher: "McGraw-Hill",
      price: "K35000/$4.4",
      image: "/books/line.jpg",
      pdfUrl: "/books/java.pdf"
    },
    {
      id: 6,
      title: "Atomic Structure and Chemical Bonding",
      author: "Linus Pauling",
      publisher: "Academic Press",
      price: "K25000/$3.2",
      image: "/books/stat.jpg",
      pdfUrl: "/books/atom.pdf"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br bg-cover bg-center min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/open.jpg')"
        }}
      >
        <div className="text-center py-8 md:py-16 lg:py-20 px-4 max-w-4xl mx-auto">
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-4 font-light tracking-wide">
           Read Clearly
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-yellow-700 font-bold mb-4 md:mb-6 tracking-tight">
            And 
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white font-light">
            Change Your Mindset
          </p>
        </div>
      </div>

      {/* Library Section */}
      <div className="bg-white shadow-lg w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h2 className="text-center py-12 md:py-16 lg:py-20 text-3xl md:text-4xl lg:text-5xl text-yellow-700 font-bold tracking-wide">
            My Library
          </h2>

          {/* Search Bar */}
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
          </div>

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
                  <p className="text-gray-600 font-bold text-sm md:text-base">
                    {book.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-16 md:pb-20">
            <button className="w-full sm:w-auto bg-yellow-700 hover:bg-blue-800 hover:scale-105 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-xl">
              Add to Cart
            </button>
           <Link href="/categories"> 
            <button className="w-full sm:w-auto bg-yellow-700 hover:bg-blue-800 hover:scale-105 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-xl inline-flex items-center justify-center">
              Category
              <MoveRight size={20} className="ml-2" />
            </button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}