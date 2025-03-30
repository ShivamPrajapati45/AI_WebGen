'use client'
import { MessagesContext } from '@/context/messagesContext';
import { UserDetailContext } from '@/context/userDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, ArrowUp, Link, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkDown from 'react-markdown'
import { useSidebar } from '../ui/sidebar';
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
        <div className='relative h-[85vh]  py-1 w-full flex flex-col md:px-5 px-2'>
            <div className='flex-1 overflow-y-scroll thin-scrollbar '>
                {messages?.length > 0 && messages?.map((msg,index) => (
                    <div 
                        style={{
                            backgroundColor: '#272829'
                        }}
                        key={index} 
                        className='md:p-3 p-2 rounded-lg mb-2 text-sm flex items-center gap-2 leading-7'
                    >
                        {msg?.role === 'user' && <Image src={userDetail?.picture} alt='userImage' width={35} height={35} className='rounded-full' />}
                        <span className=' md:text-base text-wrap'>
                            <ReactMarkDown>{msg?.content}</ReactMarkDown>
                        </span>
                    </div>
                ))}
                {loading && <div style={{
                    backgroundColor:Colors.BACKGROUND
                }} className='md:p-3 p-2 rounded-lg md:mb-2 flex items-start gap-3'>
                    <Loader2Icon className='animate-spin'/>
                    <h2 className=''>Generating response...</h2>
                </div> }
            </div>

            {/* input section */}
            <div className='flex mb-2 md:mb-0  gap-2 relative items-center justify-center'>
                
                <div 
                    style={{backgroundColor:'#272a2b'}} 
                    className='p-2 border border-[#343738] flex items-start gap-4 justify-between rounded-xl max-w-xl w-full md:mt-2'
                >
                    {userDetail && <Image alt='user' onClick={toggleSidebar} src={userDetail?.picture} width={32} height={32} className='rounded-full cursor-pointer'/>}
                    <div className='flex gap-3 w-full items-start'>
                        <textarea 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={Lookup.INPUT_PLACEHOLDER} 
                            className='resize-none md:text-base text-sm flex-1/2 w-full md:h-16 h-14 max-h-28 outline-none bg-transparent'
                        />
                        {userInput && <ArrowUp
                            onClick={() => onGenerate(userInput)}
                            className='bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-full p-2 cursor-pointer h-8 w-8'
                        />}
                    </div>
                </div>

            </div>


        </div>
    )
}

export default ChartView