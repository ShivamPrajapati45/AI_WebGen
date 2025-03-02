import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import React, { useReducer } from 'react'
import { Button } from '../ui/button'

const SideBarFooter = () => {
    const router = useReducer();

    const options = [
        {
            name: 'Settings',
            icon : Settings
        },
        {
            name: 'Help Center',
            icon: HelpCircle
        },
        {
            name: 'Subscription',
            icon: Wallet,
            path: '/pricing'
        },
        {
            name: 'Sign Out',
            icon: LogOut
        }
    ];

    const optionClick = (option) => {
        router.push(option.path);
    }

    
    return (
        <div className='p-2 mb-10'>
            {options.map((option,index) => (
                <Button onClick={() => router.push(option?.path)} variant={'ghost'} className={'w-full flex justify-start my-3'} key={index}>
                    <option.icon/>
                    {option.name}
                </Button>
            ))}
        </div>
    )
}

export default SideBarFooter