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
        console.log('Something Went Wrong',error);
        return NextResponse.json({error});
    }
}