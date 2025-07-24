import { BookOpen, ShoppingCart } from 'lucide-react';
import Link from 'next/link'

export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between p-4 sticky top-0 bg-white text-yellow-700 font-bold shadow-md z-50">
            <div className="text-lg font-bold">
              <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
                <BookOpen size={24} />
                <span className="text-yellow-600">Book</span>
                <span className="text-blue-700">Heaven</span>
              </Link>  
            </div>
            <div className="flex items-center space-x-15 mr-30">
             <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
             <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
             <Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
             <Link href="/cart" className="hover:text-blue-600 transition-colors">
               <ShoppingCart size={24}/>
             </Link>
             <Link href="/Admin" className="hover:text-blue-600 transition-colors">Admin</Link>
            </div>
        </nav>
    );
};