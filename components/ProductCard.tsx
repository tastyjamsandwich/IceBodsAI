import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
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
  id,
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-semibold">{rating}/5.0</span>
          </div>
        </div>
        <div className="relative h-48 w-full mb-4">
          <Image
            src={image || "/placeholder.svg?height=192&width=192"}
            alt={name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <p className="text-gray-600 mb-2">{description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-blue-600">
            {typeof price === 'number' ? `£${price.toFixed(2)}` : 'Price not available'}
          </span>
          <Link href={`/product/${id}`}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300">View Details</Button>
          </Link>
        </div>
        <div className="text-sm text-gray-500 mb-2">
          <p>Category: {category}</p>
          <p>Tier: {tier}</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full text-blue-500 border-blue-500 hover:bg-blue-50 flex items-center justify-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'Show more'} 
          {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
        {isExpanded && (
          <Tabs defaultValue="info" className="mt-4 space-y-4">
            <TabsList className="w-full grid grid-cols-2 gap-2">
              <TabsTrigger value="info" className="w-full">Quick Info</TabsTrigger>
              <TabsTrigger value="review" className="w-full">Full Review</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-600">{additionalInfo}</p>
            </TabsContent>
            <TabsContent value="review" className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-600">{review}</p>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
