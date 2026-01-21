import { chatSession } from "@/config/Aimodel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {prompt} = await req.json();

    try {
        if(prompt){

            const result = await chatSession.sendMessage(prompt);
            const AIRes = result.response.text();
            
            return NextResponse.json({result: AIRes});
        };
            
    } catch (error) {
        if (error?.status === 429) {
            return NextResponse.json({
                error: "Rate limit exceeded. Please wait a minute and try again."
            }, { status: 429 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' });
    }
}