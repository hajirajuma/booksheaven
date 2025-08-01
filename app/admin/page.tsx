'use client';
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
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-yellow-700 mb-8">
          Admin Panel
        </h1>

        {/* Navigation Buttons */}
        <div className="bg-white shadow-sm border-b rounded-lg">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <ul className="flex items-center ml-96 gap-15 flex-wrap">
              <li><Button variant="outline">Add new book</Button></li>
              <li><Button variant="outline">View inventory</Button></li>
              <li><Button variant="outline">View orders</Button></li>
            </ul>
          </div>
        </div>

        {/* Books Table */}
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
                        onClick={() => handleDeleteBook(book.id)}
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

        {/* Orders Table */}
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
