'use client'
import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { UserDetailContext } from '@/context/userDetailContext'
import toast from 'react-hot-toast'
import LogoutConfirmDialog from './LogoutConfirmDialog'
import Image from 'next/image'

const SideBarFooter = () => {
    const router = useRouter();
    const {userDetail,setUserDetail} = useContext(UserDetailContext)
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    
    const options = [
        {
            name: 'Sign Out',
            icon: LogOut,
            logout: true

        }
    ];

    const optionClick = (option) => {
        if(option.path){
            router.push(option?.path);
        }else if(option.logout){
            setShowLogoutDialog(true);
        }
    };

    const logout = () => {
        if(userDetail){
            setShowLogoutDialog(false);
            setLoggingOut(true);
            
            localStorage.removeItem('user');
            toast.success('See you soon.. you are logged out');

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };
    
    return (
        <div className='p-2 bg-[#171717] border-t border-gray-800/50'>
            {userDetail && (
                <div className='flex items-center gap-3 p-3 mb-2 rounded-xl bg-gray-900/40'>
                    {userDetail?.picture && (
                        <Image src={userDetail?.picture} height={35} width={35} alt='user' className='rounded-full'/>
                    )}
                    <div className='flex flex-col truncate'>
                        <span className='text-sm font-semibold text-white truncate'>
                            {userDetail?.name}
                        </span>
                        <span className='text-[11px] text-gray-500 truncate'>
                            {userDetail?.email}
                        </span>
                    </div>
                </div>
            )}
            
            {options.map((option,index) => (
                <Button 
                    onClick={() => optionClick(option)}
                    variant={'ghost'} 
                    className={`w-full text-sm my-1 gap-2 cursor-pointer transition-all duration-200 flex justify-start items-center p-3 rounded-lg
                        ${option.logout 
                            ? 'bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/20' 
                            : 'bg-transparent text-white/80 hover:bg-[#2f2f2f] hover:text-white'}`}
                    key={index}
                >
                    <option.icon className={`h-4 w-4 ${option.logout ? '' : 'text-gray-400'}`}/>
                    {option.name}
                </Button>
            ))}
            
            <LogoutConfirmDialog 
                open={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                onConfirm={logout}
            />

            {/* Logout Overlay Loader */}
            {loggingOut && (
                <div className='fixed inset-0 flex h-screen w-screen items-center justify-center bg-black/80 backdrop-blur-md z-[9999]'>
                    <div className="flex flex-col items-center gap-4 p-8 bg-gray-900/90 rounded-2xl border border-gray-700 shadow-2xl">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 border-solid"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="h-8 w-8 bg-blue-500/20 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-white mb-2">Logging Out</h3>
                            <p className="text-gray-400 text-sm">Please wait...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SideBarFooter