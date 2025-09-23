"use server";

import { personalizedBagRecommendations } from "@/ai/flows/personalized-bag-recommendations";

export async function getRecommendations(browsingHistory: string, preferences: string) {
    try {
        const result = await personalizedBagRecommendations({ browsingHistory, preferences });
        return result;
    } catch(error) {
        console.error("Error getting recommendations:", error);
        return { recommendations: "" };
    }
}
