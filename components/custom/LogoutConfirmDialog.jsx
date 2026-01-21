import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { AlertTriangle } from 'lucide-react'

const LogoutConfirmDialog = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog 
            open={open} 
            onOpenChange={onClose}
        >
            <DialogContent className={'border-2 border-gray-500 flex justify-center items-center my-auto rounded-lg bg-[#323438] p-6 w-[400px] md:w-[450px]'}>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <div className='bg-yellow-500/20 p-4 rounded-full'>
                            <AlertTriangle className='h-12 w-12 text-yellow-500' />
                        </div>
                        <h2 className='font-bold text-xl md:text-2xl text-center text-white'>
                            Confirm Logout
                        </h2>
                        <p className='text-gray-300 text-center text-sm md:text-base'>
                            Are you sure you want to sign out? You'll need to sign in again to access your workspace.
                        </p>
                        <div className='flex gap-3 mt-2 w-full'>
                            <Button 
                                onClick={onClose}
                                variant='outline'
                                className='flex-1 bg-transparent border-gray-500 text-white hover:bg-gray-700 hover:text-white transition-all duration-200'
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={onConfirm}
                                className='flex-1 bg-red-600 text-white hover:bg-red-700 transition-all duration-200'
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default LogoutConfirmDialog
