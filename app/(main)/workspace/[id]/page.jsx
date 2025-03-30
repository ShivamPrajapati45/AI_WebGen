'use client'
import ChartView from '@/components/custom/ChartView'
import CodeView from '@/components/custom/CodeView'
import React from 'react'

const page = () => {
    return (
        <div className='md:px-3 md:pr-6 w-full md:mt-3'>
            <div className='grid w-full grid-cols-1 md:grid-cols-3 gap-10'>
                <ChartView/>
                <div className='md:col-span-2'>
                    <CodeView/>
                </div>
            </div>
        </div>
    )
}

export default page