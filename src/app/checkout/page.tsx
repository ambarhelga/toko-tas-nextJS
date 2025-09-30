
"use client";

import { useState } from 'react';
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
import { CreditCard, Truck, QrCode } from 'lucide-react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().min(2),
  deliveryOption: z.enum(['Standard', 'Express']),
  paymentMethod: z.enum(['card', 'va', 'qris']),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.paymentMethod === 'card') {
        if (!data.cardName || data.cardName.length < 2) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name on card is required", path: ['cardName'] });
        }
        if (!data.cardNumber || data.cardNumber.length !== 16) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Card number must be 16 digits", path: ['cardNumber'] });
        }
        if (!data.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid format (MM/YY)", path: ['expiryDate'] });
        }
        if (!data.cvc || data.cvc.length !== 3) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CVC must be 3 digits", path: ['cvc'] });
        }
    }
});

type PaymentMethod = 'card' | 'va' | 'qris';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryOption: 'Standard',
      country: 'United States',
      paymentMethod: 'card'
    },
  });

  const deliveryOption = form.watch('deliveryOption');
  const deliveryFee = deliveryOption === 'Express' ? 15 : 0;
  const finalTotal = cartTotal + deliveryFee;

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
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                        <Label className="flex items-center gap-4 rounded-md border p-4 has-[input:checked]:border-primary">
                          <RadioGroupItem value="Standard" id="standard" />
                          <div className="flex items-center gap-2"><Truck className="h-5 w-5" />Standard (5-7 days)</div>
                          <span className="ml-auto font-semibold">Free</span>
                        </Label>
                        <Label className="flex items-center gap-4 rounded-md border p-4 has-[input:checked]:border-primary">
                          <RadioGroupItem value="Express" id="express" />
                          <div className="flex items-center gap-2"><Truck className="h-5 w-5" />Express (1-2 days)</div>
                          <span className="ml-auto font-semibold">$15.00</span>
                        </Label>
                      </RadioGroup>
                    </FormControl></FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup onValueChange={(value) => { field.onChange(value); setPaymentMethod(value as PaymentMethod); }} defaultValue={field.value} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <Label className="flex flex-col items-center justify-center gap-2 rounded-md border p-4 has-[input:checked]:border-primary">
                            <RadioGroupItem value="card" id="card" className="sr-only" />
                            <CreditCard className="h-8 w-8" />
                            <span>Credit Card</span>
                          </Label>
                          <Label className="flex flex-col items-center justify-center gap-2 rounded-md border p-4 has-[input:checked]:border-primary">
                            <RadioGroupItem value="va" id="va" className="sr-only" />
                            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 8.5C2 7.11929 3.11929 6 4.5 6H19.5C20.8807 6 22 7.11929 22 8.5V10H2V8.5Z" fill="currentColor" opacity="0.3"></path><path d="M2 12V15.5C2 16.8807 3.11929 18 4.5 18H19.5C20.8807 18 22 16.8807 22 15.5V12H2Z" fill="currentColor"></path></svg>
                            <span>Virtual Account</span>
                          </Label>
                          <Label className="flex flex-col items-center justify-center gap-2 rounded-md border p-4 has-[input:checked]:border-primary">
                            <RadioGroupItem value="qris" id="qris" className="sr-only" />
                            <QrCode className="h-8 w-8" />
                            <span>QRIS</span>
                          </Label>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )} />

                  {paymentMethod === 'card' && (
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                       <FormField control={form.control} name="cardName" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="cardNumber" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Card Number</FormLabel><FormControl><div className="relative"><CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input {...field} className="pl-10" placeholder="0000 0000 0000 0000" /></div></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="expiryDate" render={({ field }) => (
                        <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input {...field} placeholder="MM/YY" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="cvc" render={({ field }) => (
                        <FormItem><FormLabel>CVC</FormLabel><FormControl><Input {...field} placeholder="123" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  )}

                  {paymentMethod === 'va' && (
                    <div className="mt-6">
                      <Alert>
                        <AlertTitle>Virtual Account</AlertTitle>
                        <AlertDescription>
                          <p className="mb-4">Please complete your payment to one of the following virtual accounts:</p>
                          <ul className="space-y-2 list-disc pl-5">
                            <li>BCA Virtual Account: 1234567890123</li>
                            <li>Mandiri Virtual Account: 9876543210987</li>
                            <li>BNI Virtual Account: 5432109876543</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {paymentMethod === 'qris' && (
                     <div className="mt-6 flex flex-col items-center">
                        <Alert>
                            <AlertTitle className="text-center">Scan to Pay with QRIS</AlertTitle>
                            <AlertDescription className="flex flex-col items-center text-center">
                                <p className="mb-4">Scan the QR code below using your favorite banking or e-wallet app.</p>
                                <div className="relative h-48 w-48">
                                    <Image src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example" alt="QRIS Code" layout="fill" objectFit="contain" />
                                </div>
                            </AlertDescription>
                        </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Button type="submit" size="lg" className="w-full">
                Pay ${finalTotal.toFixed(2)}
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
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border"><Image src={bag.imageUrl} alt={bag.name} fill className="object-cover" /></div>
                    <div className="flex-grow"><p className="font-semibold">{bag.name}</p><p className="text-sm text-muted-foreground">Qty: {quantity}</p></div>
                    <p className="font-semibold">${(bag.price * quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    