import { useEffect, useState } from 'react';
import { Collapse, Form, Select, Button, Input, message } from 'antd';
import { getVersion } from '../../services/feature';
import { Empty } from 'antd';
import styles from '../../styles/Edit/Dashboard.module.css';
import Kernel from './kernel';
import Grid from './grid';
import React from 'react';
import { getUniqueContainers } from '../../utils/common';
import { EntityNode } from '../../utils/API';
import { calculateAddFeatureUnavailableGrids, calculateEditFeatureUnavailableGrids } from '../../utils/edit/unavailableGrids';

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

    const [entities, setEntities] = useState<EntityNode[]>([]);
    const [unavailableGrids, setUnavailableGrids] = useState<number[][]>([]);

    // 现有的修改特性状态
    const [featureName, setFeatureName] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);

    // 新增的添加特性状态
    const [newFeatureName, setNewFeatureName] = useState<string>('');
    const [isAddingFeature, setIsAddingFeature] = useState(false);

    const [selectedKernel, setSelectedKernel] = useState<number | null>(null);
    const [resetTrigger, setResetTrigger] = useState<boolean>(false);
    const [activePanelKey, setActivePanelKey] = useState<string[]>(['version-select']);

    useEffect(() => {
        getVersion().then((data) => {
            setVersionData(data);
            setRepoList(Object.keys(data));
            setVersionList([]);
        });
    }, []);

    useEffect(() => {
        if (versionInfo?.repo && versionInfo?.version) {
            getUniqueContainers(versionInfo.repo, versionInfo.version, versionInfo.version).then((data) => {
                setEntities(data);
            });
        }
    }, [versionInfo]);

    useEffect(() => {
        console.log('Entities:', entities);
        if (isAddingFeature) {
            const grids = calculateAddFeatureUnavailableGrids(entities);
            console.log('Calculated unavailable grids for adding feature:', grids);
            setUnavailableGrids(grids);
        } else if (isEditing) {
            const editingFeature = entities.find(e => e.nameEn === featureName);
            console.log('Editing Feature:', editingFeature);
            if (editingFeature) {
                const grids = calculateEditFeatureUnavailableGrids(entities, editingFeature);
                console.log('Calculated unavailable grids for editing feature:', grids);
                setUnavailableGrids(grids);
            }
        }
    }, [isAddingFeature, isEditing, entities, featureName]);

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

    // 处理修改特性
    const handleConfirmFeature = () => {
        if (isAddingFeature) {
            message.warning('请退出添加特性状态');
            return;
        }
        if (!featureName) {
            message.warning('请选择一个特性');
            return;
        }
        setIsEditing(true);
    };

    const handleSaveEditing = () => {
        setIsEditing(false);
        setSelectedKernel(null);
        setFeatureName('');
        setResetTrigger(false);
        setTimeout(() => setResetTrigger(true), 0);
    };

    const handleFeatureSelection = (feature: string) => {
        setFeatureName(feature);
        setActivePanelKey(['feature-add']);
    };

    // 处理添加特性
    const handleConfirmNewFeature = () => {
        if (isEditing) {
            message.warning('请退出修改特性状态');
            return;
        }
        if (!newFeatureName) {
            message.warning('请输入新的特性名称');
            return;
        }
        setIsAddingFeature(true);
    };

    const handleCancelNewFeature = () => {
        setIsAddingFeature(false);
        setNewFeatureName('');
        setResetTrigger(false);
        setTimeout(() => setResetTrigger(true), 0);
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebar}>
                <Collapse items={[
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
                                        <Button type="primary" onClick={onVersionSelect}>确认</Button>
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
                                    <Form.Item label="选择的特性">
                                        <div className={styles.featureDisplay}>{featureName || '未选择特性'}</div>
                                    </Form.Item>
                                    <Button type="primary" onClick={handleConfirmFeature}>确认</Button>
                                    <Button type="default" onClick={handleSaveEditing} style={{ marginLeft: 10 }}>取消</Button>
                                </Form>
                            </div>
                        ),
                    },
                    {
                        key: 'feature-create',
                        label: '添加特性',
                        children: (
                            <div className={styles.featurePanel}>
                                <Form layout="vertical">
                                    <Form.Item label="特性名称">
                                        <Input placeholder="输入新的特性名称" value={newFeatureName} onChange={(e) => setNewFeatureName(e.target.value)} />
                                    </Form.Item>
                                    <Button type="primary" onClick={handleConfirmNewFeature}>确认</Button>
                                    <Button type="default" onClick={handleCancelNewFeature} style={{ marginLeft: 10 }}>取消</Button>
                                </Form>
                            </div>
                        ),
                    }
                ]}
                    expandIconPosition="end"
                    bordered={false}
                    activeKey={activePanelKey}
                    onChange={(keys) => setActivePanelKey(typeof keys === 'string' ? [keys] : keys)}
                />
            </div>

            <div className={styles.mainContent}>
                <div className={styles.overlay}>
                    {showContent ? (
                        <>
                            <Grid isEditing={isEditing || isAddingFeature} resetSelection={resetTrigger} unavailableGrids={unavailableGrids} />
                            <Kernel versionInfo={versionInfo} entities={entities} setFeatureName={handleFeatureSelection} selectedKernel={selectedKernel} setSelectedKernel={setSelectedKernel} />
                        </>
                    ) : <Empty style={{ marginTop: '20%' }} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
