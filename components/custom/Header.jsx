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
        <div className='flex p-4 justify-between items-center'>
            <Link href={'/'}>
                <Image src={'/vercel.svg'} height={40} width={40} alt='logo' />
            </Link>

            {!userDetail?.name ? <div className='flex gap-4'>
                <Button variant={'ghost'} className={'cursor-pointer'}>Sign In</Button>
                <Button className={'text-white cursor-pointer'} style={{
                    backgroundColor:Colors.BLUE
                }} >Get Started</Button>
            </div> : path?.includes('workspace') && <div className='flex items-center gap-2'>
                <Button onClick={() => onActionBtn('export')} variant={'ghost'}><LucideDownload/>Export</Button>
                <Button onClick={() => onActionBtn('deploy')} className={'bg-blue-500 text-white hover:bg-blue-600'}><Rocket/> Deploy</Button>
                {userDetail && <Image  src={userDetail?.picture} alt='user' width={30} height={30} className='rounded-full w-[30px]'/>}
            </div>
            }
        </div>
    )
}

export default Header