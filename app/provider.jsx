"use client"
import AppSideBar from '@/components/custom/AppSideBar'
import Header from '@/components/custom/Header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ActionContext } from '@/context/actionContext'
import { MessagesContext } from '@/context/messagesContext'
import { UserDetailContext } from '@/context/userDetailContext'
import { api } from '@/convex/_generated/api'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useConvex } from 'convex/react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Provider = ({children}) => {
    const [messages, setMessages] = useState();
    const [userDetail, setUserDetail] = useState();
    const [action, setAction] = useState(); 
    const convex = useConvex();
    const router = useRouter();
    useEffect(() => {
        IsAuthenticated(); 
    },[])

    // fetching user data from database
    const IsAuthenticated = async() => {
        if(typeof window !== undefined){
            const user = JSON.parse(localStorage.getItem('user'));
            if(!user){
                router.push('/')
                return;
            }
            const result = await convex.query(api.users.getUser,{
                email: user?.email
            });

            setUserDetail(result);
        }
    };

    return (
        <div className=''>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}}>
            <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
            <MessagesContext.Provider value={{messages,setMessages}}>
                <ActionContext.Provider value={{action,setAction}}>
                <NextThemeProvider
                    attribute='class'
                    defaultTheme='dark'
                    enableSystem
                    disableTransitionOnChange
                >
                        <Header/>
                    <SidebarProvider defaultOpen={false}>
                        <AppSideBar/>
                        {children}
                    </SidebarProvider>
                </NextThemeProvider>
                </ActionContext.Provider>
            </MessagesContext.Provider>
            </UserDetailContext.Provider>
            </PayPalScriptProvider>
            </GoogleOAuthProvider>
        </div>
    )
}

export default Provider