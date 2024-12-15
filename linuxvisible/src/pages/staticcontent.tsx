import { useEffect, useState } from 'react';
import '../styles/Kernel.css';
import '../styles/Global.css';
import ContainerList from './containerlist';

interface KernelProps {
    selected: string | null;
    onContainerSelect: (component: string | null) => void;
  }
  
  const Kernel: React.FC<KernelProps> = ({ selected, onContainerSelect }) => {
    
    const handleClick = (containerName: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (selected === containerName) {
            onContainerSelect(null);
        } else {
            onContainerSelect(containerName);
        }
        console.log(`${containerName} activated`);
    };

    return(
        <>
        </>
    )
}

export default Kernel;