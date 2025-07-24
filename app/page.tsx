import { Link } from "lucide-react";
import images from "next/image";
export default function Home() {
  return (
    <>
   <div className="items-center bg-[url('/images/book1.jpg')] bg-cover bg-center  h-100 w-full -z-10 ">
      <div className="text-center py-20 tracking-wide">
        <h2 className="text-white text-4xl mb-2 ">Welcome To</h2>
        <h1 className="text-7xl text-yellow-800 font-bold mb-2 ">BookHeaven</h1>
         <p className="text-lg text-white">Your Gateway To Knowledge</p>
      </div>
   </div>
   <div className="bg-white h-96 w-full">
        <h2 className="text-center py-20 tracking-wide text-5xl text-yellow-800 font-bold">My Library</h2>
        <div>
          <Link></Link>
        </div>

   </div>
   </>
  )
}
