'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/userDetailContext'
import { usePathname } from 'next/navigation'
import { LucideDownload, Rocket } from 'lucide-react'
import Link from 'next/link'
import { ActionContext } from '@/context/actionContext'
import AuthDialog from './AuthDialog'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import AppSideBar from './AppSideBar'


const Header = () => {
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const {action,setAction} = useContext(ActionContext);
    const [scrolled, setScrolled] = useState(false);
    const path = usePathname();
    const [openDialog, setOpenDialog] = useState(false);

    const onActionBtn = async (action) => {
        setAction({
            actionType: action,
            timeStamp: Date.now()
        })
    };


    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 25){
                setScrolled(true);

            }else{
                setScrolled(false);
            }
            // console.log(window.scrollY);
        };
        // window.addEventListener('scroll', handleScroll);
        // return () => window.removeEventListener('scroll',handleScroll);
    },[])
    


    return (
        <header className="sticky top-0 z-50 shadow-md flex items-center justify-between px-8 py-3">
            {/* Sidebar Trigger - Top Left */}
            <div className='flex gap-3 items-center justify-center'>
                <SidebarTrigger className="p-2 rounded-full hover:bg-gray-700 transition duration-300 cursor-pointer" />

                {/* Logo */}
                <Link href={"/"} className="text-white font-semibold text-lg">
                    WebGEN
                </Link>
            </div>

            {/* Auth or User Profile */}
            {!userDetail?.name ? <div className='flex gap-4'>
                <Button 
                    onClick = {() => setOpenDialog(true)}
                    variant={'ghost'} className={'cursor-pointer hover:bg-[#333333] transition-all duration-200 uppercase'}>Sign In</Button>
                <Button 
                    onClick = {() => setOpenDialog(true)}
                    className={'text-white cursor-pointer uppercase hover:bg-blue-700 bg-blue-800 transition-all'}>Get Started</Button>
            </div> : path?.includes('workspace') && <div className='flex items-center gap-2'>
                <Button 
                    onClick={() => onActionBtn('export')} 
                    className={'cursor-pointer text-white hover:bg-gray-700 transition-all duration-300'}><LucideDownload/>Export</Button>
                <Button 
                    onClick={() => onActionBtn('deploy')} 
                    className={'bg-blue-500 cursor-pointer text-white hover:bg-blue-600'}><Rocket/> Deploy</Button>
            </div>
            }
            {userDetail && <Image src={userDetail?.picture} alt='user' width={40} height={40} className='rounded-full'/>}

            <AuthDialog openDialog={openDialog} closeDialog={(e) => setOpenDialog(e)} />
        </header>
    )
}

export default Header