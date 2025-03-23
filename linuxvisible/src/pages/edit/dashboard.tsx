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
    calculateParentsGrids, 
    findStrictContainerName,
    calculateParentContainerName,
    findParentContainerId
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
    const [isAdding, setisAdding] = useState(false);

    // 选择的内核
    const [selectedKernel, setSelectedKernel] = useState<number | null>(null);
    const [resetTrigger, setResetTrigger] = useState<boolean>(false);
    const [activePanelKey, setActivePanelKey] = useState<string[]>(['version-select']);

    // 是否有不可用的格子
    const [haveUnavailableGrids, setHaveUnavailableGrids] = useState(false);
    const [differentParents, setDifferentParents] = useState(false);
    const level2ContainerGrids = useMemo(() => calculateParentsGrids(entities, 2), [entities]);
    const level1ContainerGrids = useMemo(() => calculateParentsGrids(entities, 1), [entities]);

    // 实体备份
    const [originEntities, setOriginEntities] = useState<EntityNode[]>([]);

    // 当前模式
    const [currentMode, setCurrentMode] = useState<'editing' | 'adding' | null>(null);

    // 修改的内容
    const [editingDisplayName, setEditingDisplayName] = useState('');
    const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
    const [editingParentEid, setEditingParentEid] = useState<number | null>(null);
    const [editingParentContainerName, setEditingParentContainerName] = useState<string>('无效的父容器');
    const [editingDisplayNameCn, setEditingDisplayNameCn] = useState<string>('');

    // 新增的内容
    const [newFeaturePosition, setNewFeaturePosition] = useState<string>('');
    const [newFeatureParentContainerName, setNewFeatureParentContainerName] = useState<string>('无效的父容器');
    const [newFeatureNameCn, setNewFeatureNameCn] = useState<string>('');

    // 保存用变量：修改特性
    const [savedEditingName, setSavedEditingName] = useState<string>('');
    const [savedEditingX1, setSavedEditingX1] = useState<number | null>(null);
    const [savedEditingY1, setSavedEditingY1] = useState<number | null>(null);
    const [savedEditingX2, setSavedEditingX2] = useState<number | null>(null);
    const [savedEditingY2, setSavedEditingY2] = useState<number | null>(null);
    const [savedEditingNameCn, setSavedEditingNameCn] = useState<string>('');
    const [savedEditingParentEid, setSavedEditingParentEid] = useState<number | null>(null);
    
    // 保存用变量：添加特性
    const [savedNewName, setSavedNewName] = useState<string>('');
    const [savedNewX1, setSavedNewX1] = useState<number | null>(null);
    const [savedNewY1, setSavedNewY1] = useState<number | null>(null);
    const [savedNewX2, setSavedNewX2] = useState<number | null>(null);
    const [savedNewY2, setSavedNewY2] = useState<number | null>(null);
    const [savedNewNameCn, setSavedNewNameCn] = useState<string>('');
    const [savedNewParentEid, setSavedNewParentEid] = useState<number | null>(null);

    // 修改特性的时间
    const [savedEditingUpdateTime, setSavedEditingUpdateTime] = useState<string>('');

    // 添加特性的时间
    const [savedNewCreateTime, setSavedNewCreateTime] = useState<string>('');
    const [savedNewUpdateTime, setSavedNewUpdateTime] = useState<string>('');

    const editingEntitiesPosition = useMemo(() => {
        const entity = featureName ? entities.find(e => e.nameEn === featureName) ?? null : null;
        if (!entity) return '';
        const { x1, y1, x2, y2 } = entity;
        return `(${x1}, ${y1}) - (${x2}, ${y2})`;
    }, [entities, featureName]);
    
    const displayPosition = selectedPosition ?? editingEntitiesPosition;

    // 计算显示父容器名
    const editingParentName = useMemo(() => 
        calculateParentContainerName(
            selectedPosition ?? editingEntitiesPosition,
            entities,
            level2ContainerGrids
        ),
    [selectedPosition, editingEntitiesPosition, level2ContainerGrids, entities]);      
    
    // 计算新特性的父容器名
    const newFeatureParentName = useMemo(() => 
        calculateParentContainerName(
            newFeaturePosition,
            entities,
            level2ContainerGrids
        ),
    [newFeaturePosition, level2ContainerGrids, entities]);

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

    // 计算和输出不可用格子
    useEffect(() => {
        console.log('Entities:', entities);
        if (isAdding) {
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
    }, [isAdding, isEditing, entities, featureName]);

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
            setEditingDisplayName(entity.nameEn);
            setEditingDisplayNameCn(entity.nameCn ?? '');
            setisAdding(false);
            setCurrentMode('editing');
        }
    };

    // 处理页面切换
    const handlePanelChange = (keys: string[] | string) => {
        let keyArray = typeof keys === 'string' ? [keys] : [...keys];
    
        // 检查是否同时展开了 feature-add 和 feature-create
        const hasAdd = keyArray.includes('feature-add');
        const hasCreate = keyArray.includes('feature-create');
    
        // 如果同时展开，优先保留当前点击的那个，关闭另一个
        if (hasAdd && hasCreate) {
            // 最后点的是哪个就保留哪个，移除另一个
            const lastClicked = keyArray[keyArray.length - 1];
            if (lastClicked === 'feature-add') {
                keyArray = keyArray.filter(k => k !== 'feature-create');
                setisAdding(false);
                if (featureName) {
                    const entity = entities.find(e => e.nameEn === featureName);
                    if (entity) {
                        setIsEditing(true);
                        setEditingDisplayName(entity.nameEn);
                        setCurrentMode('editing');
                    }
                } else {
                    setIsEditing(false);
                    setCurrentMode(null);
                }
            } else if (lastClicked === 'feature-create') {
                keyArray = keyArray.filter(k => k !== 'feature-add');
                setIsEditing(false);
                setisAdding(true);
                setCurrentMode('adding');
            }
        } else {
            // 如果只展开了一个，照常处理模式切换
            if (hasAdd) {
                setisAdding(false);
                if (featureName) {
                    const entity = entities.find(e => e.nameEn === featureName);
                    if (entity) {
                        setIsEditing(true);
                        setEditingDisplayName(entity.nameEn);
                        setCurrentMode('editing');
                    }
                } else {
                    setIsEditing(false);
                    setCurrentMode(null);
                }
            } else if (hasCreate) {
                setIsEditing(false);
                setisAdding(true);
                setCurrentMode('adding');
            } else {
                setIsEditing(false);
                setisAdding(false);
                setCurrentMode(null);
            }
        }
    
        setActivePanelKey(keyArray);
    };

    // 取消修改特性
    const handleCancelEditingiting = () => {
        setIsEditing(false);
        setSelectedKernel(null);
        setFeatureName('');
        setResetTrigger(false);
        setEditingDisplayName('');
        setEditingDisplayNameCn('');
        setSelectedPosition(null);
        setHaveUnavailableGrids(false);
        setDifferentParents(false);
        setSelectedPosition(null);
        setTimeout(() => setResetTrigger(true), 0);
    };

    // 取消添加特性
    const handleCancelNewFeature = () => {
        setNewFeatureName('');
        setNewFeatureNameCn('');
        setResetTrigger(false);
        setNewFeaturePosition('');
        setTimeout(() => setResetTrigger(true), 0);
    };

    // 添加一个格式化时间的函数
    const formatDateTime = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleSaveEditingFeature = () => {
        const errors: string[] = [];

        if (!featureName) errors.push('请选择要修改的特性');
        if (!editingDisplayName) errors.push('请填写显示名称');
        if (haveUnavailableGrids) errors.push('所选区域包含无效格子');
        if (differentParents) errors.push('所选区域不属于同一父容器');

        if (errors.length > 0) {
            message.error(errors.join('，'));
            return;
        }

        // 保存数据
        setSavedEditingName(editingDisplayName);
        setSavedEditingNameCn(editingDisplayNameCn);
        setSavedEditingUpdateTime(formatDateTime(new Date()));

        const pos = (selectedPosition ?? editingEntitiesPosition).match(/\((\d+), (\d+)\) - \((\d+), (\d+)\)/);
        if (pos) {
            const [x1, y1, x2, y2] = [Number(pos[1]), Number(pos[2]), Number(pos[3]), Number(pos[4])];
            setSavedEditingX1(x1);
            setSavedEditingY1(y1);
            setSavedEditingX2(x2);
            setSavedEditingY2(y2);

            // 获取父容器信息
            const parentInfo = findParentContainerId(x1, y1, x2, y2, level2ContainerGrids, level1ContainerGrids);
            setSavedEditingParentEid(parentInfo ? parentInfo.eid : null);
        }

        handleCancelEditingiting();
    };

    useEffect(() => {
        if (savedEditingName) {
            console.log('修改特性已保存：', {
                nameEn: savedEditingName,
                nameCn: savedEditingNameCn,
                x1: savedEditingX1,
                y1: savedEditingY1,
                x2: savedEditingX2,
                y2: savedEditingY2,
                parentEid: savedEditingParentEid,
                updateTime: savedEditingUpdateTime,
            });
        }
    }, [savedEditingName, savedEditingX1, savedEditingY1, savedEditingX2, savedEditingY2, 
        savedEditingParentEid, savedEditingUpdateTime]);

    // 保存添加特性
    const handleSaveNewFeature = () => {
        const errors: string[] = [];

        if (!newFeatureName) errors.push('请填写显示名称');
        if (!newFeaturePosition) errors.push('请先框选一个区域');
        if (haveUnavailableGrids) errors.push('所选区域包含无效格子');
        if (differentParents) errors.push('所选区域不属于同一父容器');

        if (errors.length > 0) {
            message.error(errors.join('，'));
            return;
        }

        // 保存新特性的数据
        setSavedNewName(newFeatureName);
        setSavedNewNameCn(newFeatureNameCn);
        const currentTime = formatDateTime(new Date());
        setSavedNewCreateTime(currentTime);
        setSavedNewUpdateTime(currentTime);

        const pos = newFeaturePosition.match(/\((\d+), (\d+)\) - \((\d+), (\d+)\)/);
        if (pos) {
            const [x1, y1, x2, y2] = [Number(pos[1]), Number(pos[2]), Number(pos[3]), Number(pos[4])];
            setSavedNewX1(x1);
            setSavedNewY1(y1);
            setSavedNewX2(x2);
            setSavedNewY2(y2);

            // 获取父容器信息
            const parentInfo = findParentContainerId(x1, y1, x2, y2, level2ContainerGrids, level1ContainerGrids);
            setSavedNewParentEid(parentInfo ? parentInfo.eid : null);
        }

        handleCancelNewFeature();
    };    
    
    useEffect(() => {
        if (savedNewName) {
            console.log('添加特性已保存：', {
                nameEn: savedNewName,
                nameCn: savedNewNameCn,
                x1: savedNewX1,
                y1: savedNewY1,
                x2: savedNewX2,
                y2: savedNewY2,
                parentEid: savedNewParentEid,
                createTime: savedNewCreateTime,
                updateTime: savedNewUpdateTime,
            });
        }
    }, [savedNewName, savedNewX1, savedNewY1, savedNewX2, savedNewY2, 
        savedNewParentEid, savedNewCreateTime, savedNewUpdateTime]);

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
                                    <Form.Item label="显示名称" style={{ marginBottom: 8 }}>
                                    <Input 
                                        value={editingDisplayName} 
                                        onChange={e => setEditingDisplayName(e.target.value)} 
                                    />
                                    </Form.Item>
                                    <Form.Item label="中文名称" style={{ marginBottom: 8 }}>
                                    <Input 
                                        value={editingDisplayNameCn}
                                        onChange={e => setEditingDisplayNameCn(e.target.value)}
                                    />
                                    </Form.Item>
                                    <Form.Item label="位置">
                                        <div>{displayPosition || '无'}</div>
                                    </Form.Item>
                                    <Form.Item label="父容器">
                                        <div>{editingParentName}</div>
                                    </Form.Item>
                                    <Button type="default" onClick={handleCancelEditingiting} style={{ marginRight: 10 }}>取消</Button>
                                    <Button type="primary" onClick={handleSaveEditingFeature}>保存</Button>
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
                              <Form.Item label="显示名称">
                                <Input
                                  placeholder="输入新的特性名称"
                                  value={newFeatureName}
                                  onChange={(e) => setNewFeatureName(e.target.value)}
                                />
                              </Form.Item>
                              <Form.Item label="中文名称">
                                <Input
                                    placeholder="输入中文名称"
                                    value={newFeatureNameCn}
                                    onChange={(e) => setNewFeatureNameCn(e.target.value)}
                                />
                                </Form.Item>
                              <Form.Item label="位置">
                                <div>{newFeaturePosition || '暂无'}</div>
                              </Form.Item>
                              <Form.Item label="父容器">
                            <div>{newFeatureParentName}</div>
                            </Form.Item>
                              <Button type="default" onClick={handleCancelNewFeature} style={{ marginRight: 10 }}>取消</Button>
                              <Button type="primary" onClick={handleSaveNewFeature}>保存</Button>
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
                                isAdding={isAdding}
                                isEditing={isEditing}
                                resetSelection={resetTrigger}
                                unavailableGrids={unavailableGrids}
                                setHaveUnavailableGrids={setHaveUnavailableGrids}
                                setDifferentParents={setDifferentParents}
                                level2ContainerGrids={level2ContainerGrids}
                                level1ContainerGrids={level1ContainerGrids}
                                setSelectedPosition={setSelectedPosition}
                                setNewFeaturePosition={setNewFeaturePosition}
                                setEditingParentContainerName={setEditingParentContainerName} 
                                setNewFeatureParentContainerName={setNewFeatureParentContainerName}
                                entities={entities}
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