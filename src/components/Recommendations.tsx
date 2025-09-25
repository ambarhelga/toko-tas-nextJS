"use client";

import { useState, useTransition } from 'react';
import type { Bag } from '@/lib/types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { useAppContext } from '@/hooks/useAppContext';
import { getRecommendations } from '@/app/actions';
// import { Skeleton } from './ui/skeleton';
import BagCard from './BagCard';
import { Sparkles } from 'lucide-react';

interface RecommendationsProps {
  allBags: Bag[];
}

const Recommendations = ({ allBags }: RecommendationsProps) => {
  const { browsingHistory } = useAppContext();
  const [preferences, setPreferences] = useState('');
  const [recommendations, setRecommendations] = useState<Bag[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    startTransition(async () => {
      const historyText = browsingHistory.join(', ');
      const result = await getRecommendations(historyText, preferences);
      
      if (result.recommendations) {
        const recommendedNames = result.recommendations.split(',').map(name => name.trim().toLowerCase());
        const foundBags = allBags.filter(bag => recommendedNames.includes(bag.name.toLowerCase()));
        setRecommendations(foundBags);
      }
    });
  };

  return (
    <section className="mb-12">
        <Card className="bg-secondary/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Personalized For You
                </CardTitle>
                <CardDescription>
                    Tell us your style, and our AI will find the perfect bags for you based on your taste and browsing history.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Textarea
                            placeholder="e.g., 'I love vintage styles, dark colors, and need something for everyday use.'"
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                            className="h-24"
                        />
                        <Button onClick={handleSubmit} disabled={isPending}>
                            {isPending ? 'Finding Bags...' : 'Get Recommendations'}
                        </Button>
                    </div>
                    <div className="min-h-[200px] rounded-lg border border-dashed p-4">
                        {isPending ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-muted-foreground">
                                    <Sparkles className="mx-auto h-8 w-8 animate-pulse text-primary"/>
                                    <p>Our AI is searching...</p>
                                </div>
                            </div>
                        ) : recommendations.length > 0 ? (
                            <Carousel opts={{ align: "start", loop: true }}>
                                <CarouselContent>
                                    {recommendations.map(bag => (
                                        <CarouselItem key={bag.id} className="md:basis-1/2 lg:basis-1/3">
                                            <div className="p-1">
                                                <BagCard bag={bag} />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-center text-muted-foreground">
                                    Your recommended bags will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    </section>
  );
};

export default Recommendations;
