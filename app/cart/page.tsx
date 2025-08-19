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

// Define Cart Item interface
interface CartItem {
  book: Book;
  quantity: number;
}

// Define Cart interface
interface Cart {
  sessionId: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function ShopPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get or create a session ID
  const getSessionId = (): string => {
    if (typeof window === 'undefined') return 'default-session';
    
    let sessionId = localStorage.getItem('cartSessionId');
    if (!sessionId) {
      sessionId = 'session-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('cartSessionId', sessionId);
    }
    return sessionId;
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      const response = await fetch(`/api/cart/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const result = await response.json();
      if (result.success) {
        setCart(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (bookId: number, quantity: number = 1) => {
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/cart/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId, quantity }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      
      const result = await response.json();
      if (result.success) {
        setCart(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Update quantity
  const updateQuantity = async (bookId: number, newQuantity: number) => {
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/cart/${sessionId}/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
      
      const result = await response.json();
      if (result.success) {
        setCart(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Remove from cart
  const removeFromCart = async (bookId: number) => {
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/cart/${sessionId}/${bookId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }
      
      const result = await response.json();
      if (result.success) {
        setCart(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/cart/${sessionId}/clear`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      const result = await response.json();
      if (result.success) {
        setCart(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Initialize cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Error: {error}</p>
        <Button onClick={fetchCart} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl md:text-6xl lg:text-7xl text-center text-gray-900 font-semibold mb-4 md:mb-6 tracking-tight">
        Your Cart
      </h1>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
        {cart && cart.items.map((item) => (
          <div 
            key={item.book.id}
            className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <a 
              href={item.book.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block mb-4"
            >
              <div className="relative overflow-hidden">
                <Image 
                  src={item.book.image} 
                  alt={item.book.title}
                  width={200}
                  height={280}
                  className="w-full h-48 md:h-56 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </a>
            
            <div className="space-y-2">
              <h3 className="text-gray-900 font-semibold text-sm md:text-base line-clamp-2 leading-tight">
                {item.book.title}
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                <span className="font-medium">Author:</span> {item.book.author}
              </p>
              <p className="text-gray-600 text-xs md:text-sm">
                <span className="font-medium">Publisher:</span> {item.book.publisher}
              </p>
              <p className="text-gray-600 font-bold text-sm md:text-base">
                {item.book.displayPrice}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-4 mt-4">
              <button 
                onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              > 
                - 
              </button>
              <span className="mx-2">Quantity: {item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                +
              </button>      
            </div>

            <p className="text-lg font-semibold mb-4">
              Total: MK{(item.book.price * item.quantity).toLocaleString()}
            </p>

            <button 
              onClick={() => removeFromCart(item.book.id)} 
              className="bg-gray-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-300 text-sm w-full"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary - Only show if there are items */}
      {cart && cart.items.length > 0 && (
        <div className="bg-gray-50 border rounded-xl p-6 max-w-md mx-auto shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cart Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items:</span>
              <span className="font-medium">{cart.items.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Quantity:</span>
              <span className="font-medium">
                {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between items-center text-xl font-bold text-gray-900">
              <span>Total:</span>
              <span>MK{cart.total.toLocaleString()}</span>
            </div>
          </div>
          <Link href="/payment">
            <button 
              className="w-full bg-gray-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Proceed to checkout"
            >
              Proceed to Checkout
            </button>
          </Link>
          <button 
            onClick={clearCart}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Clear Cart
          </button>
        </div>
      )}

      {/* Empty cart message */}
      {(!cart || cart.items.length === 0) && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
          <p className="text-gray-500">Add some books to get started!</p>
        </div>
      )}
    </div>
  );
}