import React from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  tier: string;
  image: string;
  additionalInfo: string;
  review: string;
}

export default function ProductCard({ 
  name, 
  description, 
  price, 
  rating, 
  category, 
  tier, 
  image, 
  additionalInfo, 
  review 
}: ProductCardProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 border border-blue-200">
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-semibold">{rating}/5.0</span>
          </div>
        </div>
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={image || "/placeholder.svg?height=192&width=192"} alt={name} />
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <p className="mt-2 text-gray-600">{description}</p>
            <div className="mt-4">
              <span className="text-lg font-bold text-blue-600">£{price}</span>
              <Button className="ml-4 bg-blue-500 hover:bg-blue-600 text-white">Buy Now</Button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Category: {category}</p>
              <p className="text-sm text-gray-500">Tier: {tier}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Additional Info</h3>
          <p className="text-gray-600">{additionalInfo}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Review</h3>
          <p className="text-gray-600">{review}</p>
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full text-blue-500 border-blue-500 hover:bg-blue-50">Show more +</Button>
        </div>
      </div>
    </div>
  );
}
