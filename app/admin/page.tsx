'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, RefreshCw, Package, ShoppingCart, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link"

interface Book {
  id: number;
  title: string;
  author: string;
  publisher?: string;
  price: number;
  displayPrice: string;
  numericPrice?: number;
  imageUrl?: string;
  image?: string;
  pdfUrl?: string;
  createdAt?: string;
}

interface OrderItem {
  bookId: number;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  buyer: string;
  buyerEmail?: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Unpaid' | 'Paid' | 'Shipped' | 'Delivered';
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'orders'>('books');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Updated fetchBooks function to properly handle API response
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/shop/books`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transform data to match your interface if needed
        const transformedBooks = Array.isArray(data) ? data.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          price: book.numericPrice ? book.numericPrice * 100 : 0, // Convert to cents if needed
          displayPrice: book.price || `$${book.numericPrice || 0}`,
          numericPrice: book.numericPrice,
          imageUrl: book.image || book.imageUrl,
          image: book.image,
          pdfUrl: book.pdfUrl,
          createdAt: book.createdAt
        })) : [];
        
        setBooks(transformedBooks);
        setLastRefresh(new Date());
        showAlert('success', `${transformedBooks.length} books loaded successfully`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching books from API:', error);
      showAlert('error', 'Failed to fetch books from server');
      setBooks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const transformedOrders = Array.isArray(data) ? data : [];
        setOrders(transformedOrders);
        setLastRefresh(new Date());
        showAlert('success', `${transformedOrders.length} orders loaded successfully`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching orders from API:', error);
      showAlert('error', 'Failed to fetch orders from server');
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/shop/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setBooks(books.filter(book => book.id !== id));
        showAlert('success', 'Book deleted successfully');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      showAlert('error', 'Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        showAlert('success', 'Order status updated successfully');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      showAlert('error', 'Failed to update order status');
    }
  };

  const refreshData = () => {
    if (activeTab === 'books') {
      fetchBooks();
    } else {
      fetchOrders();
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Refresh data when component mounts
  useEffect(() => {
    fetchBooks();
    fetchOrders();
  }, []);

  // Listen for custom events from add-book page
  useEffect(() => {
    const handleBookAdded = () => {
      fetchBooks(); // Refresh books when a new book is added
      setActiveTab('books'); // Switch to books tab
    };

    // Listen for custom event
    window.addEventListener('bookAdded', handleBookAdded);
    
    // Clean up
    return () => {
      window.removeEventListener('bookAdded', handleBookAdded);
    };
  }, []);

  // Listen for page visibility changes to refresh data when returning to page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refresh data when the page becomes visible again
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeTab]);

  // Set up interval to periodically refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh data every 2 minutes
      refreshData();
    }, 120000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-300';
      case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Delivered': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Unpaid': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;

  const stats = {
    totalBooks: books.length,
    totalOrders: orders.length,
    paidOrders: orders.filter(o => o.status === 'Paid').length,
    revenue: orders.filter(o => o.status === 'Paid').reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900 bg-clip-text text-transparent mb-4">
            BookStore Admin
          </h1>
          <p className="text-gray-600 text-lg">Manage your digital bookstore with ease</p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
              <BookOpen className="h-12 w-12 text-gray-900" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-gray-900" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.paidOrders}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-gray-900" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatPrice(stats.revenue)}</p>
              </div>
              <Package className="h-12 w-12 text-gray-900" />
            </div>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
            alert.type === 'success' 
              ? 'border-green-300 bg-green-50 text-green-800' 
              : 'border-red-300 bg-red-50 text-red-800'
          }`}>
            {alert.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('books')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all duration-200 ${
                activeTab === 'books'
                  ? 'bg-gray-900 text-white border-b-2 border-indigo-600 shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <BookOpen size={20} />
              Books Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-yellow-700 text-white border-b-2 border-indigo-600 shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <ShoppingCart size={20} />
              Orders Management
            </button>
          </div>
        </div>

        {/* Books Management */}
        {activeTab === 'books' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-yellow-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Books Inventory ({books.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/admin/add-book"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Book
                  </Link>
                  <button
                    onClick={fetchBooks}
                    disabled={loading}
                    className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {books.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No books found</h3>
                  <p className="text-gray-500 mb-6">Start by adding your first book to the inventory.</p>
                  <Link
                    href="/admin/add-book"
                    className="inline-flex items-center gap-2 bg-yellow-700 text-white hover:bg-yellow-800 font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Add Your First Book
                  </Link>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Book Details</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Author</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Publisher</th>
                      <th className="px-6 py-4 text-right font-semibold text-gray-900">Price</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book, index) => (
                      <tr key={book.id} className={`hover:bg-gray-50 transition-colors ${index !== books.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {book.imageUrl || book.image ? (
                                <img
                                  src={book.imageUrl || book.image}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling!.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                                <BookOpen className="h-6 w-6" />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-lg">{book.title}</div>
                              <div className="text-sm text-gray-500">ID: {book.id}</div>
                              {book.pdfUrl && (
                                <a
                                  href={book.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                                >
                                  View PDF
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium">{book.author}</td>
                        <td className="px-6 py-4 text-gray-700">{book.publisher || 'N/A'}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xl font-bold text-gray-600">{book.displayPrice}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              className="text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                              onClick={() => showAlert('success', `Viewing details for ${book.title}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                              onClick={() => showAlert('success', `Editing ${book.title}`)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                              onClick={() => deleteBook(book.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-900 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  Orders Management ({orders.length})
                </h2>
                <button
                  onClick={fetchOrders}
                  disabled={loading}
                  className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Orders
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No orders found</h3>
                  <p className="text-gray-500">Orders will appear here when customers make purchases.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Order ID</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Customer</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Items</th>
                      <th className="px-6 py-4 text-right font-semibold text-gray-900">Total</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${index !== orders.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="font-mono text-sm font-semibold text-gray-900">
                            {order.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-600">{order.buyer}</div>
                            <div className="text-sm text-gray-500">{order.buyerEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {order.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="mb-1">
                                <span className="font-medium">{item.title}</span>
                                <span className="text-gray-500 ml-2">×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-lg font-bold text-gray-600">
                            {formatPrice(order.total)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className={`px-3 py-1 rounded-full text-sm font-semibold border cursor-pointer transition-colors ${getStatusColor(order.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="text-gray-900 border border-indigo-200 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                            onClick={() => showAlert('success', `Viewing order ${order.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-2xl">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-900" />
              <span className="font-medium text-gray-700">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




/*'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, RefreshCw, Package, ShoppingCart, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link"

interface Book {
  id: number;
  title: string;
  author: string;
  publisher?: string;
  price: number;
  displayPrice: string;
  numericPrice?: number;
  imageUrl?: string;
  image?: string;
  pdfUrl?: string;
  createdAt?: string;
}

interface OrderItem {
  bookId: number;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  buyer: string;
  buyerEmail?: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Unpaid' | 'Paid' | 'Shipped' | 'Delivered';
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'orders'>('books');

  // Updated fetchBooks function to properly handle API response
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/shop/books`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transform data to match your interface if needed
        const transformedBooks = Array.isArray(data) ? data.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          price: book.numericPrice ? book.numericPrice * 100 : 0, // Convert to cents if needed
          displayPrice: book.price || `$${book.numericPrice || 0}`,
          numericPrice: book.numericPrice,
          imageUrl: book.image || book.imageUrl,
          image: book.image,
          pdfUrl: book.pdfUrl,
          createdAt: book.createdAt
        })) : [];
        
        setBooks(transformedBooks);
        showAlert('success', `${transformedBooks.length} books loaded successfully`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching books from API:', error);
      showAlert('error', 'Failed to fetch books from server');
      setBooks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const transformedOrders = Array.isArray(data) ? data : [];
        setOrders(transformedOrders);
        showAlert('success', `${transformedOrders.length} orders loaded successfully`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching orders from API:', error);
      showAlert('error', 'Failed to fetch orders from server');
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/shop/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setBooks(books.filter(book => book.id !== id));
        showAlert('success', 'Book deleted successfully');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      showAlert('error', 'Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        showAlert('success', 'Order status updated successfully');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      showAlert('error', 'Failed to update order status');
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Refresh data when coming back from add-book page
  useEffect(() => {
    fetchBooks();
    fetchOrders();
  }, []);

  // Listen for page visibility changes to refresh data when returning to page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && activeTab === 'books') {
        fetchBooks();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeTab]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-300';
      case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Delivered': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Unpaid': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;

  const stats = {
    totalBooks: books.length,
    totalOrders: orders.length,
    paidOrders: orders.filter(o => o.status === 'Paid').length,
    revenue: orders.filter(o => o.status === 'Paid').reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
       Header 
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900 bg-clip-text text-transparent mb-4">
            BookStore Admin
          </h1>
          <p className="text-gray-600 text-lg">Manage your digital bookstore with ease</p>
        </div>

       Stats Cards 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
              <BookOpen className="h-12 w-12 text-gray-900" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-gray-900" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.paidOrders}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-gray-900" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatPrice(stats.revenue)}</p>
              </div>
              <Package className="h-12 w-12 text-gray-900" />
            </div>
          </div>
        </div>

        Alert 
        {alert && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
            alert.type === 'success' 
              ? 'border-green-300 bg-green-50 text-green-800' 
              : 'border-red-300 bg-red-50 text-red-800'
          }`}>
            {alert.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

        Navigation Tabs
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('books')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all duration-200 ${
                activeTab === 'books'
                  ? 'bg-gray-900 text-white border-b-2 border-indigo-600 shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <BookOpen size={20} />
              Books Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-yellow-700 text-white border-b-2 border-indigo-600 shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <ShoppingCart size={20} />
              Orders Management
            </button>
          </div>
        </div>

       Books Management 
        {activeTab === 'books' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-yellow-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Books Inventory ({books.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/admin/add-book"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Book
                  </Link>
                  <button
                    onClick={fetchBooks}
                    disabled={loading}
                    className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {books.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No books found</h3>
                  <p className="text-gray-500 mb-6">Start by adding your first book to the inventory.</p>
                  <Link
                    href="/admin/add-book"
                    className="inline-flex items-center gap-2 bg-yellow-700 text-white hover:bg-yellow-800 font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Add Your First Book
                  </Link>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Book Details</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Author</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Publisher</th>
                      <th className="px-6 py-4 text-right font-semibold text-gray-900">Price</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book, index) => (
                      <tr key={book.id} className={`hover:bg-gray-50 transition-colors ${index !== books.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {book.imageUrl || book.image ? (
                                <img
                                  src={book.imageUrl || book.image}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling!.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                                <BookOpen className="h-6 w-6" />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-lg">{book.title}</div>
                              <div className="text-sm text-gray-500">ID: {book.id}</div>
                              {book.pdfUrl && (
                                <a
                                  href={book.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                                >
                                  View PDF
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium">{book.author}</td>
                        <td className="px-6 py-4 text-gray-700">{book.publisher || 'N/A'}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xl font-bold text-gray-600">{book.displayPrice}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              className="text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                              onClick={() => showAlert('success', `Viewing details for ${book.title}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                              onClick={() => showAlert('success', `Editing ${book.title}`)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                              onClick={() => deleteBook(book.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

       Orders Management
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-900 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  Orders Management ({orders.length})
                </h2>
                <button
                  onClick={fetchOrders}
                  disabled={loading}
                  className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Orders
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No orders found</h3>
                  <p className="text-gray-500">Orders will appear here when customers make purchases.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Order ID</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Customer</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Items</th>
                      <th className="px-6 py-4 text-right font-semibold text-gray-900">Total</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${index !== orders.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="font-mono text-sm font-semibold text-gray-900">
                            {order.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-600">{order.buyer}</div>
                            <div className="text-sm text-gray-500">{order.buyerEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {order.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="mb-1">
                                <span className="font-medium">{item.title}</span>
                                <span className="text-gray-500 ml-2">×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-lg font-bold text-gray-600">
                            {formatPrice(order.total)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className={`px-3 py-1 rounded-full text-sm font-semibold border cursor-pointer transition-colors ${getStatusColor(order.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="text-gray-900 border border-indigo-200 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                            onClick={() => showAlert('success', `Viewing order ${order.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

         Loading Overlay 
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-2xl">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-900" />
              <span className="font-medium text-gray-700">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



/*'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, RefreshCw, Package, ShoppingCart, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link"

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  displayPrice: string;
  imageUrl?: string;
  pdfUrl?: string;
  createdAt?: string;
}

interface OrderItem {
  bookId: number;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  buyer: string;
  buyerEmail?: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Unpaid' | 'Paid' | 'Shipped' | 'Delivered';
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'orders'>('books');

  // Mock API functions (replace with actual API calls to your backend)
  const fetchBooks = async () => {
    
    try {
       setLoading(true);
      // Replace this with actual API call: fetch('/api/admin/books')
      const response = await fetch(`${API_BASE_URL}/admin/books`);
      
      if (response.ok) {
      showAlert('success', 'Books loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching books from API:', error);
      showAlert('error', 'Failed to fetch books');
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    
    try {
      setLoading(true);
      // Replace this with actual API call: fetch('/api/admin/orders')
      const response = await fetch(`${API_BASE_URL}/admin/orders`);

    if (response.ok) {
        showAlert('success', 'Orders loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching books from API:', error);
      showAlert('error', 'Failed to fetch orders');
    }
    setLoading(false);
  };

  const deleteBook = async (id: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      // Replace with actual API call: fetch(`/api/admin/books/${id}`, { method: 'DELETE' })
         setLoading(true);
     const response = await fetch(`${API_BASE_URL}/admin/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
         });
      
      if (response.ok) {
        setBooks(books.filter(book => book.id !== id));
        showAlert('success', 'Book deleted successfully');
      }
    } catch (error) {
      console.error('Error fetching books from API:', error);
      showAlert('error', 'Failed to delete book');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<void> => {
    try {
      // Replace with actual API call: fetch(`/api/admin/orders/${orderId}`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) })
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`,{
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
    });
      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        showAlert('success', 'Order status updated successfully');
      }
    } catch (error) {
      console.error("Failed to parse cart data", error);
      showAlert('error', 'Failed to update order status');
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    fetchBooks();
    fetchOrders();
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-300';
      case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Delivered': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Unpaid': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;

  const stats = {
    totalBooks: books.length,
    totalOrders: orders.length,
    paidOrders: orders.filter(o => o.status === 'Paid').length,
    revenue: orders.filter(o => o.status === 'Paid').reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header 
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900 bg-clip-text text-transparent mb-4">
            BookStore Admin
          </h1>
          <p className="text-gray-600 text-lg">Manage your digital bookstore with ease</p>
        </div>

         Stats Cards 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
              <BookOpen className="h-12 w-12 text-gray-900" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-gray-900" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.paidOrders}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-gray-900" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatPrice(stats.revenue)}</p>
              </div>
              <Package className="h-12 w-12 text-gray-900" />
            </div>
          </div>
        </div>

         Alert 
        {alert && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
            alert.type === 'success' 
              ? 'border-gray-900 bg-gray-900 text-gray-900' 
              : 'border-gray-900 bg-gray-900 text-gray-900'
          }`}>
            {alert.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

         Navigation Tabs 
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('books')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all duration-200 ${
                activeTab === 'books'
                  ? 'bg-gray-900 text-white border-b-2 border-indigo-600 shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <BookOpen size={20} />
              Books Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-yellow-700 text-white border-b-2 border-indigo-600 shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <ShoppingCart size={20} />
              Orders Management
            </button>
          </div>
        </div>

        Books Management 
        {activeTab === 'books' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-yellow-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Books Inventory ({books.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/admin/add-book"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Book
                  </Link>
                  <button
                    onClick={fetchBooks}
                    disabled={loading}
                    className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Book Details</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Author</th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => (
                    <tr key={book.id} className={`hover:bg-gray-50 transition-colors ${index !== books.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {book.id}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">{book.title}</div>
                            <div className="text-sm text-gray-500">ID: {book.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{book.author}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xl font-bold text-gray-600">{book.displayPrice}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                            onClick={() => showAlert('success', `Viewing details for ${book.title}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                            onClick={() => showAlert('success', `Editing ${book.title}`)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                            onClick={() => deleteBook(book.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

         Orders Management 
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-900 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  Orders Management ({orders.length})
                </h2>
                <button
                  onClick={fetchOrders}
                  disabled={loading}
                  className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Orders
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Order ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Items</th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${index !== orders.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm font-semibold text-gray-900">
                          {order.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-600">{order.buyer}</div>
                          <div className="text-sm text-gray-500">{order.buyerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="mb-1">
                              <span className="font-medium">{item.title}</span>
                              <span className="text-gray-500 ml-2">×{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-gray-600">
                          {formatPrice(order.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`px-3 py-1 rounded-full text-sm font-semibold border cursor-pointer transition-colors ${getStatusColor(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="text-gray-900 border border-indigo-200 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                          onClick={() => showAlert('success', `Viewing order ${order.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        Loading Overlay 
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-2xl">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-900" />
              <span className="font-medium text-gray-700">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



*/


{/*('use client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  // Sample data for books
  const books = [
    { id: 1, title: "JavaScript", author: "David", price: "$250.00" },
    { id: 2, title: "Linear", author: "Gordof Alice", price: "$8.00" },
    { id: 3, title: "Calculus", author: "Zain", price: "$45.00" },
    { id: 4, title: "Atomic Habits", author: "James Clear", price: "$32.00" }
  ]

  // Sample data for orders
  const orders = [
    { id: "01", buyer: "Jane Banda", items: "Book A, Book B", total: "$250.00", status: "Pending" },
    { id: "02", buyer: "Shakira Meya", items: "Book B", total: "$89.00", status: "Unpaid" },
    { id: "03", buyer: "Vincent Moya", items: "Book C", total: "$75.00", status: "Paid" },
    { id: "04", buyer: "Adam Phiri", items: "Book A", total: "$32.00", status: "Paid" }
  ]

  const handleDeleteBook = (id: number) => {
    // Add your delete logic here
    console.log(`Deleting book with ID: ${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header 
        <h1 className="text-3xl font-bold text-center text-yellow-700 mb-8">
          Admin Panel
        </h1>

        {/* Navigation Buttons 
    
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <ul className="flex items-center ml-96 gap-15 flex-wrap">
              <li><Button variant="outline" className="bg-gray-900 text-white">Add new book</Button></li>
              <li><Button variant="outline" className="bg-gray-900 text-white">View inventory</Button></li>
              <li><Button variant="outline" className="bg-gray-900 text-white">View orders</Button></li>
            </ul>
          </div>
        

        {/* Books Table 
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h1 className="text-2xl font-bold text-center text-yellow-700 mb-6">
            Books List
          </h1>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.id}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell className="text-right">{book.price}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" className="mr-2">Edit</Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteBook(book.id)} className="bg-gray-900"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Orders Table
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h1 className="text-2xl font-bold text-center text-yellow-700 mb-6">
            Orders
          </h1>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.buyer}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="text-right">{order.total}</TableCell>
                    <TableCell className="text-right">{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

)
*/}