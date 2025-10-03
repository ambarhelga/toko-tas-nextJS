
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAppContext } from '@/hooks/useAppContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email('Alamat email tidak valid.'),
});

export default function ForgotPasswordPage() {
  const { sendPasswordResetEmail } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const result = await sendPasswordResetEmail(values.email);
    setIsSubmitting(false);
    if (result.success) {
      setEmailSent(true);
      form.reset();
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Lupa Kata Sandi</CardTitle>
          <CardDescription>Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            <Alert variant="default" className="bg-green-100 border-green-400 text-green-700">
              <AlertTitle>Periksa Email Anda!</AlertTitle>
              <AlertDescription>
                Jika akun dengan email tersebut ada, kami telah mengirimkan tautan pengaturan ulang kata sandi.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="anda@contoh.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Tautan Pengaturan Ulang'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex-col">
          <p className="text-center text-sm text-muted-foreground">
            Ingat kata sandi Anda?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    