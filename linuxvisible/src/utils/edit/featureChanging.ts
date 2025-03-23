/*
保存修改特性接受参数：
一个Entities，一个nameEn，一个nameCn，
一个x1，一个y1，一个x2，一个y2，一个parentEid，一个level固定为3，
一个更新时间。一个存储log的列表.
逻辑:先根据正在修改的特性的eid找到该特性,将参数与现有的特性的eid,nameEn,nameCn,x1,y1,x2,y2,parentEid进行比较,
如果相同则不进行修改,如果不同则进行修改,并将updatetime修改为参数中的更新时间.
最后修改了的内容作为log保存到存储log的列表中,格式为更新时间:修改内容.(这个修改内容不包括更新时间)
修改一次保存一个表项.
*/

/*
保存新增特性接受参数：
一个Entities，一个nameEn，一个nameCn，
一个x1，一个y1，一个x2，一个y2，一个parentEid，一个level固定为3，
一个创建时间，一个更新时间。
逻辑:根据数据创造一个特性实体
export interface EntityNode {
    eid: number;
    nameEn: string;
    nameCn: string | null;
    source: string | null;
    definitionEn: string | null;
    definitionCn: string | null;
    aliases: string | null;
    relDesc: string | null;
    wikidataId: string | null;
    createTime: string;
    updateTime: string;
    level: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    belongTo: number;
}
保存了什么参数就设置什么参数,eid设置为-2,新增的内容作为log保存到存储log的列表中,
格式为新增时间:新增内容.(这个内容就是新增的特性实体)
*/

import { EntityNode } from "../API.d";
import { message, Modal } from 'antd';
import { submitEditGraph } from '../../services/edit/applyEdit';

interface FeatureLog {
    time: string;
    content: string;
}

// 保存修改特性的函数
export const saveEditingFeature = (
    entities: EntityNode[],
    editingEid: number,
    nameEn: string,
    nameCn: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    parentEid: number | null,
    updateTime: string,
    logs: FeatureLog[]
): [EntityNode[], FeatureLog[]] => {
    // 用 eid 查找特性
    const editingFeature = entities.find(e => e.eid === editingEid);
    if (!editingFeature) return [entities, logs];

    // 检查是否有变化
    const changes: string[] = [];
    
    if (editingFeature.nameEn !== nameEn) {
        changes.push(`nameEn: ${editingFeature.nameEn} -> ${nameEn}`);
    }
    if ((editingFeature.nameCn || '') !== (nameCn || '')) {
        changes.push(`nameCn: ${editingFeature.nameCn || ''} -> ${nameCn || ''}`);
    }
    if (editingFeature.x1 !== x1) {
        changes.push(`x1: ${editingFeature.x1} -> ${x1}`);
    }
    if (editingFeature.y1 !== y1) {
        changes.push(`y1: ${editingFeature.y1} -> ${y1}`);
    }
    if (editingFeature.x2 !== x2) {
        changes.push(`x2: ${editingFeature.x2} -> ${x2}`);
    }
    if (editingFeature.y2 !== y2) {
        changes.push(`y2: ${editingFeature.y2} -> ${y2}`);
    }
    if (editingFeature.belongTo !== (parentEid ?? editingFeature.belongTo)) {
        changes.push(`belongTo: ${editingFeature.belongTo} -> ${parentEid}`);
    }

    // 如果有变化，更新实体并记录日志
    if (changes.length > 0) {
        const updatedEntities = entities.map(entity => {
            if (entity.eid === editingEid) {
                return {
                    ...entity,
                    nameEn,
                    nameCn,
                    x1,
                    y1,
                    x2,
                    y2,
                    belongTo: parentEid ?? entity.belongTo,
                    updateTime
                };
            }
            return entity;
        });

        const log = {
            time: updateTime,
            content: `修改特性 ${editingFeature.nameEn}(eid:${editingEid}): ${changes.join(', ')}`
        };
        
        console.log(`%c${log.time}: ${log.content}`, 'color: cyan');
        
        logs.push(log);
        return [updatedEntities, logs];
    }

    return [entities, logs];
};

