import { useState } from 'react';
import '../styles/Kernel.css';
import '../styles/Global.css';
import Kernel from './kernel';
import Grid from './grid'
import ContainerList from './containerlist'

const Dashboard:React.FC = () => {

    const [selected, setSelected] = useState<string | null>(null);

    const handleContainerSelect = (component: string) => {
        setSelected(component);
      };

    return(
        <div className="screen">
            <div className="version-operation">
                <h2 className="version-operation_title">版本设置</h2>
            </div>
            <div className="overlay-container">
                <div className="grid">
                    <Grid />
                </div>
                <div className="linux">
                    <Kernel />
                </div>
            </div>
            <div>
                <ContainerList />
            </div>
        </div>
    )
}

export default Dashboard;