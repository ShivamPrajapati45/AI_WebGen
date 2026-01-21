import { genAICode } from "@/config/Aimodel";
import { NextResponse } from "next/server";

export const config = {
    runtime: 'edge',
}

export async function POST(req){

    const {prompt} = await req.json();
    
    if(!prompt){
        throw new Error('Prompt is required')
    }

    try {
        // Send the prompt to the AI model and get the response
        const result = await genAICode.sendMessage(prompt);
        const resp = await result.response.text();
        return NextResponse.json(JSON.parse(resp));

    } catch (error) {
        if (error?.status === 429) {
            return NextResponse.json({
                error: "Rate limit exceeded. Please wait a minute and try again."
            }, { status: 429 });
        }
        return NextResponse.json({error:error.message})
    }
}