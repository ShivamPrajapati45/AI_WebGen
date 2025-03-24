'use client'
import React, { useContext } from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from '../ui/sidebar'
import Image from 'next/image'
import { Button } from '../ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkSpaceHistory from './WorkSpaceHistory'
import SideBarFooter from './SideBarFooter'
import { UserDetailContext } from '@/context/userDetailContext'

const AppSideBar = () => {
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    
    return (
        <Sidebar className={'bg-[#141414] border-none outline-none'}>
            <SidebarHeader className={''}>
                <Button className={'mt-5 bg-white px-2 py-1 text-black cursor-pointer hover:bg-gray-100 transition-all flex items-center'}>
                    <MessageCircleCode className=''/> <span className='text-lg'>Start New Chat</span>
                </Button>
            </SidebarHeader>

            <SidebarContent className={'thin-scrollbar overflow-y-scroll'}>
                <SidebarGroup />
                    <WorkSpaceHistory/>
                <SidebarGroup />
            </SidebarContent>
            

            {userDetail && <SidebarFooter>
                <SideBarFooter/>
            </SidebarFooter>
            }
            
        </Sidebar>
    )
}

export default AppSideBar