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
    const [userInput, setUserInput] = useState();
    const {messages, setMessages} = useContext(MessagesContext); 
    const {userDetail, setUserDetail} = useContext(UserDetailContext);
    const {action,setAction} = useContext(ActionContext);
    const [openDialog, setOpenDialog] = useState(false);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();

    // console.log('user',userDetail);
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

    }

    

    return (
        <div className='flex flex-col items-center justify-center gap-2'>
            <h2 className='font-bold text-4xl'>{Lookup.HERO_HEADING}</h2>
            <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p>

            <div style={{backgroundColor: Colors.BACKGROUND}} className='p-5 border rounded-xl max-w-2xl w-full mt-3'>
                <div className='flex gap-2'>
                    <textarea 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={Lookup.INPUT_PLACEHOLDER} 
                        className='resize-none w-full h-32 max-h-44 outline-none bg-transparent'
                    />
                    {userInput && <ArrowRight 
                        onClick={() => onGenerate(userInput)}
                        className='bg-blue-500 p-2 h-8 w-8 rounded-md'
                    />}
                    
                </div>
                <div className='hidden'>
                    <Link className='h-5 w-5 cursor-pointer hover:opacity-80 transition-opacity duration-300' />
                </div>
            </div>

            <div className='flex items-center justify-center flex-wrap gap-2 mt-3 max-w-2xl'>
                {Lookup.SUGGESTIONS.map((suggestion, index) => (
                    <h2 
                        onClick={() => onGenerate(suggestion)}
                        className='p-1 px-2 rounded-full border cursor-pointer text-gray-400 hover:text-gray-200' 
                        key={index}>{suggestion}</h2>
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