'use client'
import { MessagesContext } from '@/context/messagesContext';
import { UserDetailContext } from '@/context/userDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkDown from 'react-markdown'
import { useSidebar } from '../ui/sidebar';
import { updateToken } from '@/convex/users';
import { toast } from 'sonner';

export const countToken = (inputText) => {
    return inputText.trim().split(/\s+/).filter(word => word).length;
};

const ChartView = () => {
    const {id} = useParams();
    const convex = useConvex();
    const {messages,setMessages} = useContext(MessagesContext);
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const [userInput, setUserInput] = useState('');
    const [loading,setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.updateMessages);
    const UpdateToken = useMutation(api.users.updateToken);
    const {toggleSidebar} = useSidebar();

    useEffect(() => {
        id && getWorkSpaceData();
    },[id]);

    // use to get workspace data using workspace id
    const getWorkSpaceData = async () => {
        const result = await convex.query(api.workspace.getWorkSpace,{
            workspaceId: id
        });
        setMessages(result?.messages);
    };

    useEffect(() => {
        if(messages?.length > 0){
            const role = messages[messages?.length - 1].role;
            if(role === 'user'){
                getAiResponse();
            }
        }
    },[messages])

    // use to get ai response
    const getAiResponse = async () => {
        setLoading(true);
        const prompt = JSON.stringify(messages)+Prompt.CHAT_PROMPT;
        const result = await axios.post('/api/ai-chat',{
            prompt: prompt
        });
        const aiRes = {
            role: 'ai',
            content: result.data.result
        }
        setMessages(prev => [...prev,aiRes]);
        
        await UpdateMessages({
            messages: [...messages,aiRes],
            workspaceId: id
        })

        const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiRes)));
        setUserDetail(prev => ({
            ...prev,
            token:token
        }));
        // Updating token
        await UpdateToken({
            userId: userDetail?._id,
            token: token
        })
        
        setLoading(false);

        // console.log(result.data.result);
    }

    const onGenerate = async (userInput) => {
        if(userDetail?.token < 10){
            toast('You dont have enough token')
            return;
        }
        setMessages(prev => [...prev,{
            role: 'user',
            content:userInput
        }]);
        setUserInput('');
    }

    return (
        <div className='relative h-[85vh] flex flex-col'>
            <div className='flex-1 overflow-y-scroll pl-5'>
                {messages?.length > 0 && messages?.map((msg,index) => (
                    <div 
                        style={{
                            backgroundColor: Colors.BACKGROUND
                        }}
                        key={index} 
                        className='p-3 rounded-lg mb-2 flex items-center gap-2 leading-7'
                    >
                        {msg?.role === 'user' && <Image src={userDetail?.picture} alt='userImage' width={35} height={35} className='rounded-full' />}
                        <ReactMarkDown>{msg?.content}</ReactMarkDown>
                    </div>
                ))}
                {loading && <div style={{
                    backgroundColor:Colors.BACKGROUND
                }} className='p-3 rounded-lg mb-2 flex items-start gap-3'>
                    <Loader2Icon className='animate-spin'/>
                    <h2>Generating response...</h2>
                </div> }
            </div>

            {/* input section */}
            <div className='flex gap-2 items-end'>
                {userDetail && <Image onClick={toggleSidebar} src={userDetail?.picture} width={30} height={30} className='rounded-full cursor-pointer'/>}
                <div 
                    style={{backgroundColor: Colors.BACKGROUND}} 
                    className='p-5 border rounded-xl max-w-xl w-full mt-3'
                >
                    <div className='flex gap-2'>
                        <textarea 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={Lookup.INPUT_PLACEHOLDER} 
                            className='resize-none w-full h-24 max-h-28 outline-none bg-transparent'
                        />
                        {userInput && <ArrowRight 
                            onClick={() => onGenerate(userInput)}
                            className='bg-blue-500 p-2 h-8 w-8 rounded-md'
                        />}
                        
                    </div>
                    <div>
                        <Link className='h-5 w-5 cursor-pointer hover:opacity-80 transition-opacity duration-300' />
                    </div>
                </div>
            </div>


        </div>
    )
}

export default ChartView