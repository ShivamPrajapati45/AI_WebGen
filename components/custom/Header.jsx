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
import { SidebarTrigger } from '../ui/sidebar'


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
        };
        window.addEventListener('scroll',handleScroll);
        return () => {
            window.removeEventListener('scroll',handleScroll);
        }
    },[])
    


    return (
        <header className={`${scrolled ? 'bg-[#2a2a2b] transition-all duration-200' : ''} md:bg-transparent sticky top-0 z-50 shadow-md flex items-center justify-between md:justify-between md:gap-10 w-full px-3 md:px-8 py-3`}>
            {/* Sidebar Trigger - Top Left */}
            <div className='flex md:gap-3 items-center justify-center'>
                <SidebarTrigger className="h-10 w-10 rounded-full hover:bg-[#383838] transition duration-300 cursor-pointer" />

                {/* Logo */}
                <Link href={"/"} className="font-semibold text-sm md:text-lg text-blue-500">
                    WebGEN
                </Link>
            </div>

            {/* Auth or User Profile */}
            <div className='flex items-center justify-center'>
                {!userDetail?.name ? <div className='flex gap-2 items-center justify-end'>
                    <Button 
                        onClick = {() => setOpenDialog(true)}
                        className={'cursor-pointer text-xs md:text-base px-2.5  hover:bg-blue-700 bg-blue-800 transition-all duration-200 uppercase'}>Sign In</Button>
                    <Button 
                        onClick = {() => setOpenDialog(true)}
                        className={'text-white cursor-pointer px-3 text-xs md:text-base uppercase hover:bg-blue-700 bg-blue-800 transition-all'}>Get Started</Button>
                </div> : path?.includes('workspace') && <div className='flex items-center justify-center gap-2'>
                    <Button 
                        onClick={() => onActionBtn('export')} 
                        className={'cursor-pointer bg-[#2a2a2b] text-white hover:bg-gray-700 transition-all duration-300'}
                    >
                            <LucideDownload/>
                            <span className='hidden md:block'>Export</span>
                    </Button>
                    <Button 
                        onClick={() => onActionBtn('deploy')} 
                        className={'bg-blue-600 cursor-pointer text-white hover:bg-blue-500'}
                    >
                        <Rocket className=''/> 
                        <span className='hidden md:block'>Deploy</span>
                    </Button>
                </div>
                }
            </div>

            {/* {userDetail && <Image src={userDetail?.picture} alt='user' width={40} height={40} className='rounded-full'/>} */}
            {userDetail && <img src={userDetail?.picture} alt='user' className='rounded-full h-8 w-8'/>}

            <AuthDialog openDialog={openDialog} closeDialog={(e) => setOpenDialog(e)} />
        </header>
    )
}

export default Header