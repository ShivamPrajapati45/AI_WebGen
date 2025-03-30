import { genAICode } from "@/config/Aimodel";
import { NextResponse } from "next/server";

export async function POST(req){
    const {prompt} = await req.json();
    try {
        if(!prompt){
            throw new Error('Prompt is required')
        }
        // Send the prompt to the AI model and get the response
        const result = await genAICode.sendMessage(prompt);
        const resp = result.response.text();
        return NextResponse.json(JSON.parse(resp))

    } catch (error) {
        console.log('Something Went Wrong',error);
        return NextResponse.json({error:error.message})
    }
}