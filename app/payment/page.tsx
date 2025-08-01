"use client";
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-yellow-700 mb-8">
          Personal Details
        </h1>

        {/* Card Container */}
        <Card className="w-full shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
              Register
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Please enter your details
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            <div className="space-y-4">
              <Input 
                type="text" 
                placeholder="Full Name" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <Input 
                type="text" 
                placeholder="Your Address" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <Input 
                type="text" 
                placeholder="Country" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <Input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Register
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center p-6 border-t border-gray-200">
            <Button 
              type="submit" 
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Continue to Payment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

{/*import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react"; // Added React import

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  country: z.string().min(1, {
    message: "Please select a country.",
  }),
});

export default function PaymentPage() { // Changed to default export
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      country: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);
    // Add your form submission logic here
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Personal Details</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Form fields remain the same 
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Other form fields... 

          <Button type="submit" className="w-full">
            Continue to Payment
          </Button>
        </form>
      </Form>
    </div>
  );
} */}