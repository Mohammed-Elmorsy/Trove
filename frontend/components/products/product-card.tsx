import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { id, name, description, price, imageUrl, stock, category } = product;

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {stock === 0 && (
            <Badge className="absolute top-2 right-2" variant="destructive">
              Out of Stock
            </Badge>
          )}
          {stock > 0 && stock < 10 && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              Low Stock
            </Badge>
          )}
        </div>
      </Link>

      <CardHeader className="flex-grow">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${id}`} className="hover:underline">
            <CardTitle className="text-lg line-clamp-2">{name}</CardTitle>
          </Link>
        </div>
        <CardDescription className="line-clamp-2">
          {description || 'No description available'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">
              ${typeof price === 'number' ? price.toFixed(2) : price}
            </p>
            <Badge variant="outline" className="mt-1">
              {category.name}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/products/${id}`} className="w-full">
          <Button className="w-full" disabled={stock === 0}>
            {stock === 0 ? 'Out of Stock' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
