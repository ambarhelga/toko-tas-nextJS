import { orders } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { PackageCheck, Package, Truck, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = orders.find((o) => o.id === params.id);
  // In a real app, you would fetch this from a DB. We are mocking it.
  if(!order) {
    const mockOrder = {
        id: params.id,
        date: new Date().toISOString().split('T')[0],
        items: [],
        total: 0,
        status: 'Processing' as const,
        deliveryOption: 'Standard' as const,
    };
    if (params.id.startsWith('ORD-')) {
        // use mock order
    } else {
        notFound();
    }
  }

  const orderStatuses = ['Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = order ? orderStatuses.indexOf(order.status) : 0;
  const progressValue = ((currentStatusIndex + 1) / orderStatuses.length) * 100;

  const statusIcons = {
    Processing: <Package className="h-6 w-6" />,
    Shipped: <Truck className="h-6 w-6" />,
    Delivered: <CheckCircle className="h-6 w-6" />,
  };
  
  if(!order) return notFound(); // Should be handled by real data fetch

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Order Details</CardTitle>
          <CardDescription>Order #{order.id} | Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Order Status: {order.status}</h3>
            <Progress value={progressValue} className="w-full" />
            <div className="mt-4 grid grid-cols-3 text-center text-sm text-muted-foreground">
              {orderStatuses.map((status, index) => (
                <div key={status} className={index <= currentStatusIndex ? 'font-semibold text-foreground' : ''}>
                    <div className="flex justify-center mb-1">
                        {statusIcons[status as keyof typeof statusIcons]}
                    </div>
                    {status}
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
             <h3 className="mb-4 text-lg font-semibold">Items</h3>
              <div className="space-y-4">
                {order.items.map(({ bag, quantity }) => (
                  <div key={bag.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border"><Image src={bag.imageUrl} alt={bag.name} fill className="object-cover" /></div>
                    <div className="flex-grow"><p className="font-semibold">{bag.name}</p><p className="text-sm text-muted-foreground">Qty: {quantity}</p></div>
                    <p className="font-semibold">${(bag.price * quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                 <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
                 <div className="text-muted-foreground">
                     <p>John Doe</p>
                     <p>123 Dream Lane</p>
                     <p>Styleville, ST 12345</p>
                     <p>United States</p>
                 </div>
             </div>
              <div>
                 <h3 className="mb-4 text-lg font-semibold">Payment Summary</h3>
                 <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between"><span>Subtotal:</span><span>${order.total.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Shipping:</span><span>$0.00</span></div>
                    <Separator />
                    <div className="flex justify-between font-bold text-foreground"><span>Total:</span><span>${order.total.toFixed(2)}</span></div>
                 </div>
             </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
