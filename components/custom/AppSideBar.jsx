import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from '../ui/sidebar'
import Image from 'next/image'
import { Button } from '../ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkSpaceHistory from './WorkSpaceHistory'
import SideBarFooter from './SideBarFooter'

const AppSideBar = () => {
    return (
        <Sidebar>
            <SidebarHeader>
                <Image src={'/vercel.svg'} alt='logo' width={30} height={30}/>
                <Button className={'mt-5'}>
                    <MessageCircleCode/>Start New Chat
                </Button>
            </SidebarHeader>
            <SidebarContent className={'p-5'}>
                <SidebarGroup />
                    <WorkSpaceHistory/>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                <SideBarFooter/>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSideBar