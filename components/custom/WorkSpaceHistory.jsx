'use client'
import { UserDetailContext } from '@/context/userDetailContext'
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { useSidebar } from '../ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';

const WorkSpaceHistory = () => {
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const convex = useConvex();
    const [workSpacesList,setWorkSpaceList] = useState();
    const {toggleSidebar} = useSidebar();
    const router = usePathname();
    const rout = useRouter();
    // console.log(rout?.pathname);
    // console.log(router);
    

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
            <h2 className='font-semibold text-base text-center uppercase'>Your Chats</h2>
            <div className='p-1 thin-scrollbar overflow-y-scroll '>
                {workSpacesList&&workSpacesList?.map((workspace,index) => {
                    const isActive = router === `/workspace/${workspace?._id}`
                    return (
                        <Link
                            href={`/workspace/${workspace?._id}`}
                            key={index}
                            >
                            <h2 
                                onClick={toggleSidebar} 
                                className={`text-sm opacity-60  border-gray-600 font-semibold py-2 text-center hover:opacity-100 hover:bg-[#222222] my-1.5 rounded-md cursor-pointer ${isActive ? 'bg-[#222222] opacity-100 text-blue-400' : ''}`}>
                                    {workspace?.messages[0]?.content}
                                </h2>
                        </Link>

                    )})}
            </div>
        </div>
    )
}

export default WorkSpaceHistory