// 保存新增特性的函数
export function saveNewFeature(
    entities: EntityNode[],
    nameEn: string,
    nameCn: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    parentEid: number | null,
    createTime: string,
    updateTime: string,
    logs: { time: string; content: string }[],
    tempEid: number
): [EntityNode[], { time: string; content: string }[]] {
    const newEntity: EntityNode = {
        eid: tempEid,
        nameEn,
        nameCn,
        x1,
        y1,
        x2,
        y2,
        belongTo: parentEid ?? -1,
        level: 3,
        createTime,
        updateTime,
        source: null,
        definitionEn: null,
        definitionCn: null,
        aliases: null,
        relDesc: null,
        wikidataId: null
    };

    const updatedEntities = [...entities, newEntity];
    
    // 修改日志格式并输出到控制台
    const newLog = {
        time: updateTime,
        content: `添加特性 "${nameEn}"，eid 尚未分配，位置 (${x1}, ${y1}) - (${x2}, ${y2})`
    };

    // 使用 console.log 替代 process.stdout.write
    console.log(`%c${newLog.time}: ${newLog.content}`, 'color: green');

    return [updatedEntities, [...logs, newLog]];
}

// 删除特性的函数
export function deleteFeature(
    entities: EntityNode[],
    deleteEid: number,
    deleteTime: string,
    logs: { time: string; content: string }[]
): [EntityNode[], { time: string; content: string }[]] {
    const deleteFeature = entities.find(e => e.eid === deleteEid);
    if (!deleteFeature) return [entities, logs];

    const updatedEntities = entities.filter(entity => entity.eid !== deleteEid);

    // 修改删除日志格式，包含完整的实体信息
    const deleteLog = {
        time: deleteTime,
        content: `删除特性:\n${JSON.stringify(deleteFeature, null, 2)}`
    };

    console.log(`%c${deleteLog.time}: ${deleteLog.content}`, 'color: red');

    return [updatedEntities, [...logs, deleteLog]];
}

export const applyEdits = async (entities: EntityNode[], version: string, repoPath: string) => {
    try {
        await submitEditGraph(entities, version, repoPath);
        message.success('编辑已应用');
        return true;
    } catch (error) {
        Modal.error({
            title: '连接错误',
            content: error instanceof Error ? error.message : '应用编辑失败，请检查后端服务是否正常运行',
            okText: '确定',
            styles: {
                mask: { zIndex: 9998 },
                wrapper: { zIndex: 9999 }
            }
        });
        console.error(error);
        return false;
    }
};

// 应用编辑的函数
export const handleApplyEdits = async (
    entities: EntityNode[], 
    setOriginEntities: (entities: EntityNode[]) => void,
    version: string,
    repoPath: string
) => {
    try {
        await submitEditGraph(entities, version, repoPath);
        message.success({
            content: '编辑已应用',
            style: { 
                zIndex: 9999999,
            }
        });

        setOriginEntities(entities);
        return true;
    } catch (error) {
        Modal.error({
            title: '连接错误',
            content: error instanceof Error ? error.message : '应用编辑失败，请检查后端服务是否正常运行',
            okText: '确定',
            styles: {
                mask: { zIndex: 99998 },
                wrapper: { zIndex: 99999 }
            }
        });

        console.error(error);
        return false;
    }
};

// 舍弃编辑的函数
export const handleDiscardEdits = (
    entities: EntityNode[],
    originEntities: EntityNode[],
    setEntities: (entities: EntityNode[]) => void,
    currentMode: 'editing' | 'adding' | null,
    handleCancelEditingiting: () => void,
    handleCancelNewFeature: () => void
) => {
    Modal.confirm({
        title: '确认舍弃',
        content: '确定要舍弃所有编辑吗？这将恢复到原始状态。',
        okText: '确认',
        cancelText: '取消',
        okType: 'danger',
        styles: {
            mask: { zIndex: 99998 },
            wrapper: { zIndex: 99999 }
        },
        onOk: () => {
            setEntities(originEntities);
            message.info({
                content: '已恢复到原始状态',
                duration: 2
            });

            if (currentMode === 'editing') {
                handleCancelEditingiting();
            } else if (currentMode === 'adding') {
                handleCancelNewFeature();
            }
        }
    });
};