import React, { useEffect, useState } from 'react';
import { addPosToList, calculateKernelContainerPos } from '../../utils/calculateContainerPos';
import { getLevel3Color, getUniqueContainers } from '../../utils/common';
import { Empty } from 'antd';
import { EntityNode } from '../../utils/API';

interface VersionInformation {
    repo: string | null;
    version: string | null;
}

interface KernelProps {
    versionInfo: VersionInformation | null;
    setFeatureName: (name: string) => void;
    selectedKernel: number | null;
    setSelectedKernel: (id: number | null) => void;
}

const Kernel: React.FC<KernelProps> = ({ versionInfo, setFeatureName, selectedKernel, setSelectedKernel }) => {
    const [containerData, setContainerData] = useState<EntityNode[]>([]);
    const [staticRender, setStaticRender] = useState<JSX.Element | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!versionInfo?.repo || !versionInfo?.version) return;

            try {
                // console.log("🔹 获取数据中...");
                const fetchedData = await getUniqueContainers(versionInfo.repo, versionInfo.version, versionInfo.version);
                // console.log("📄 获取的 JSON 数据:", fetchedData);

                let jsonDataVariable = fetchedData;
                // console.log("🔍 变量存储的 JSON:", jsonDataVariable);
                setContainerData(jsonDataVariable);
            } catch (error) {
                // console.error("❌ 处理 JSON 失败:", error);
            }
        };
        fetchData();
    }, [versionInfo]);    

    useEffect(() => {
        addPosToList(containerData);
        const elements: JSX.Element[] = [];

        for (const container of containerData) {
            const { eid, nameEn, level, belongTo, x1, y1, x2, y2 } = container;
            const belong_to_container = containerData.find((item) => item.eid === belongTo);
            const belong_to_name = (belong_to_container?.nameEn ?? 'linux').replace(/\s/g, '-');

            const position = calculateKernelContainerPos(eid, level, x1, y1, x2, y2, belongTo);
            const title = nameEn.replace(/\s/g, '-');

            let containerTsx: JSX.Element = <></>;

            if (level !== 3) {
                containerTsx = (
                    <div
                        key={`${title}-${level}-${belong_to_name}`}
                        className={`${title} level-${level}-container ${belong_to_name}-${level}`}
                        style={{
                            top: position[0],
                            bottom: position[1],
                            left: position[2],
                            right: position[3]
                        }}
                    >
                        <div className={`level-${level}-title ${belong_to_name}-title`}>
                            {nameEn}
                        </div>
                    </div>
                );
            } else {
                const level1_container = containerData.find((item) => item.eid === belong_to_container?.belongTo);
                const level3_color = getLevel3Color(level1_container ?? belong_to_container);

                containerTsx = (
                    <div
                        key={`${title}-${level}-${belong_to_name}`}
                        className={`${title} level-${level}-container ${belong_to_name}-${level}`}
                        style={{
                            top: position[0],
                            bottom: position[1],
                            left: position[2],
                            right: position[3],
                            backgroundColor: selectedKernel === eid ? 'red' : level3_color,
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            if (selectedKernel === eid) {
                                setSelectedKernel(null);
                                setFeatureName('');
                            } else {
                                setSelectedKernel(eid);
                                setFeatureName(nameEn);
                            }
                        }}
                    >
                        <div className={`level-${level}-title ${belong_to_name}-title`}>
                            {nameEn}
                        </div>
                    </div>
                );
            }
            elements.push(containerTsx);
        }

        setStaticRender(elements.length > 0 ? <>{elements}</> : <Empty style={{ marginTop: '20%' }} />);
    }, [containerData, selectedKernel]);

    return <div>{staticRender}</div>;
};

export default Kernel;
