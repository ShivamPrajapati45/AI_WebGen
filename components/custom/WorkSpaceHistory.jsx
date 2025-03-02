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
        <div>
            <h2 className='font-medium text-lg'>Your Chats</h2>
            <div>
                {workSpacesList&&workSpacesList?.map((workspace,index) => (
                    <Link
                        href={`/workspace/${workspace?._id}`}
                        key={index}
                    >
                        <h2 
                            onClick={toggleSidebar} 
                            className='text-sm text-gray-400 mt-2 font-light cursor-pointer hover:text-white'>
                                {workspace?.messages[0]?.content}
                            </h2>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default WorkSpaceHistory