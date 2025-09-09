"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AddBookPage() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    price: "",
    numericPrice: 0,
    pdfUrl: "",
    image: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Auto-sync numeric price when price changes
      ...(field === 'price' && { numericPrice: parseFloat(value) || 0 })
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const { title, author, publisher, price } = formData;
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!author.trim()) newErrors.author = "Author is required";
    if (!publisher.trim()) newErrors.publisher = "Publisher is required";
    if (!price.trim()) newErrors.price = "Price is required";
    else if (isNaN(parseFloat(price))) newErrors.price = "Price must be a valid number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/shop/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          numericPrice: Number(formData.numericPrice)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Book added successfully:", result);
      // After successfully adding a book
window.dispatchEvent(new CustomEvent('bookAdded'));
      
      // Success - redirect to admin page
      router.push("/admin");
    } catch (error) {
      console.error("Failed to add book:", error);
      alert(`Failed to add book: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    { key: 'title', label: 'Book Title', type: 'text', placeholder: 'Enter book title', required: true },
    { key: 'author', label: 'Author', type: 'text', placeholder: 'Enter author name', required: true },
    { key: 'publisher', label: 'Publisher', type: 'text', placeholder: 'Enter publisher name', required: true },
    { key: 'price', label: 'Price', type: 'text', placeholder: 'Enter price (e.g., $19.99)', required: true },
    { key: 'numericPrice', label: 'Numeric Price', type: 'number', placeholder: 'Enter numeric price (auto-filled)', required: false },
    { key: 'image', label: 'Image URL', type: 'url', placeholder: 'Enter image URL (optional)', required: false },
    { key: 'pdfUrl', label: 'PDF URL', type: 'url', placeholder: 'Enter PDF URL (optional)', required: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-700 rounded-full">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Add New Book</h1>
            </div>
            <p className="text-gray-600 text-lg">Add a new book to your digital bookstore inventory</p>
          </div>
        </div>
        
        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-yellow-700 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Book Information
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {inputFields.map(({ key, label, type, placeholder, required }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={type}
                  value={formData[key as keyof typeof formData]}
                  placeholder={placeholder}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                    errors[key] 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  required={required}
                  disabled={isSubmitting}
                  step={type === 'number' ? '0.01' : undefined}
                />
                {errors[key] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">!</span>
                    {errors[key]}
                  </p>
                )}
                
                {/* Helper text for specific fields */}
                {key === 'price' && (
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the display price (e.g., "$19.99", "Free", "€15.00")
                  </p>
                )}
                {key === 'numericPrice' && (
                  <p className="mt-1 text-sm text-gray-500">
                    This will be auto-filled when you enter the price above
                  </p>
                )}
                {key === 'image' && (
                  <p className="mt-1 text-sm text-gray-500">
                    Provide a direct link to the book cover image
                  </p>
                )}
                {key === 'pdfUrl' && (
                  <p className="mt-1 text-sm text-gray-500">
                    Provide a link to the PDF file for digital downloads
                  </p>
                )}
              </div>
            ))}
            
            {/* Preview Section */}
            {(formData.title || formData.author || formData.price) && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Preview
                </h3>
                <div className="flex gap-4">
                  <div className="w-16 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                    {formData.image ? (
                      <Image
                        src={formData.image}
                        alt="Book preview"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <BookOpen className="h-8 w-8 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{formData.title || 'Book Title'}</h4>
                    <p className="text-gray-600">by {formData.author || 'Author Name'}</p>
                    <p className="text-sm text-gray-500">{formData.publisher || 'Publisher'}</p>
                    <p className="text-lg font-bold text-yellow-700 mt-1">{formData.price || '$0.00'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Link
                href="/admin"
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-yellow-700 text-white rounded-lg hover:bg-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Book...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Add Book to Inventory
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Fill in all required fields marked with a red asterisk (*)</li>
            <li>• The numeric price will be automatically calculated from your price input</li>
            <li>• Image and PDF URLs are optional but recommended for better user experience</li>
            <li>• After adding, the book will appear in your admin dashboard inventory</li>
          </ul>
        </div>
      </div>
    </div>
  );

}

/*"use client"
import {useState} from "react"
import {useRouter} from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AddBookPage(){
    const [title, settitle] = useState("");
const [author, setauthor] = useState("")
const [publisher, setpublisher] = useState("")
const [price, setprice] = useState("")
const [numericPrice, setnumericPrice] = useState(0)
const [pdfUrl, setpdfUrl] = useState("")
const [image, setimage] = useState("")
const router = useRouter()



    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
const body = {
            title, 
            author,
            publisher,
            price,
            numericPrice: Number(numericPrice),
            image,
            pdfUrl
        }

        const res =  await fetch(`${API_BASE_URL}/shop/books`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(!res.ok){
            alert("something went wrong")
        }
         router.push("/admin")
        }catch(error){
            console.log(error)
        }
        
    }
    return <div className="h-screen flex justify-center mx-auto p-8">
        <form>
            <label>Title</label><br></br>
            <input type="text" placeholder="enter book title" onChange={(e) => {
                settitle(e.target.value)
                console.log(title)
                }}/><br></br>
            <label>Author</label><br></br>
            <input type="text" placeholder="enter book title" 
            onChange={(e) => {
                setauthor(e.target.value)
                console.log(author)
                }}
            /><br></br>
            <label>Publisher</label><br></br>
            <input type="text" placeholder="enter book title" 
            onChange={(e) => {
                setpublisher(e.target.value)
                console.log(publisher)
                }}
            /><br></br>
            <label>Price</label><br></br>
            <input type="text" placeholder="enter book title" 
            onChange={(e) => {
                setprice(e.target.value)
                console.log(price)
                }}
            /><br></br>
            <label>numericPrice</label><br></br>
            <input type="number" placeholder="enter book title" 
            onChange={(e) => {
                setnumericPrice(e.target.value)
                console.log(numericPrice)
                }}
            /><br></br>
            <label>image</label><br></br>
            <input type="text" placeholder="enter book title" 
            onChange={(e) => {
                setimage(e.target.value)
                console.log(image)
                }}
            /><br></br>
            <label>pdfUrl</label><br></br>
            <input type="text" placeholder="enter book title" 
            onChange={(e) => {
                setpdfUrl(e.target.value)
                console.log(pdfUrl)
                }}
            /><br></br>
        </form>
        <button type="button" onClick={handleSubmit}>Add book</button>
    </div>
}
    */