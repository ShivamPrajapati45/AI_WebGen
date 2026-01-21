import { SandpackPreview } from '@codesandbox/sandpack-react'
import React, { useRef } from 'react'

const SandpackPreviewClient = () => {
    const previewRef = useRef();
    
    return (
            <SandpackPreview  
                ref={previewRef}
                style={{height: '80vh'}} 
                showNavigator={true}
            />
        
    )
}

export default SandpackPreviewClient