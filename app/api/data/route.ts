import { error } from "console";
import { NextResponse } from "next/server";

export async function GET() {
    console.log("API HIT");
    const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=90&precision=5&x_cg_demo_api_key=${COINGECKO_API_KEY}`, {
            headers: {
                'content-type': 'application/json'
            }

        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from CoinGecko');
        }

        const data = await response.json();
        console.log(data);
        return NextResponse.json(data);
    }catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data from CoinGecko' }, { status: 500 });

    }
}