import { Button } from "@/components/ui/button"
import Image from "next/image";
import { MoveRight, Search } from "lucide-react";
    
export default function CategoryPage() {
  
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
      
      {/* Category Buttons at the top */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ul className="flex items-center gap-4 flex-wrap">
            <li><Button variant="outline">Education</Button></li>
            <li><Button variant="outline">Romance</Button></li>
            <li><Button variant="outline">History</Button></li>
            <li><Button variant="outline">Technology</Button></li>
            <li className="px-3 py-2 text-gray-700 font-medium">Life</li>
          </ul>
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

          {/* Books List - Vertical Layout */}
          <div className="space-y-6 mb-16">
            {books.map((book) => (
              <div 
                key={book.id}
                className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Book Image - Left side */}
                  <div className="flex-shrink-0">
                    <a 
                      href={book.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block"
                    >
                      <div className="relative overflow-hidden rounded-lg bg-gray-100">
                        <Image 
                          src={book.image} 
                          alt={book.title}
                          width={150}
                          height={200}
                          className="w-32 h-40 md:w-36 md:h-48 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </a>
                  </div>
                  
                  {/* Book Details - Right side */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-gray-900 font-semibold text-lg md:text-xl leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      <span className="font-medium">Author:</span> {book.author}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      <span className="font-medium">Publisher:</span> {book.publisher}
                    </p>
                    <p className="text-gray-600 font-bold text-base md:text-lg">
                      {book.price}
                    </p>
                    
                    {/* Individual book actions */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <a 
                        href={book.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-yellow-700 hover:bg-yellow-800 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-300 text-sm"
                      >
                        View PDF
                      </a>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-300 text-sm">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-16 md:pb-20">
            <button className="w-full sm:w-auto bg-yellow-700 hover:bg-blue-800 hover:scale-105 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-xl">
              View All Categories
            </button>
            
            <button className="w-full sm:w-auto bg-yellow-700 hover:bg-blue-800 hover:scale-105 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-xl inline-flex items-center justify-center">
              Browse More
              <MoveRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}