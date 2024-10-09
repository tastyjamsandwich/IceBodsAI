import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Snowflake, Wind, Zap, Star } from "lucide-react"
import Image from "next/image"

const ProductCard = ({ name, image, rating, description, price }) => (
  <Card className="w-full">
    <CardContent className="p-4">
      <Image src={image} alt={name} width={300} height={200} className="w-full h-48 object-cover rounded-md mb-4" />
      <h3 className="font-bold text-lg mb-2">{name}</h3>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">${price}</span>
        <Button size="sm">Buy Now</Button>
      </div>
    </CardContent>
  </Card>
)

const ProductSection = ({ title, icon: Icon, products }) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle className="flex items-center text-2xl">
        <Icon className="mr-2 text-blue-500" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="midtier">Mid Tier</TabsTrigger>
          <TabsTrigger value="luxury">Luxury</TabsTrigger>
        </TabsList>
        {["basic", "midtier", "luxury"].map((tier) => (
          <TabsContent key={tier} value={tier}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products[tier].map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </CardContent>
  </Card>
)

export default function Home() {
  const products = {
    cryotherapy: {
      basic: [
        { name: "Quick Freeze", image: "/placeholder.svg", rating: 4, description: "10-minute cryo session", price: 49.99 },
        { name: "Cryo Starter", image: "/placeholder.svg", rating: 3, description: "Beginner-friendly package", price: 79.99 },
      ],
      midtier: [
        { name: "Cryo Plus", image: "/placeholder.svg", rating: 4, description: "Enhanced cryo experience", price: 99.99 },
        { name: "Freeze Deluxe", image: "/placeholder.svg", rating: 5, description: "Premium cryo treatment", price: 129.99 },
      ],
      luxury: [
        { name: "Ice Royale", image: "/placeholder.svg", rating: 5, description: "VIP cryo experience", price: 199.99 },
        { name: "Frost Elegance", image: "/placeholder.svg", rating: 5, description: "Luxe cryo package", price: 249.99 },
      ],
    },
    coldTraining: {
      basic: [
        { name: "Cold 101", image: "/placeholder.svg", rating: 4, description: "Intro to cold exposure", price: 39.99 },
        { name: "Chill Basics", image: "/placeholder.svg", rating: 3, description: "Foundational techniques", price: 59.99 },
      ],
      midtier: [
        { name: "Frost Fighter", image: "/placeholder.svg", rating: 4, description: "Intermediate program", price: 89.99 },
        { name: "Ice Warrior", image: "/placeholder.svg", rating: 5, description: "Advanced cold training", price: 119.99 },
      ],
      luxury: [
        { name: "Polar Elite", image: "/placeholder.svg", rating: 5, description: "Expert-level training", price: 179.99 },
        { name: "Arctic Master", image: "/placeholder.svg", rating: 5, description: "Ultimate cold mastery", price: 229.99 },
      ],
    },
    iceBaths: {
      basic: [
        { name: "Quick Dip", image: "/placeholder.svg", rating: 4, description: "5-minute ice bath", price: 29.99 },
        { name: "Chill Splash", image: "/placeholder.svg", rating: 3, description: "Beginner ice bath pack", price: 49.99 },
      ],
      midtier: [
        { name: "Frost Immersion", image: "/placeholder.svg", rating: 4, description: "Extended ice bath", price: 79.99 },
        { name: "Ice Plunge Pro", image: "/placeholder.svg", rating: 5, description: "Advanced ice therapy", price: 99.99 },
      ],
      luxury: [
        { name: "Glacial Retreat", image: "/placeholder.svg", rating: 5, description: "Premium ice bath exp", price: 149.99 },
        { name: "Arctic Oasis", image: "/placeholder.svg", rating: 5, description: "Luxurious ice therapy", price: 199.99 },
      ],
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">IceBods</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-blue-600 hover:text-blue-800">Offers</a></li>
            <li><a href="#" className="text-blue-600 hover:text-blue-800">About</a></li>
            <li><a href="#" className="text-blue-600 hover:text-blue-800">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <h2 className="text-5xl font-bold text-blue-800 mb-4">Embrace the Cold, Ignite Your Fitness</h2>
          <p className="text-xl text-blue-600 mb-8">Discover the power of cold therapy for your body and mind</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Get Started
          </Button>
        </section>

        <section className="py-20">
          <ProductSection title="Cryotherapy" icon={Snowflake} products={products.cryotherapy} />
          <ProductSection title="Cold Training" icon={Wind} products={products.coldTraining} />
          <ProductSection title="Ice Baths" icon={Zap} products={products.iceBaths} />
        </section>

        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Ready to Cool Down and Power Up?</h2>
          <p className="text-xl text-blue-600 mb-8">Join IceBods today and transform your fitness journey</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Sign Up Now
          </Button>
        </section>
      </main>

      <footer className="bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 IceBods. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
