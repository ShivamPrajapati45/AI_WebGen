'use client'
import { UserDetailContext } from '@/context/userDetailContext'
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { useSidebar } from '../ui/sidebar';

const WorkSpaceHistory = () => {
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const convex = useConvex();
    const [workSpacesList,setWorkSpaceList] = useState();
    const {toggleSidebar} = useSidebar();

    useEffect(() => {
        userDetail&&getAllWorkSpaces();
    },[userDetail])

    const getAllWorkSpaces = async () => {
        const result = await convex.query(api.workspace.getAllWorkSpaces,{
            userId: userDetail?._id
        });
        setWorkSpaceList(result);
    }   

    return (
        <div className='flex flex-col'>
            <h2 className='font-medium text-lg text-center'>Your Chats</h2>
            <div className='px-1 thin-scrollbar overflow-y-scroll'>
                {workSpacesList&&workSpacesList?.map((workspace,index) => (
                    <Link
                        href={`/workspace/${workspace?._id}`}
                        key={index}
                    >
                        <h2 
                            onClick={toggleSidebar} 
                            className='text-sm text-gray-100 font-semibold px-2 py-1 text-center bg-[#222222] hover:bg-[#333666] my-1.5 rounded-md cursor-pointer'>
                                {workspace?.messages[0]?.content}
                            </h2>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default WorkSpaceHistory