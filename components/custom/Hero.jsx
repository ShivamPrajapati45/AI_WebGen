'use client'
import { MessagesContext } from '@/context/messagesContext'
import { UserDetailContext } from '@/context/userDetailContext'
import Lookup from '@/data/Lookup'
import { ArrowRight, Link } from 'lucide-react'
import React, { useContext, useState } from 'react'
import AuthDialog from './AuthDialog'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import Colors from '@/data/Colors'
import { ActionContext } from '@/context/actionContext'


const Hero = () => {
    const [userInput, setUserInput] = useState('');
    const {messages, setMessages} = useContext(MessagesContext); 
    const {userDetail, setUserDetail} = useContext(UserDetailContext);
    const {action,setAction} = useContext(ActionContext);
    const [openDialog, setOpenDialog] = useState(false);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();
    const [btnHover, setBtnHover] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(null);

    const onGenerate = async (input) => {
        if(!userDetail?.name){
            setOpenDialog(true);
            return;
        }
        if(userDetail?.token < 10){
            toast('You dont have enough token')
            return;
        }
        const msg = {
            role:'user',
            content:input
        };
        setMessages(msg);
        
        const workspaceId = await CreateWorkspace({
            user: userDetail?._id,
            messages:[msg],
        });
        router.push('/workspace/'+workspaceId);  
        // console.log(workspaceId ); 

    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };


    return (
        <div className='flex flex-col mt-7 items-center justify-center gap-2'>
            <h2 className='font-bold text-4xl'>{Lookup.HERO_HEADING}</h2>
            <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p>

            <div 
                style={{
                    backgroundColor: Colors.BACKGROUND,
                }} 
                className='p-5 border-2 border-gray-600 rounded-xl max-w-2xl w-full mt-3'
            >
                <div className='flex gap-2'>
                    <textarea 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={Lookup.INPUT_PLACEHOLDER} 
                        className='resize-none w-full font-light h-32 max-h-44 outline-none bg-transparent'
                    />
                    {userInput && 
                    <div 
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => setBtnHover(false)}
                        className='px-1 rounded-md bg-sky-600 transition-all duration-200 h-9 cursor-pointer w-13 flex justify-center items-center'>
                        <ArrowRight 
                            onClick={() => onGenerate(userInput)}
                            className={`${btnHover ? 'translate-x-1.5 ' : ''} transition-all duration-200 ease-in-out`}
                        />
                    </div>
                    }
                    
                </div>
                <div className='hidden'>
                    <Link className='h-5 w-5 cursor-pointer hover:opacity-80 transition-opacity duration-300' />
                </div>
            </div>

            <div className='flex items-center justify-center flex-wrap gap-2 mt-3 max-w-2xl'>
                {Lookup.SUGGESTIONS.map((suggestion, index) => (
                        <h2 
                            key={index}
                            onClick={() => onGenerate(suggestion)}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            className='p-1 px-2 cursor-pointer text-gray-400 hover:text-gray-200' 
                            style={{
                                border: '2px solid', 
                                borderColor: hoverIndex === index 
                                    ? 'transparent' 
                                    : '#565657',  // Gray border by default
                                // borderRadius: '100px',
                                borderImage: hoverIndex === index 
                                    ? `linear-gradient(90deg, ${getRandomColor()}, ${getRandomColor()}) 1` 
                                    : 'none',
                                transition: 'border 0.3s, border-radius 0.3s'
                            }}
                        >
                                {suggestion}
                        </h2>
                ))}
            </div>
            <AuthDialog
                openDialog={openDialog}
                closeDialog={(e) => setOpenDialog(e)} 
            />
        </div>
    )
}

export default Hero