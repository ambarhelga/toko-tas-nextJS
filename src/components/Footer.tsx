import Link from 'next/link';
import { Sparkles, Twitter, Instagram, Facebook } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
             <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-headline text-2xl font-bold">BagTrendz</span>
            </Link>
            <p className="mt-4 text-muted-foreground">
              Discover the latest trends in bags.
            </p>
          </div>
          <div className="col-span-1">
            <h3 className="font-headline font-semibold">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground">All Bags</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">New Arrivals</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Best Sellers</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-headline font-semibold">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQs</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Shipping & Returns</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-headline font-semibold">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="#"><Twitter /><span className="sr-only">Twitter</span></a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#"><Instagram /><span className="sr-only">Instagram</span></a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#"><Facebook /><span className="sr-only">Facebook</span></a>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BagTrendz. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
