import { ActionContext } from '@/context/actionContext';
import { SandpackPreview,useSandpack } from '@codesandbox/sandpack-react'
import React, { useContext, useEffect, useRef } from 'react'

const SandpackPreviewClient = () => {
    const {action, setAction} = useContext(ActionContext);
    const previewRef = useRef();
    const {sandpack} = useSandpack();
    
    useEffect(() =>{
        getSandPackClient();
    },[sandpack&&action]);

    const getSandPackClient = async () => {
        const client = previewRef.current?.getClient();
        if(client){
            const result = await client.getCodeSandboxURL();
            if(action?.actionType == 'deploy'){
                window.open(`https://${result?.sandboxId}.csb.app/`);
            }else if(action?.actionType == 'export'){
                window.open(result?.editorUrl);
            }
        }
    }
    return (
            <SandpackPreview  
                ref={previewRef}
                style={{height: '80vh'}} 
                showNavigator={true}
            />
        
    )
}

export default SandpackPreviewClient