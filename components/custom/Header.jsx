'use client'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/userDetailContext'
// import { useSidebar } from '../ui/sidebar'
import { usePathname } from 'next/navigation'
import { LucideDownload, Rocket } from 'lucide-react'
import Link from 'next/link'
import { ActionContext } from '@/context/actionContext'

const Header = () => {
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const {action,setAction} = useContext(ActionContext);
    // const {toggleSidebar} = useSidebar();
    const path = usePathname();

    const onActionBtn = async (action) => {
        setAction({
            actionType: action,
            timeStamp: Date.now()
        })
    }

    return (
        <div className='flex py-3 justify-between px-10 items-center'>
            <Link href={'/'}>
                <Image src={'/vercel.svg'} height={40} width={40} alt='logo' />
            </Link>

            {!userDetail?.name ? <div className='flex gap-4'>
                <Button variant={'ghost'} className={'cursor-pointer'}>Sign In</Button>
                <Button className={'text-white cursor-pointer'} style={{
                    backgroundColor:Colors.BLUE
                }} >Get Started</Button>
            </div> : path?.includes('workspace') && <div className='flex items-center gap-2'>
                <Button onClick={() => onActionBtn('export')} className={'cursor-pointer text-white hover:bg-gray-700 transition-all duration-300'}><LucideDownload/>Export</Button>
                <Button onClick={() => onActionBtn('deploy')} className={'bg-blue-500 cursor-pointer text-white hover:bg-blue-600'}><Rocket/> Deploy</Button>
            </div>
            }
            {userDetail && <Image src={userDetail?.picture} alt='user' width={40} height={40} className='rounded-full'/>}
        </div>
    )
}

export default Header