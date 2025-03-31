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
    const {userDetail, setUserDetail,isLoading,setIsLoading} = useContext(UserDetailContext);
    const {action,setAction} = useContext(ActionContext);
    const [openDialog, setOpenDialog] = useState(false);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();
    const [btnHover, setBtnHover] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const onGenerate = async (input) => {
        try{
            setLoading(true);
            if(!userDetail?.name){
                setOpenDialog(true);
                setLoading(false);
                return;
            }
            if(userDetail?.token < 10){
                toast('You dont have enough token')
                setLoading(false);
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
            setLoading(false); 

        }catch(err){
            console.error('Error:', err);
            toast.error('Something went wrong !!')
            setLoading(false);
            
        }finally{
            setLoading(false);
        }
        

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

        <div className='relative flex flex-col mt-7 h-full w-full items-center justify-center gap-2'>

            {/* Overlay loader */}
            {loading && <div className='absolute inset-0 flex h-[100vh] w-[100vw] my-auto items-center justify-center bg-black/60 z-50'>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                </div>}

            <h2 className='font-bold text-xl md:text-3xl mx-auto'>{Lookup.HERO_HEADING}</h2>
            <p className='text-gray-400 mx-auto text-sm md:text-lg text-nowrap font-medium'>{Lookup.HERO_DESC}</p>

            <div 
                style={{
                    backgroundColor: Colors.BACKGROUND,
                }} 
                className={`p-5 border-2 rounded-xl max-w-2xl w-full mt-3 transition-all duration-200 ${isFocused ? 'border-blue-500 ' : 'border-gray-600'}`}
            >
                <div className='flex gap-2'>
                    <textarea 
                        value={userInput}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        rows={1}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={Lookup.INPUT_PLACEHOLDER} 
                        className='resize-none w-full font-light text-sm md:text-lg h-24 md:h-32 max-h-44 bg-transparent  outline-none' 
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
                    <Link className='h-4 w-4 cursor-pointer hover:opacity-80 transition-opacity duration-300' />
                </div>
            </div>

            <div className='flex items-center justify-center flex-wrap w-full gap-2 mt-3 max-w-2xl'>
                {Lookup.SUGGESTIONS.map((suggestion, index) => (
                        <h2 
                            key={index}
                            onClick={() => onGenerate(suggestion)}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            className='p-1.5 md:p-1 md:px-3 px-2 text-xs md:text-base cursor-pointer text-gray-400 hover:text-gray-200' 
                            style={{
                                border: '2px solid', 
                                borderRadius: hoverIndex === index ? '20px' : '100px',
                                borderColor: hoverIndex === index 
                                    ? 'transparent' 
                                    : '#565657aa',  // Gray border by default
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