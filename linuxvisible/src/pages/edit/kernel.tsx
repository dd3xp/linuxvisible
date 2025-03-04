import React, { useEffect, useState } from 'react';
import { addPosToList, calculateKernelContainerPos } from '../../utils/calculateContainerPos';
import { getLevel3Color, getLocalContainers, getUniqueContainers } from '../../utils/common';
import { Empty } from 'antd';
import { EntityNode } from '../../utils/API';
import styles from "../styles/ContainerList.module.css";

const Kernel: React.FC = () => {
    const [containerData, setContainerData] = useState<EntityNode[]>([]);
    const [staticRender, setStaticRender] = useState<JSX.Element | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getLocalContainers();
            setContainerData(data);
        };
        fetchData();
    }, []);

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
                        <div className={`level-${level}-title ${belong_to_name}-title`}>{nameEn}</div>
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
                            backgroundColor: level3_color
                        }}
                    >
                        <div className={`level-${level}-title ${belong_to_name}-title`}>{nameEn}</div>
                    </div>
                );
            }
            elements.push(containerTsx);
        }

        setStaticRender(elements.length > 0 ? <>{elements}</> : <Empty style={{ marginTop: '20%' }} />);
    }, [containerData]);

    return <>{staticRender}</>;
};

export default Kernel;
