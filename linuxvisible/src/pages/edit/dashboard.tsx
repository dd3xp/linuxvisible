import { useEffect, useState } from 'react';
import { Collapse, Form, Select, Button, Input, message } from 'antd';
import { getVersion } from '../../services/feature';
import { Empty } from 'antd';
import styles from '../../styles/Edit/Dashboard.module.css';
import Kernel from './kernel';
import Grid from './grid';

interface VersionInformation {
    repo: string | null;
    version: string | null;
}

const Dashboard: React.FC = () => {
    const [versionInfo, setVersionInfo] = useState<VersionInformation | null>(null);
    const [versionData, setVersionData] = useState<Record<string, string[]>>({});
    const [repoList, setRepoList] = useState<string[]>([]);
    const [versionList, setVersionList] = useState<string[]>([]);
    const [showContent, setShowContent] = useState(false);
    const [featureName, setFeatureName] = useState<string>('');
    const [leftSelected, setLeftSelected] = useState<{ row: number; col: number } | null>(null);
    const [rightSelected, setRightSelected] = useState<{ row: number; col: number } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedKernel, setSelectedKernel] = useState<number | null>(null);
    const [resetTrigger, setResetTrigger] = useState<boolean>(false);

    useEffect(() => {
        getVersion().then((data) => {
            setVersionData(data);
            setRepoList(Object.keys(data));
            setVersionList([]);
        });
    }, []);

    const handleRepoChange = (repo: string) => {
        setVersionInfo({ repo, version: null });
        setVersionList(versionData[repo] || []);
        setShowContent(false);
    };

    const handleVersionChange = (version: string) => {
        setVersionInfo((prev) => (prev ? { ...prev, version } : { repo: null, version }));
        setShowContent(false);
    };

    const onVersionSelect = () => {
        if (!versionInfo?.repo || !versionInfo.version) {
            message.warning('请选择仓库和版本');
            return;
        }
        message.success(`当前选择: ${versionInfo.repo} - ${versionInfo.version}`);
        setShowContent(true);
    };

    const handleConfirmFeature = () => {
        if (!featureName) {
            message.warning('请输入特性名称');
            return;
        }
        setIsEditing(true);
    };

    const handleSaveEditing = () => {
        setIsEditing(false);
        setLeftSelected(null);
        setRightSelected(null);
        setSelectedKernel(null);
        setFeatureName('');
        setResetTrigger(false);
        setTimeout(() => setResetTrigger(true), 0);
    };

    const items = [
        {
            key: 'version-select',
            label: '版本选择',
            children: (
                <div className={styles.versionSelect}>
                    <Form layout="vertical">
                        <Form.Item label="选择仓库">
                            <Select
                                placeholder="请选择"
                                value={versionInfo?.repo}
                                onChange={handleRepoChange}
                                allowClear
                                options={repoList.map((v) => ({ value: v, label: v }))} 
                            />
                        </Form.Item>
                        <Form.Item label="选择版本">
                            <Select
                                placeholder="请选择"
                                value={versionInfo?.version}
                                onChange={handleVersionChange}
                                allowClear
                                options={versionList.map((v) => ({ value: v, label: v }))}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={onVersionSelect}>
                                确认
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key: 'feature-add',
            label: '修改特性',
            children: (
                <div className={styles.featurePanel}>
                    <Form layout="vertical">
                        <Form.Item label="特性名称">
                            <Input 
                                placeholder="输入特性名称"
                                value={featureName}
                                onChange={(e) => setFeatureName(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="左键选中的坐标">
                            <div>{leftSelected ? `(${leftSelected.row}, ${leftSelected.col})` : '未选择'}</div>
                        </Form.Item>
                        <Form.Item label="右键选中的坐标">
                            <div>{rightSelected ? `(${rightSelected.row}, ${rightSelected.col})` : '未选择'}</div>
                        </Form.Item>
                        <Button type="primary" onClick={handleConfirmFeature}>
                            确认
                        </Button>
                        <Button style={{ marginTop: 10 }} onClick={handleSaveEditing}>
                            保存编辑
                        </Button>
                    </Form>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebar}>
                <Collapse items={items} expandIconPosition="end" bordered={false} defaultActiveKey={['version-select']} />
            </div>

            <div className={styles.mainContent}>
                <div className={styles.overlay}>
                    {showContent ? (
                        <>
                            <Grid 
                                setLeftSelected={setLeftSelected} 
                                setRightSelected={setRightSelected} 
                                isEditing={isEditing} 
                                resetSelection={resetTrigger} 
                            />
                            <Kernel 
                                versionInfo={versionInfo} 
                                setFeatureName={setFeatureName} 
                                selectedKernel={selectedKernel} 
                                setSelectedKernel={setSelectedKernel} 
                            />
                        </>
                    ) : (
                        <Empty style={{ marginTop: '20%' }} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
