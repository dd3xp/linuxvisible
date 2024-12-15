import { useState } from 'react';
import '../styles/Kernel.css';
import '../styles/Global.css';
import ContainerList from './containerlist';

const Kernel:React.FC = () => {

    const [selected, setSelected] = useState<string | null>(null);

    const handleContainerSelect = (component: string) => {
        setSelected(component);
      };

    return(
        <>
        </>
    )
}

export default Kernel;