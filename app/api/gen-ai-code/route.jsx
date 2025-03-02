import { genAICode } from "@/config/Aimodel";
import { NextResponse } from "next/server";

export async function POST(req){
    const {prompt} = await req.json();
    try {
        const result = await genAICode.sendMessage(prompt);
        const resp = result.response.text();
        return NextResponse.json(JSON.parse(resp))

    } catch (error) {
        return NextResponse.json({error:error.message})
    }
}