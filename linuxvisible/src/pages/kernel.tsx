import {useEffect, useState} from 'react';
import { addPosToList, calculateKernelContainerPos} from './utils/calculateContainerPos';
import { getLevel3Color, getUniqueContainers } from './utils/common';
import { Empty, Modal } from 'antd';
import StatisticModal from './components/StatisticModal';
import { EntityNode } from './api/API';

interface VersionInformation {
    repo: string | null;
    startVersion: string | null;
    endVersion: string | null;
}

interface KernelProps {
    selected: string[] | null,
    onContainerSelect: (component: string | null, type: string, id?: number) => void,
    versionInfo: VersionInformation | null,
    freshFeatureListByVersion?: (repo: string, version1: string, version2: string) => void,
    freshFeatureListByKgentity?: (repo: string, version1: string, version2: string, eid: number) => void
}

const Kernel: React.FC<KernelProps> = ({
                                           selected,
                                           onContainerSelect,
                                           versionInfo,
                                           freshFeatureListByVersion,
                                           freshFeatureListByKgentity
                                       }) => {
    const [contextMessage, setContextMessage] = useState<string | null>(null);
    const [dynamicCode, setDynamicCode] = useState<JSX.Element | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [containerData, setContainerData] = useState<EntityNode[]>([])
    const [contextEid, setContextEid] = useState<number | null>(null);

    useEffect(()=>{
        // step1: 获取json数据
        const fetchData =async () => {
            if (versionInfo !== null) {
                const data = await getUniqueContainers(versionInfo.repo ?? '', versionInfo.startVersion ?? '', versionInfo.endVersion ?? '')
                setContainerData(data)
            }
        }
        fetchData()
    }, [versionInfo])

    useEffect(() => {
        // 防止每次选择都重新请求json数据
        addPosToList(containerData)
        const codeElements: JSX.Element[] = [];
        for (const container of containerData) {
            // step2: 计算每个container位置
            const eid = container.eid
            const title = container.nameEn
            const level = container.level
            const belong_to = container.belongTo ?? -1
            const belong_to_container = containerData.find((item)=>item.eid===belong_to)
            const belong_to_name_with_hyphen = (belong_to_container?.nameEn ?? 'linux').replaceAll(' ', '-')
            const position = calculateKernelContainerPos(eid, level, container.x1, container.y1, container.x2, container.y2, belong_to)
            // step3: 根据位置生成对应的Element
            const title_with_hyphen = title.replaceAll(' ', '-')
            let containerTsx: JSX.Element = <></>;
            if (level !== 3) {
                containerTsx = (
                    <div
                        key={`${title_with_hyphen}-${level}-${belong_to_name_with_hyphen}`}
                        className={`${title_with_hyphen} level-${level}-container ${belong_to_name_with_hyphen}-${level}`}
                        style={{
                            top: position[0],
                            bottom: position[1],
                            left: position[2],
                            right: position[3]
                        }}
                    >
                        <div className={`level-${level}-title ${belong_to_name_with_hyphen}-title`}>{title}</div>
                    </div>
                );
            } else {
                // 获取level3节点所在的level1节点
                const level1_container = containerData.find((item)=>item.eid===belong_to_container?.belongTo)
                const level3_color = getLevel3Color(level1_container ?? belong_to_container)
                containerTsx = (
                    <div
                        key={`${title_with_hyphen}-${level}-${belong_to_name_with_hyphen}`}
                        className={`${title_with_hyphen} level-${level}-container ${belong_to_name_with_hyphen}-${level} ${selected?.includes(title_with_hyphen) ? 'selected' : ''}`}
                        onClick={(e) => handleClick(eid, title_with_hyphen, e)}
                        onContextMenu={(e) => handleRightClick(title_with_hyphen, e)}
                        style={{
                            top: position[0],
                            bottom: position[1],
                            left: position[2],
                            right: position[3],
                            backgroundColor: level3_color
                        }}
                    >
                        <div className={`level-${level}-title ${belong_to_name_with_hyphen}-title`}>{title}</div>
                    </div>
                );
            }
            codeElements.push(containerTsx);
        }
        if (codeElements.length > 0){
            setDynamicCode(<>{codeElements}</>)
        }else{
            setDynamicCode(<Empty style={{marginTop: '20%'}}/>)
        }
    }, [containerData, selected])

    const handleClick = (eid: number, containerName: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (selected?.includes(containerName)) {
            onContainerSelect(null, 'null');
            freshFeatureListByVersion?.(versionInfo?.repo ?? '', versionInfo?.startVersion ?? '', versionInfo?.endVersion ?? '');
        } else {
            onContainerSelect(containerName, 'module');
            freshFeatureListByKgentity?.(versionInfo?.repo ?? '', versionInfo?.startVersion ?? '', versionInfo?.endVersion ?? '', eid ?? '');
        }
    };

    const handleRightClick = (containerName: string, event: React.MouseEvent) => {
        // 阻止默认右键菜单
        event.preventDefault()
        // 显示右键菜单
        const menu: any = document.getElementById('context-menu');
        menu.style.display = 'block';
        menu.style.left = (event.pageX - 250) + 'px';
        menu.style.top = (event.pageY - 10) + 'px';
        setContextMessage(containerName) // 存储点击的container信息
        document.addEventListener('click', hideContextMenu);
        const container = containerData.find(item => 
            item.nameEn.replaceAll(' ', '-') === containerName
        );
        setContextEid(container?.eid ?? null); // 保存找到的 eid
    }

    // 右键菜单项点击
    const handleMenuItemClick = (item: string) => {
        console.log(item)
        hideContextMenu()
        if (item === '1') {
            setIsModalOpen(true)
        }
    }

    // 隐藏右键菜单
    const hideContextMenu = () => {
        const menu: any = document.getElementById('context-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {dynamicCode ? dynamicCode : <Empty style={{marginTop: '20%'}}/>}
            <div id="context-menu">
                <ul>
                    <li onClick={() => handleMenuItemClick('1')}>1</li>
                    <li onClick={() => handleMenuItemClick('2')}>2</li>
                </ul>
            </div>
            <div className="modal1">
                <Modal
                    title={contextMessage}
                    open={isModalOpen}
                    zIndex={9999}
                    onCancel={handleModalCancel}
                    width={800}
                >
                    <StatisticModal 
                        containerName={contextMessage}
                        eid={contextEid}
                        repo={versionInfo?.repo ?? ''}
                        startVersion={versionInfo?.startVersion ?? ''}
                        endVersion={versionInfo?.endVersion ?? ''}
                    />
                </Modal>
            </div>
        </>
    )
}

export default Kernel;