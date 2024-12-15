import { useEffect, useState } from 'react';
import '../styles/Kernel.css';
import '../styles/Global.css';
import ContainerList from './containerlist';


interface KernelProps {
    selected: string | null;  // 接收选中的容器名称
    onContainerSelect: (component: string) => void;  // 回调函数，用于通知父组件更新选中容器
  }
  
  const Kernel: React.FC<KernelProps> = ({ selected, onContainerSelect }) => {
    
    const handleClick = (containerName: string, event: React.MouseEvent) => {
      event.stopPropagation(); // 阻止事件冒泡，防止触发文档点击事件
      onContainerSelect(containerName); // 通知父组件更新选中的容器
      console.log(`${containerName} activated`);
    };


    return(
        <>
        </>
    )
}

export default Kernel;