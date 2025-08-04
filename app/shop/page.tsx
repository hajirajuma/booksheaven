'use client';
import Image from "next/image";
import { MoveRight, Search, Eye, ShoppingCart, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  price: string;
  numericPrice: number;
  image: string;
  pdfUrl: string;
  quantity?: number;
}

interface CartItem extends Book {
  quantity: number;
}

export default function ShopPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showCart, setShowCart] = useState<boolean>(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bookCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        setCart(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart data", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('bookCart', JSON.stringify(cart));
  }, [cart]);

  const books: Book[] = [
    {
      id: 1,
      title: "Data Analysis using SQL and Excel",
      author: "Gordon S.Linoff",
      publisher: "Wiley Publishing",
      price: "K40000/$4.5",
      numericPrice: 4.5,
      image: "/books/data1.jpg",
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 2,
      title: "JavaScript: The Complete Guide",
      author: "David Flanagan",
      publisher: "O'Reilly Media",
      price: "K30000/$3.8",
      numericPrice: 3.8,
      image: "/books/atom.jpg",
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 3,
      title: "Linear Algebra and Its Applications",
      author: "David C. Lay",
      publisher: "Pearson",
      price: "K50000/$6.4",
      numericPrice: 6.4,
      image: "/books/java.jpg",
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 4,
      title: "Physics: Principles and Problems",
      author: "Paul W. Zitzewitz",
      publisher: "McGraw-Hill",
      price: "K45000/$5.7",
      numericPrice: 5.7,
      image: "/books/phy.jpg",
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 5,
      title: "Java Programming Fundamentals",
      author: "Oracle Press",
      publisher: "McGraw-Hill",
      price: "K35000/$4.4",
      numericPrice: 4.4,
      image: "/books/line.jpg",
      pdfUrl: "/books/data.pdf"
    },
    {
      id: 6,
      title: "Atomic Structure and Chemical Bonding",
      author: "Linus Pauling",
      publisher: "Academic Press",
      price: "K25000/$3.2",
      numericPrice: 3.2,
      image: "/books/stat.jpg",
      pdfUrl: "/books/data.pdf"
    }
  ];

  // Filter books based on search term
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add book to cart
  const addToCart = (book: Book) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...book, quantity: 1 }];
      }
    });
  };

  // Remove book from cart
  const removeFromCart = (bookId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== bookId));
  };

  // Update quantity in cart
  const updateQuantity = (bookId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(bookId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === bookId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Get total cart items
  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total cart price
  const getTotalPrice = (): string => {
    return cart.reduce((total, item) => total + (item.numericPrice * item.quantity), 0).toFixed(2);
  };

  // View PDF function
  const viewPDF = (pdfUrl: string, title: string): void => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowCart(false)}>
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Shopping Cart ({getTotalItems()})</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        width={60} 
                        height={80} 
                        className="object-cover rounded" 
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-gray-600 text-xs">{item.author}</p>
                        <p className="font-bold text-sm">${(item.numericPrice * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total: ${getTotalPrice()}</span>
                  </div>
                  <button className="w-full bg-gray-900 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Library Section */}
      <div className="bg-white shadow-lg w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Cart Button */}
          <div className="flex justify-between items-center py-8">
            <button 
              onClick={() => setShowCart(true)}
              className="relative bg-gray-900 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
            >
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-700 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center items-center mb-12 md:mb-16 lg:mb-20">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                placeholder="Search books..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 md:p-4 pr-12 border-2 border-yellow-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-700 hover:text-yellow-800 transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {filteredBooks.map((book) => (
              <div 
                key={book.id}
                className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                  <Image 
                    src={book.image} 
                    alt={book.title}
                    width={200}
                    height={280}
                    className="w-full h-48 md:h-56 object-cover"
                  />
                </div>
                
                <div className="space-y-2 mb-4">
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

                {/* Action Buttons for each book */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => viewPDF(book.pdfUrl, book.title)}
                    className="flex-1 bg-gray-900 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                  >
                    <Eye size={16} className="mr-1" />
                    View PDF
                  </button>
                  <button 
                    onClick={() => addToCart(book)}
                    className="flex-1 bg-yellow-700 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                  >
                    <ShoppingCart size={16} className="mr-1" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredBooks.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No books found matching &quot;{searchTerm}&quot;</p>
            </div>
          )}

          {/* Category Button */}
          <div className="flex justify-center items-center pb-16 md:pb-20">
            <Link href="/categories" passHref> 
              <button className="bg-gray-900 hover:bg-blue-800 hover:scale-105 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-xl inline-flex items-center justify-center">
                Browse Categories
                <MoveRight size={20} className="ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

{/*'use client';
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
      
      {/* Library Section 
      <div className="bg-white shadow-lg w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title 
          <h2 className="text-center py-12 md:py-16 lg:py-20 text-3xl md:text-4xl lg:text-5xl text-yellow-700 font-bold tracking-wide">
            My Library
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
          </div>

          {/* Books Grid 
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

          {/* Action Buttons 
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
*/} 