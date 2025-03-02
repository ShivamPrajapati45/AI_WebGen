'use client'
import ChartView from '@/components/custom/ChartView'
import CodeView from '@/components/custom/CodeView'
import React from 'react'

const page = () => {
    return (
        <div className='mt-3 p-3 pr-5 w-full h-screen'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                <ChartView/>
                <div className='col-span-2'>
                    {/* <CodeView/> */}
                </div>
            </div>
        </div>
    )
}

export default page