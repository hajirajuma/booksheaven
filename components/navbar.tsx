"use client"
import { AlignJustify, BookOpen } from 'lucide-react';
import Link from 'next/link'
import { useState } from 'react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="flex items-center justify-between p-4 sticky top-0 bg-white text-yellow-700 font-bold shadow-md z-50">
      <div className="text-lg font-bold">
        <Link href="/" className=" flex items-center gap-1 hover:text-blue-600  ">
          <BookOpen size={24} />
          <span className="text-yellow-700 hover:text-blue-600  ">Book</span>
          <span className="text-yellow-700 hover:text-blue-600  ">Heaven</span>
        </Link>  
      </div>   
      
      <div className="flex items-center">
        <button 
          className="md:hidden" 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Toggle menu"
        >
          <AlignJustify className="w-6 h-6 text-yellow-700"/>
        </button>
        
        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-6 ">
          <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
          <li><Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link></li>
          <li><Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link></li>
          <li><Link href="/cart" className="hover:text-blue-600 transition-colors">Cart</Link></li>
          <li><Link href="/admin" className="hover:text-blue-600 transition-colors">admin</Link></li>
        </ul>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden px-4 pb-4 space-y-2 bg-white flex flex-col mt-0 ml-auto  shadow-lg  text-center w-3/7">
          <Link href="/" className="hover:text-blue-600 transition-colors py-2">Home</Link>
          <Link href="/shop" className="hover:text-blue-600 transition-colors py-2">Shop</Link>
          <Link href="/categories" className="hover:text-blue-600 transition-colors py-2">Categories</Link>
          <Link href="/cart" className="hover:text-blue-600 transition-colors py-2">Cart</Link>
          <Link href="/Admin" className="hover:text-blue-600 transition-colors py-2">admin</Link>
        </div>
      )}
    </nav>
  );
};