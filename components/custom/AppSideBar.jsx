'use client'
import React, { useContext } from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from '../ui/sidebar'
import Image from 'next/image'
import { Button } from '../ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkSpaceHistory from './WorkSpaceHistory'
import SideBarFooter from './SideBarFooter'
import { UserDetailContext } from '@/context/userDetailContext'
import { usePathname, useRouter } from 'next/navigation'

const AppSideBar = () => {
    const router = useRouter();
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const path = usePathname();
    const handleClick = () => {
        if(path !== '/'){
            router.push('/');
        }
        return;
    }

    
    return (
        <Sidebar className={'outline-none border-none bg-[#171717]'}>
            <SidebarHeader className={`bg-[#171717] px-10 `}>
                <Button onClick = {handleClick} disabled={path == '/'}   className={'mt-5 bg-white  text-black cursor-pointer hover:bg-gray-100 transition-all flex items-center'}>
                    <MessageCircleCode className=''/> <span className='text-sm'>Start New Chat</span>
                </Button>
            </SidebarHeader>

            <SidebarContent className={`thin-scrollbar bg-[#171717] overflow-y-scroll`}>
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