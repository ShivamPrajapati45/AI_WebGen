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
            // setLoading(true)
            setIsLoading(true);
            setTimeout(() => {
                router.push(`/workspace/${workspace_id}`);
                setIsLoading(false)
            }, 1500);
            // router.push(`/workspace/${workspace_id}`);
            // setLoading(false);

        }catch(err){
            toast.error('Something went wrong! try again')
        }
    }

    return (
        <div className='flex flex-col'>            
            <h2 className='font-semibold text-base text-center uppercase'>Your Chats</h2>
            <hr className='mx-5 border-[1.1px] rounded-full text-gray-400' />
            <div className='p-1 thin-scrollbar overflow-y-scroll '>
                {workSpacesList&&workSpacesList?.map((workspace,index) => {
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
                                className={`text-sm opacity-60 text-wrap  border-gray-600 py-2 text-center hover:opacity-100 hover:bg-[#222222] my-1.5 rounded-md cursor-pointer ${isActive ? 'bg-[#222222] opacity-100 text-blue-400' : ''}`}>
                                    {workspace?.messages[0]?.content}
                                </h2>
                        </Link>

                    )})}
            </div>
        </div>
    )
}

export default WorkSpaceHistory