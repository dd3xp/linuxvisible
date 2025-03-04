import { useState } from 'react';
import Kernel from './kernel';
import Grid from './grid';
import { getFeatureListByVersion } from '../../services/feature';

const Dashboard: React.FC = () => {
    return (
        <div className="screen">
            <div className="overlay-container">
                <div className="grid">
                    <Grid />
                </div>
                <div className="linux">
                    <Kernel />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
