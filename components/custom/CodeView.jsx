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
import { ActionContext } from '@/context/actionContext'
import SandpackPreviewClient from './SandpackPreviewClient'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'
import { useSandpack } from '@codesandbox/sandpack-react'


const SandpackActionHandler = () => {
    const { action, setAction } = useContext(ActionContext);
    const { sandpack } = useSandpack();

    useEffect(() => {
        if (action) {
            handleAction();
        }
    }, [action]);

    const handleAction = async () => {
        if (action?.actionType === 'export' || action?.actionType === 'deploy') {
            const client = sandpack?.clients?.['react'] || Object.values(sandpack?.clients || {})[0]; 
            if (client) {
                try {
                    const result = await client.getCodeSandboxURL();
                    if (action?.actionType === 'deploy') {
                        window.open(`https://${result?.sandboxId}.csb.app/`);
                    } else if (action?.actionType === 'export') {
                        window.open(result?.editorUrl);
                    }
                } catch (error) {
                    toast.error('Error getting export URL')
                }
                // Reset action after handling
                setAction(null);
            }
        }
    }

    return null;
}


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
    const [fileLoading, setFileLoading] = useState(false);
    const UpdateToken = useMutation(api.users.updateToken);
    const isGeneratingRef = React.useRef(false);
    const [loadingText, setLoadingText] = useState('Generating Your Code');
    const loadingMessages = [
        "Understanding your requirements...",
        "Designing the application structure...",
        "Generating clean and reusable code...",
        "Applying UI and logic...",
        "Finalizing the output..."
    ];


    useEffect(() => {
        let interval;
        if (loading) {
            let index = 0;
            setLoadingText(loadingMessages[0]);
            interval = setInterval(() => {
                index = (index + 1) % loadingMessages.length;
                setLoadingText(loadingMessages[index]);
            }, 3500);
        }
        return () => interval && clearInterval(interval);
    }, [loading]);


    useEffect(() => {
        id&&getFiles();
    },[id,userDetail]);

    useEffect(()=>{
        if(action?.actionType == 'deploy'){
             setActiveTab('preview')
        }
    },[action]);

    const getFiles = async () => {
        try{
            setFileLoading(true);
            const result = await convex.query(api.workspace.getWorkSpace,{
                workspaceId: id
            });

            const mergedFiles = {...Lookup.DEFAULT_FILE,...result?.fileData};
            setFiles(mergedFiles);
            setFileLoading(false);
        }catch(err){
            toast.error('Something went wrong while fetching files')
            setFileLoading(false);
        }
    }

    useEffect(() => {
        if(messages?.length > 0 && !isGeneratingRef.current){
            const role = messages[messages?.length - 1].role;
            if(role === 'user'){
                generateAiCode();
            }
        }
    },[messages]);

    const generateAiCode = async () => {
        if (isGeneratingRef.current) {
            return;
        }

        isGeneratingRef.current = true;
        setLoading(true);
        
        try{
            const lastUserMessage = messages[messages.length - 1]?.content || "";
            const prompt = `User wants: ${lastUserMessage}\n${Prompt.CODE_GEN_PROMPT}`;
            
            const result = await axios.post('/api/gen-ai-code', {
                prompt: prompt
            });
            const aiResp = result?.data
    
            const mergedFiles = {...Lookup.DEFAULT_FILE,...aiResp?.files};
            setFiles(mergedFiles);
            await updateFiles({
                workspaceId: id,
                files: aiResp?.files,
            });
    
            const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
            await UpdateToken({
                userId: userDetail?._id,
                token: token
            });
            setUserDetail(prev => ({
                ...prev,
                token:token
            }));
    
            setActiveTab('code');
        }catch(err){
            if (err.response?.status === 429) {
                toast.error('Rate limit exceeded. Please wait a minute before trying again.');
            } else {
                toast.error('Error in generating code')
            }
        }finally{
            setLoading(false);
            isGeneratingRef.current = false;
        }
        
    }; 

    return (
        <div className='relative'>
            <div className='bg-[#181818] w-full py-1 px-2 rounded-lg'>
                <div className='flex items-center w-full flex-wrap shrink-0 py-1 px-3 gap-3 rounded-full'>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`flex text-sm items-center gap-2 justify-center cursor-pointer px-2 py-1 bg-[#30302f] uppercase rounded-full transition-all duration-200 ${activeTab === 'code' ? 'text-black bg-white' : 'hover:bg-[#3d3d3d]'}`}>
                            <CodeXml size={20} className={`${activeTab == 'code' && 'text-purple-500 font-bold'}`}/> 
                            <span>code</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('preview')}
                        className={`flex text-sm transition-all duration-200  items-center justify-center gap-2 cursor-pointer bg-[#30302f] uppercase rounded-full px-2 py-1 ${activeTab === 'preview' ? 'text-black bg-white' : 'hover:bg-[#3d3d3d]'}`}>
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
                    <div className='flex w-full h-full' style={{display: activeTab === 'code' ? 'flex' : 'none'}}>
                        <SandpackFileExplorer style={{height: '75vh'}}/>
                        <SandpackCodeEditor style={{height: '75vh'}}/>
                    </div>
                    <div className='w-full h-full' style={{display: activeTab === 'preview' ? 'block' : 'none'}}>
                        <SandpackPreviewClient style={{height: '75vh'}}/>
                    </div>
                </SandpackLayout>
                <SandpackActionHandler />
            </SandpackProvider>

            {/* Enhanced loader */}
            {loading && (
                <div className='p-10 bg-[#151515] absolute inset-0 top-0 left-0 right-0 bottom-0 rounded-lg w-full h-full flex flex-col items-center justify-center gap-6 z-50'>
                    <div className="relative">
                        <Loader2Icon size={48} className='animate-spin text-blue-500'/>
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className='text-white text-2xl font-bold'>{loadingText}</h2>
                        <p className='text-blue-400 text-xs mt-2'>This may take a few moments</p>
                    </div>
                </div>
            )}
            

        </div>
    )
}

export default CodeView