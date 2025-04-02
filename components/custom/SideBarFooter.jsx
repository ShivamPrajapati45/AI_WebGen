'use client'
import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { UserDetailContext } from '@/context/userDetailContext'
import toast from 'react-hot-toast'

const SideBarFooter = () => {
    const router = useRouter();
    const {userDetail,setUserDetail} = useContext(UserDetailContext)
    const options = [
        {
            name: 'Settings',
            icon : Settings
        },
        {
            name: 'Help Center',
            icon: HelpCircle
        },
        // {
        //     name: 'Subscription',
        //     icon: Wallet,
        //     path: '/pricing'
        // },
        {
            name: 'Sign Out',
            icon: LogOut,
            logout: true

        }
    ];

    const optionClick = (option) => {
        router.push(option?.path);
        if(option.path){
            router.push(option?.path);
        }else if(option.logout){
            logout();
        }
    };

    const logout = () => {
        if(userDetail){
            localStorage.removeItem('user');
            toast.success('See you soon.. you are logged out');

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };


    
    return (
        <div className='p-1'>
            {options.map((option,index) => (
                <Button 
                    // onClick={() => optionClick(option)}
                    variant={'ghost'} 
                    className={'w-full text-sm my-1 opacity-80 hover:opacity-100 bg-[#141313] cursor-pointer hover:bg-[#242424] text-white flex justify-start'} 
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