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
import React, { useContext, useEffect, useRef, useState } from 'react'
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
    const [isFocus, setIsFocus] = useState(false)
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        id && getWorkSpaceData();
    },[id,userDetail]);

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
        try{

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
        }catch(err){
            toast.error('Something went wrong while generating response')
            setLoading(false);
        }
        
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
        <div className='relative h-[85vh] py-1 w-full flex flex-col md:px-5 px-2'>
            <div className='flex-1 overflow-y-scroll thin-scrollbar '>
                {messages?.length > 0 && messages?.map((msg,index) => (
                    <div 
                        style={{
                            backgroundColor: '#272829'
                        }}
                        key={index} 
                        className='md:p-2.5 p-2 rounded-lg mb-2 text-[13px] md:text-sm flex items-start gap-3 leading-6 border border-white/5 shadow-sm'
                    >
                        {msg?.role === 'user' && <Image src={userDetail?.picture} alt='userImage' width={30} height={30} className='rounded-full mt-0.5' />}
                        <div className='flex-1 text-wrap prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:p-2 prose-pre:rounded-md'>
                            <ReactMarkDown>
                                {msg?.content}
                            </ReactMarkDown>
                        </div>
                    </div>
                ))}
                {loading && <div 
                    className='rounded-lg mb-2 flex items-center gap-2 w-fit ml-2'
                >
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-duration:0.8s]" style={{animationDelay: '0ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-duration:0.8s]" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-duration:0.8s]" style={{animationDelay: '300ms'}}></div>
                    </div>
                </div> }
                <div ref={messagesEndRef} />
            </div>

            {/* input section */}
            <div className='flex mb-2 md:mb-0  gap-2 relative items-center justify-center'>
                
                <div 
                    style={{backgroundColor:'#272a2b'}} 
                    className='p-4 border border-blue-500/50 flex items-start gap-4 justify-between rounded-xl max-w-xl w-full md:mt-2 transition-all duration-300'
                >
                    <div className='flex gap-3 w-full items-start'>
                        <textarea 
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    onGenerate(userInput);
                                }
                            }}
                            placeholder={'build Anything'} 
                            className='resize-none border-none md:text-base text-sm flex-1/2 w-full md:h-16 h-14 max-h-28 outline-none bg-transparent'
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