'use client'
import ChartView from '@/components/custom/ChartView'
import CodeView from '@/components/custom/CodeView'
import React from 'react'

const page = () => {
    return (
        <div className='px-3 pr-6 w-full mt-3'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                <ChartView/>
                <div className='col-span-2'>
                    <CodeView/>
                </div>
            </div>
        </div>
    )
}

export default page