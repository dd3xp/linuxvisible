import React, {useEffect, useState} from 'react';
import {getTimeTraceInfo, getDependTraceInfo} from '../api/services/tracker';

interface FeatureModalProps {
    featureId: number | null;
    version: string | null;
    repo: string | null;
}

interface TraceInfo {
    commitId: string;
    filePath: string[];
    methodName: string;
}

const FeatureModal: React.FC<FeatureModalProps> = ({featureId, version, repo}) => {
    const [timeTraceData, setTimeTraceData] = useState<TraceInfo[]>([]);
    const [dependTraceData, setDependTraceData] = useState<TraceInfo[]>([]);

    useEffect(() => {
        const fetchTimeTraceInfo = async () => {
            if (repo && featureId) {
                const response = await getTimeTraceInfo({ repo, featureId });
                setTimeTraceData(response);
            }
        };

        const fetchDependTraceInfo = async () => {
            if (repo && featureId) {
                const response = await getDependTraceInfo({ repo, featureId });
                setDependTraceData(response);
            }
        };

        fetchTimeTraceInfo();
        fetchDependTraceInfo();

    }, [featureId, repo]);

    return (
        <>
            <div>Feature ID: {featureId}</div>
            <div>Version: {version}</div>
            <div>Repo: {repo}</div>

            <div>
                <h3>Time Trace Data</h3>
                <ul>
                    {timeTraceData.map((item) => (
                        <li key={`${item.commitId}-${item.methodName}`}>
                            <div>Commit ID: {item.commitId}</div>
                            <div>File Path: {item.filePath.join(', ')}</div>
                            <div>Method Name: {item.methodName}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Depend Trace Data</h3>
                <ul>
                    {dependTraceData.map((item) => (
                        <li key={`${item.commitId}-${item.methodName}`}>
                            <div>Commit ID: {item.commitId}</div>
                            <div>File Path: {item.filePath.join(', ')}</div>
                            <div>Method Name: {item.methodName}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default FeatureModal;