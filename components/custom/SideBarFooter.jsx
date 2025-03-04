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
        router.push(option?.path);
    }

    
    return (
        <div className=''>
            {options.map((option,index) => (
                <Button 
                    onClick={() => optionClick(option)}
                    variant={'ghost'} 
                    className={'w-full text-base bg-[#141313] cursor-pointer hover:bg-[#242424] text-white flex justify-start my-1'} 
                    key={index}
                >
                    <option.icon/>
                    {option.name}
                </Button>
            ))}
        </div>
    )
}

export default SideBarFooter