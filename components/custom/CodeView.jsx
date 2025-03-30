import { MessagesContext } from '@/context/messagesContext'
import { api } from '@/convex/_generated/api'
import Lookup from '@/data/Lookup'
import Prompt from '@/data/Prompt'
import { SandpackCodeEditor, SandpackFileExplorer, SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react'
import axios from 'axios'
import { useConvex, useMutation } from 'convex/react'
import { CodeXml, Eye, Loader2Icon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { countToken } from './ChartView'
import { UserDetailContext } from '@/context/userDetailContext'
import SandpackPreviewClient from './SandpackPreviewClient'
import { ActionContext } from '@/context/actionContext'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'


const CodeView = () => {
    
    const [activeTab,setActiveTab] = useState('code')
    const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
    const {messages,setMessages} = useContext(MessagesContext);
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const {action, setAction} = useContext(ActionContext);
    const updateFiles = useMutation(api.workspace.updateCodeFiles);
    const convex = useConvex();
    const {id} = useParams();
    const [loading,setLoading] = useState(false);
    const UpdateToken = useMutation(api.users.updateToken);

    useEffect(() => {
        id&&getFiles();
    },[id,userDetail]);

    useEffect(() =>{
        setActiveTab('preview')
    },[action]);

    const getFiles = async () => {
        try{
            setLoading(true);
            const result = await convex.query(api.workspace.getWorkSpace,{
                workspaceId: id
            });

            const mergedFiles = {...Lookup.DEFAULT_FILE,...result?.fileData};
            setFiles(mergedFiles);
            setLoading(false);
        }catch(err){
            toast.error('Something went wrong while fetching files')
            console.log('Error in fetching files',err);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        if(messages?.length > 0){
            const role = messages[messages?.length - 1].role;
            if(role === 'user'){
                generateAiCode();
            }
        }
    },[messages]);

    const generateAiCode = async () => {
        try{
            setLoading(true);
            console.log('Generating')
            const prompt = JSON.stringify(messages)+" "+Prompt.CODE_GEN_PROMPT;
            const result = await axios.post('/api/gen-ai-code', {
                prompt: prompt
            });
            console.log('result: ',result)
            const aiResp = result?.data
    
            const mergedFiles = {...Lookup.DEFAULT_FILE,...aiResp?.files};
            setFiles(mergedFiles);
            await updateFiles({
                workspaceId: id,
                files: aiResp?.files,
            });
    
            const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
                    // Updating token
            await UpdateToken({
                userId: userDetail?._id,
                token: token
            });
            setUserDetail(prev => ({
                ...prev,
                token:token
            }));
    
            setActiveTab('code');
            setLoading(false);
        }catch(err){
            toast.error('Error in generating code')
            console.log('Error in generating code',err);
        }finally{
            setLoading(false);
        }
        
    }; 

    return (
        <div className='relative'>
            <div className='bg-[#181818] w-full py-1 px-2 rounded-lg'>
                <div className='flex items-center w-full flex-wrap shrink-0 py-1 px-3 gap-3 rounded-full'>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`flex text-sm items-center font-semibold gap-2 justify-center cursor-pointer px-2 py-1 bg-[#30302f] uppercase rounded-full ${activeTab === 'code' && 'text-black bg-white'}`}>
                            <CodeXml size={20} className={`${activeTab == 'code' && 'text-purple-500 font-bold'}`}/> 
                            <span>code</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('preview')}
                        className={`flex text-sm font-semibold items-center justify-center gap-2 cursor-pointer bg-[#30302f] uppercase rounded-full px-2 py-1 ${activeTab === 'preview' && 'text-black bg-white'}`}>
                            <Eye size={20} className={`${activeTab == 'preview' && 'text-purple-500 font-bold'}`}/> 
                            <span>preview</span>
                    </button>
                </div>
            </div>
            <SandpackProvider 
                files={files}
                template="react" 
                theme={'dark'}
                customSetup={{
                    dependencies:{
                        ...Lookup.DEPENDENCY
                    }
                }}
                options={{
                    externalResources: ['https://unpkg.com/@tailwindcss/browser@4']
                }}
            >
                <SandpackLayout>
                    {activeTab == 'code' ? <>
                        <SandpackFileExplorer style={{height: '75vh'}}/>
                        <SandpackCodeEditor style={{height: '75vh'}}/>
                    </> :
                    <>
                        <SandpackPreviewClient style={{height: '70vh'}}/>
                    </>
                    }
                </SandpackLayout>
            </SandpackProvider>

            {/* loader */}
            {loading && <div className='p-10 bg-gray-800 opacity-85 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
                <Loader2Icon size={28} className='animate-spin text-white'/>
                <h2 className='text-white'>Generating your files...</h2>
            </div>}
            

        </div>
    )
}

export default CodeView