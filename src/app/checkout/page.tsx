"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Truck } from 'lucide-react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().min(2),
  deliveryOption: z.enum(['Standard', 'Express']),
  cardName: z.string().min(2),
  cardNumber: z.string().length(16),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid format (MM/YY)'),
  cvc: z.string().length(3),
});

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryOption: 'Standard',
      country: 'United States',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: 'Order Placed!',
      description: 'Thank you for your purchase. We are processing your order.',
    });
    clearCart();
    const mockOrderId = 'ORD-' + Math.floor(Math.random() * 90000 + 10000);
    router.push(`/orders/${mockOrderId}`);
  };
  
  if (cart.length === 0) {
      // Redirect or show message if cart is empty
      if (typeof window !== 'undefined') {
        router.push('/cart');
      }
      return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-4xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                     <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="city" render={({ field }) => (
                     <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="postalCode" render={({ field }) => (
                    <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormField control={form.control} name="deliveryOption" render={({ field }) => (
                        <FormItem><FormControl>
                            <RadioGroup onValuechange={field.onChange} defaultValue={field.value} className="space-y-2">
                                <Label className="flex items-center gap-4 rounded-md border p-4 has-[input:checked]:border-primary">
                                    <RadioGroupItem value="Standard" id="standard" />
                                    <div className="flex items-center gap-2"><Truck className="h-5 w-5"/>Standard (5-7 days)</div>
                                    <span className="ml-auto font-semibold">Free</span>
                                </Label>
                                <Label className="flex items-center gap-4 rounded-md border p-4 has-[input:checked]:border-primary">
                                    <RadioGroupItem value="Express" id="express" />
                                    <div className="flex items-center gap-2"><Truck className="h-5 w-5"/>Express (1-2 days)</div>
                                    <span className="ml-auto font-semibold">$15.00</span>
                                </Label>
                            </RadioGroup>
                        </FormControl></FormItem>
                    )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField control={form.control} name="cardName" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="cardNumber" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Card Number</FormLabel><FormControl><div className="relative"><CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/><Input {...field} className="pl-10" placeholder="0000 0000 0000 0000"/></div></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="expiryDate" render={({ field }) => (
                        <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input {...field} placeholder="MM/YY"/></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="cvc" render={({ field }) => (
                        <FormItem><FormLabel>CVC</FormLabel><FormControl><Input {...field} placeholder="123"/></FormControl><FormMessage /></FormItem>
                    )}/>
                </CardContent>
              </Card>
              <Button type="submit" size="lg" className="w-full">
                Pay ${cartTotal.toFixed(2)}
              </Button>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader><CardTitle>In Your Cart</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map(({ bag, quantity }) => (
                  <div key={bag.id} className="flex items-center gap-4">
                     <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border"><Image src={bag.imageUrl} alt={bag.name} fill className="object-cover"/></div>
                     <div className="flex-grow"><p className="font-semibold">{bag.name}</p><p className="text-sm text-muted-foreground">Qty: {quantity}</p></div>
                     <p className="font-semibold">${(bag.price * quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4"/>
              <div className="space-y-2">
                 <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                 <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
                 <Separator className="my-2"/>
                 <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${cartTotal.toFixed(2)}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
