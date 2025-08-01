'use client';
import { Button } from "@/components/ui/button"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Define the Book interface
interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  price: number;
  displayPrice: string;
  image: string;
  pdfUrl: string;
}

export default function ShopPage() {
  const books: Book[] = [
    {
      id: 1,
      title: "Data Analysis using SQL and Excel",
      author: "Gordon S.Linoff",
      publisher: "Wiley Publishing",
      price: 40000,
      displayPrice: "K40000/$4.5",
      image: "/books/data1.jpg",
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 2,
      title: "JavaScript: The Complete Guide",
      author: "David Flanagan",
      publisher: "O'Reilly Media",
      price: 30000,
      displayPrice: "K30000/$3.8",
      image: "/books/atom.jpg",
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 3,
      title: "Linear Algebra and Its Applications",
      author: "David C. Lay",
      publisher: "Pearson",
      price: 50000,
      displayPrice: "K50000/$6.4",
      image: "/books/java.jpg",
      pdfUrl: "/books/data.pdf"
    }
  ];

  // State for cart items and quantities
  const [cartItems, setCartItems] = useState<Book[]>(books);
  const [bookQuantities, setBookQuantities] = useState<Record<number, number>>(
    books.reduce((acc, book) => ({ ...acc, [book.id]: 1 }), {})
  );

  // Fixed: Changed bookId type from string to number to match the actual book.id type
  const updateQuantity = (bookId: number, newQuantity: number) => {
    setBookQuantities(prev => ({
      ...prev,
      [bookId]: Math.max(1, newQuantity)
    }));
  };

  // Fixed: Added proper type annotation for book parameter
  const calculateTotal = (book: Book): number => {
    return book.price * bookQuantities[book.id];
  };

  const calculateCartTotal = (): number => {
    return cartItems.reduce((total, book) => {
      return total + calculateTotal(book);
    }, 0);
  };

  // Fixed: Added proper type annotation for bookId parameter
  const remove = (bookId: number): void => {
    setCartItems(prev => prev.filter(book => book.id !== bookId));
    setBookQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[bookId];
      return newQuantities;
    });
  };

  return (
    
    <div className="container mx-auto px-4 py-8 ">
      
      <h1 className="text-3xl md:text-6xl lg:text-7xl text-center text-gray-900 font-semibold mb-4 md:mb-6 tracking-tight">
      Your Cart
      </h1>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
        {cartItems.map((book) => (
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
              <div className="relative overflow-hidden">
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
                {book.displayPrice}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-4 mt-4">
              <button 
                onClick={() => updateQuantity(book.id, bookQuantities[book.id] - 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              > 
                - 
              </button>
              <span className="mx-2">Quantity: {bookQuantities[book.id]}</span>
              <button 
                onClick={() => updateQuantity(book.id, bookQuantities[book.id] + 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                +
              </button>      
            </div>

            <p className="text-lg font-semibold mb-4">
              Total: MK{calculateTotal(book).toLocaleString()}
            </p>

            <button 
              onClick={() => remove(book.id)} 
              className="bg-gray-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-300 text-sm w-full"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary - Only show if there are items */}
      {cartItems.length > 0 && (
        <div className="bg-gray-50 border rounded-xl p-6 max-w-md mx-auto shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cart Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items:</span>
              <span className="font-medium">{cartItems.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Quantity:</span>
              <span className="font-medium">
                {Object.entries(bookQuantities)
                  .filter(([bookId]) => cartItems.some(item => item.id.toString() === bookId))
                  .reduce((sum, [, qty]) => sum + qty, 0)}
              </span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between items-center text-xl font-bold text-gray-900">
              <span>Total:</span>
              <span>MK{calculateCartTotal().toLocaleString()}</span>
            </div>
          </div>
          <Link href= "/payment">
          <button 
            className="w-full bg-gray-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Proceed to checkout"
            onClick={() => console.log('Proceeding to checkout...')}
          >
            Proceed to Checkout
          </button>
          </Link>
        </div>
      )}

      {/* Empty cart message */}
      {cartItems.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
          <p className="text-gray-500">Add some books to get started!</p>
        </div>
      )}
    </div>
  );
}