'use client'
import PricingModel from '@/components/custom/PricingModel';
import { UserDetailContext } from '@/context/userDetailContext'
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import React, { useContext } from 'react'

const page = () => {
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    return (
        <div className='mt-8 w-full flex flex-col items-center p-10 md:px-32 lg:px-48'>
            <h2 className='font-bold text-5xl'>Pricing</h2>
            <p className='text-gray-400 max-w-xl text-center mt-4'>{Lookup.PRICING_DESC}</p>

            <div style={{
                backgroundColor:Colors.BACKGROUND
            }} className='p-5 border rounded-full w-full flex justify-between mt-7 items-center'>
                <h2 className='text-lg'>
                    <span className='font-bold'>{userDetail?.token}</span>
                </h2>
                <div className=''>
                    <h2 className='font-medium'>Need more token ?</h2>
                    <p>Upgrade your plan below</p>
                </div>
            </div>
            <PricingModel/>
        </div>
    )
}

export default page