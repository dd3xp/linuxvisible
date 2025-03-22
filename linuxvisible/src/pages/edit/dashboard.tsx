import { useEffect, useState, useMemo } from 'react';
import { Collapse, Form, Select, Button, Input, message } from 'antd';
import { getVersion } from '../../services/feature';
import { Empty } from 'antd';
import styles from '../../styles/Edit/Dashboard.module.css';
import Kernel from './kernel';
import Grid from './grid';
import React from 'react';
import { getUniqueContainers } from '../../utils/common';
import { EntityNode } from '../../utils/API';
import { 
    calculateAddFeatureUnavailableGrids, 
    calculateEditFeatureUnavailableGrids, 
    calculateLevel2ContainerGrids
 } from '../../utils/edit/unavailableGrids';

interface VersionInformation {
    repo: string | null;
    version: string | null;
}

const Dashboard: React.FC = () => {
    // 版本信息
    const [versionInfo, setVersionInfo] = useState<VersionInformation | null>(null);
    const [versionData, setVersionData] = useState<Record<string, string[]>>({});
    const [repoList, setRepoList] = useState<string[]>([]);
    const [versionList, setVersionList] = useState<string[]>([]);
    const [showContent, setShowContent] = useState(false);

    // 实体信息
    const [entities, setEntities] = useState<EntityNode[]>([]);
    const [unavailableGrids, setUnavailableGrids] = useState<number[][]>([]);

    // 现有的修改特性状态
    const [featureName, setFeatureName] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);

    // 新增的添加特性状态
    const [newFeatureName, setNewFeatureName] = useState<string>('');
    const [isAddingFeature, setIsAddingFeature] = useState(false);

    // 选择的内核
    const [selectedKernel, setSelectedKernel] = useState<number | null>(null);
    const [resetTrigger, setResetTrigger] = useState<boolean>(false);
    const [activePanelKey, setActivePanelKey] = useState<string[]>(['version-select']);

    // 是否有不可用的格子
    const [haveUnavailableGrids, setHaveUnavailableGrids] = useState(false);
    const [differentParents, setDifferentParents] = useState(false);
    const level2ContainerGrids = useMemo(() => calculateLevel2ContainerGrids(entities), [entities]);

    // 实体备份
    const [originEntities, setOriginEntities] = useState<EntityNode[]>([]);

    // 当前模式
    const [currentMode, setCurrentMode] = useState<'editing' | 'adding' | null>(null);

    // 修改的内容
    const [editingEid, setEditingEid] = useState<number | null>(null);
    const [editingDisplayName, setEditingDisplayName] = useState('');


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
                setOriginEntities(data); // 备份
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

    const handleFeatureSelection = (feature: string) => {
        setFeatureName(feature);
        setActivePanelKey((prev) => {
          const keys = new Set(prev);
          keys.add('feature-add');
          keys.delete('feature-create');
          return Array.from(keys);
        });
      
        const entity = entities.find(e => e.nameEn === feature);
        if (entity) {
          setIsEditing(true);
          setEditingEid(entity.eid);
          setEditingDisplayName(entity.nameEn);
          setIsAddingFeature(false);
          setCurrentMode('editing');
        }
    };

    const handlePanelChange = (keys: string[] | string) => {
        const clickedKey = typeof keys === 'string' ? keys : keys[keys.length - 1];
        let nextActiveKeys: string[] = [];
    
        if (clickedKey === 'feature-add') {
            // 打开修改特性面板，关闭添加特性
            setIsAddingFeature(false);
            if (featureName) {
                const entity = entities.find(e => e.nameEn === featureName);
                if (entity) {
                    setIsEditing(true);
                    setEditingEid(entity.eid);
                    setEditingDisplayName(entity.nameEn);
                    setCurrentMode('editing');
                } else {
                    setIsEditing(false);
                    setCurrentMode(null);
                }
            } else {
                setIsEditing(false);
                setCurrentMode(null);
            }
            nextActiveKeys = ['feature-add'];
    
        } else if (clickedKey === 'feature-create') {
            // 打开添加特性面板，关闭修改特性
            setIsEditing(false);
            setIsAddingFeature(true);
            setCurrentMode('adding');
            nextActiveKeys = ['feature-create'];
    
        } else {
            // 折叠全部
            setIsEditing(false);
            setIsAddingFeature(false);
            setCurrentMode(null);
            nextActiveKeys = [];
        }
    
        // 最后设置 active keys（放在最后确保状态更新同步）
        setActivePanelKey(nextActiveKeys);
    };    

    const handleCancelEditingiting = () => {
        setIsEditing(false);
        setSelectedKernel(null);
        setFeatureName('');
        setResetTrigger(false);
        setEditingEid(null);
        setEditingDisplayName('');
        setTimeout(() => setResetTrigger(true), 0);
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
            <div style={{ marginBottom: 10 }}>
            当前模式：{currentMode === 'editing' ? '修改特性' : currentMode === 'adding' ? '添加特性' : '无'}
            </div>
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
                                <Select
                                    placeholder="请选择特性"
                                    value={featureName || undefined}
                                    onChange={handleFeatureSelection}
                                    showSearch
                                    filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={entities
                                    .filter((e) => e.level === 3)
                                    .map((e) => ({ label: e.nameEn, value: e.nameEn }))}
                                />
                                </Form.Item>
                                    <>
                                    <Form.Item label="eid" style={{ marginBottom: 8}}>
                                    <Input 
                                        value={editingEid ?? ''} 
                                        onChange={e => setEditingEid(Number(e.target.value))} 
                                    />
                                    </Form.Item>
                                    <Form.Item label="显示名称" style={{ marginBottom: 8 }}>
                                    <Input 
                                        value={editingDisplayName} 
                                        onChange={e => setEditingDisplayName(e.target.value)} 
                                    />
                                    </Form.Item>
                                    
                                    <Button type="default" onClick={handleCancelEditingiting} style={{ marginRight: 10 }}>取消</Button>
                                    </>
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
                                    <Button type="default" onClick={handleCancelNewFeature} style={{ marginRight: 10 }}>取消</Button>
                                </Form>
                            </div>
                        ),
                    }
                ]}
                    expandIconPosition="end"
                    bordered={false}
                    activeKey={activePanelKey}
                    onChange={handlePanelChange}                   
                />
            </div>

            <div className={styles.mainContent}>
                <div className={styles.overlay}>
                    {showContent ? (
                        <>
                            <Grid 
                            isEditing={isEditing || isAddingFeature} 
                            resetSelection={resetTrigger} 
                            unavailableGrids={unavailableGrids} 
                            setHaveUnavailableGrids={setHaveUnavailableGrids}
                            setDifferentParents={setDifferentParents}
                            level2ContainerGrids={level2ContainerGrids}
                            />
                            <Kernel 
                            versionInfo={versionInfo} 
                            entities={entities} 
                            setFeatureName={handleFeatureSelection} 
                            selectedKernel={selectedKernel} 
                            setSelectedKernel={setSelectedKernel} />
                        </>
                    ) : <Empty style={{ marginTop: '20%' }} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
