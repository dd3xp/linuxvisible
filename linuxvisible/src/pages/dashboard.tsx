import { useEffect, useState } from 'react';
import '../styles/Kernel.css';
import '../styles/Global.css';
import Kernel from './kernel';
import Grid from './grid';
import ContainerList from './containerlist';

const Dashboard: React.FC = () => {
    const [selected, setSelectedContainer] = useState<string | null>(null);

    const handleContainerSelect = (component: string | null) => {
        setSelectedContainer(component);
    };

    const handleDocumentClick = (event: MouseEvent) => {
        if (!event.target || !(event.target instanceof HTMLElement)) return;
        if (
            !event.target.closest('.kernel-container') && 
            !event.target.closest('.container-list')
        ) {
            setSelectedContainer(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
        document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    return (
        <div className="screen">
        <div className="version-operation">
            <h2 className="version-operation_title">版本设置</h2>
        </div>
        <div className="overlay-container">
            <div className="grid">
            <Grid />
            </div>
            <div className="linux">
            <Kernel selected={selected} onContainerSelect={handleContainerSelect} />
            </div>
        </div>
        <div>
            <ContainerList selected={selected} onContainerSelect={handleContainerSelect} />
        </div>
        </div>
    );
};

export default Dashboard;