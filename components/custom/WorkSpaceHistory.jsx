'use client'
import { UserDetailContext } from '@/context/userDetailContext'
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { useSidebar } from '../ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const WorkSpaceHistory = () => {
    const {userDetail,setUserDetail,isLoading,setIsLoading} = useContext(UserDetailContext);
    const convex = useConvex();
    const [workSpacesList,setWorkSpaceList] = useState();
    const {toggleSidebar} = useSidebar();
    const path = usePathname();
    const router = useRouter();
    


    useEffect(() => {
        if(userDetail){
            getAllWorkSpaces();
        }
    },[userDetail])

    const getAllWorkSpaces = async () => {
        try{
            const result = await convex.query(api.workspace.getAllWorkSpaces,{
                userId: userDetail?._id
            });
            setWorkSpaceList(result);
        }catch(err){
            console.error('Failed to fetch workspaces history:', err)
        }
    
    }  

    const clickHandler =  (workspace_id) => {
        try{
            setIsLoading(true);
            setTimeout(() => {
                router.push(`/workspace/${workspace_id}`);
                setIsLoading(false)
            }, 1500);

        }catch(err){
            toast.error('Something went wrong! try again')
        }
    }

    return (
        <div className='px-3'>            
            <h2 className='text-gray-400 text-xs mb-2 mt-2 font-medium uppercase tracking-wider'>Your Chats</h2>
            <div className='flex flex-col gap-0.5'>
                {workSpacesList && [...workSpacesList].reverse().map((workspace, index) => {
                    const isActive = path === `/workspace/${workspace?._id}`
                    return (
                        <Link
                            href={`/workspace/${workspace?._id}`}
                            key={index}
                            onClick={(e) => {
                                e.preventDefault()
                                clickHandler(workspace?._id)
                            }}
                        >
                            <h2 
                                onClick={toggleSidebar} 
                                className={`text-sm text-white/70 py-2 px-3 hover:bg-[#2f2f2f] hover:text-white my-0.5 rounded-lg cursor-pointer truncate transition-all duration-200 ${isActive ? 'bg-[#2f2f2f] text-white font-medium' : ''}`}>
                                    {workspace?.messages[0]?.content || 'New Chat'}
                                </h2>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default WorkSpaceHistory