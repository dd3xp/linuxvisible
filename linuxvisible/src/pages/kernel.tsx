import React, {useEffect, useState} from 'react';
import {addPosToList, calculateKernelContainerPos} from '../utils/calculateContainerPos';
import {getLevel3Color, getUniqueContainers} from '../utils/common';
import styles from "../styles/ContainerList.module.css";
import {Empty, Modal, TableColumnType, message, Table} from 'antd';
import StatisticModal from './components/StatisticModal';
import {
    getBoxFeatureContribution,
    getBoxCommitContribution,
    getBoxCodeContribution,
    getBoxFeatureDataByVersionAndCompany,
    getBoxCommitDataByVersionAndCompany,
    getCompanyFeatureDataByVersionAndCompany, getCompanyCommitDataByVersionAndCompany
} from "../services/company";
import {processContributionData} from "../utils/company";
import {EntityNode} from '../utils/API';
import dayjs from "dayjs";

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
    circleActiveState: Record<string, boolean>;
    companyList: string;// 侧边栏选择的公司，用于查看节点贡献
}

interface ModalConfig {
    title: string;
    columns: TableColumnType[];
    dataType: string;
}

const Kernel: React.FC<KernelProps> = ({
                                           selected,
                                           onContainerSelect,
                                           versionInfo,
                                           freshFeatureListByVersion,
                                           freshFeatureListByKgentity,
                                           circleActiveState,
                                           companyList
                                       }) => {
    const [contextMessage, setContextMessage] = useState<string | null>(null);
    const [dynamicCode, setDynamicCode] = useState<JSX.Element | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [containerData, setContainerData] = useState<EntityNode[]>([])
    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentNodePosition, setCurrentNodePosition] = useState<{ top: number, left: number }>({top: 0, left: 0});
    const [contextEid, setContextEid] = useState<number | null>(null);

    useEffect(() => {
        // step1: 获取json数据
        const fetchData = async () => {
            if (versionInfo !== null) {
                const data = await getUniqueContainers(versionInfo.repo ?? '', versionInfo.startVersion ?? '', versionInfo.endVersion ?? '')
                setContainerData(data)
            }
        }
        fetchData()
    }, [versionInfo])

    useEffect(() => {
        if (contextEid === null) {
            setIsModalOpen(false);  // 在 contextEid 更新后关闭 Modal
        }
    }, [contextEid]);  // 依赖 contextEid，当它变为 null 时执行

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
            const belong_to_container = containerData.find((item) => item.eid === belong_to)
            const belong_to_name_with_hyphen = (belong_to_container?.nameEn ?? 'linux').replaceAll(' ', '-')
            const position = calculateKernelContainerPos(eid, level, container.x1, container.y1, container.x2, container.y2, belong_to)
            // step3: 根据位置生成对应的Element
            const title_with_hyphen = title?.replaceAll(' ', '-')
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
                const level1_container = containerData.find((item) => item.eid === belong_to_container?.belongTo)
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
        if (codeElements.length > 0) {
            setDynamicCode(<>{codeElements}</>)
        } else {
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
    const featureColumns: TableColumnType[] = [
        {
            title: "公司",
            dataIndex: "company",
            key: "company",
            // width: 100, // 固定列宽
            align: 'center', // 表格内容
            render: (text: string) => (
                <div style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "center"}}
                     title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: "特性个数",
            dataIndex: "featureCount",
            key: "featureCount",
            // width: 100,
            align: 'center', // 表格内容居中
            render: (_, record) => (
                <a
                    onClick={() => handleFeatureCountClick(record.company, record.originalCompany)}
                    style={{cursor: "pointer"}}
                >
                    {record.featureCount}
                </a>
            ),
        },
        {
            title: "占比",
            dataIndex: "percentage",
            key: "percentage",
            align: 'center', // 表格内容居中
            hidden: companyList !== ''
        },
    ];

    // 提交贡献数据表格的列配置
    const commitColumns: TableColumnType[] = [
        {
            title: "公司",
            dataIndex: "company",
            key: "company",
            // width: 100, // 固定列宽
            align: "center",
            render: (text: string) => (
                <div
                    style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                    }}
                    title={text}
                >
                    {text}
                </div>
            ),
        },
        {
            title: "提交个数",
            dataIndex: "commitCount",
            key: "commitCount",
            // width: 100,
            align: "center", // 表格内容居中
            render: (_, record) => (
                <a
                    onClick={() => handleCommitCountClick(record.company, record.originalCompany)}
                    style={{cursor: "pointer"}}
                >
                    {record.commitCount}
                </a>
            ),
        },
        {
            title: "占比",
            dataIndex: "percentage",
            key: "percentage",
            align: "center", // 表格内容居中
            hidden: companyList !== ''
        },
    ];

    // 代码贡献数据表格的列配置
    const codeColumns: TableColumnType[] = [
        {
            title: "公司",
            dataIndex: "company",
            key: "company",
            // width: 80,
            align: "center",
            render: (text: string) => (
                <div
                    style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                    }}
                    title={text}
                >
                    {text}
                </div>
            ),
        },
        {
            title: "新增代码行",
            dataIndex: "added",
            key: "added",
            // width: 50,
            align: "center",
        },
        {
            title: "删除代码行",
            dataIndex: "deleted",
            key: "deleted",
            // width: 50,
            align: "center",
        },
        {
            title: "总代码行",
            dataIndex: "total",
            key: "total",
            // width: 50,
            align: "center",
        },
        {
            title: "占比",
            dataIndex: "percentage",
            key: "percentage",
            align: "center",
            hidden: companyList !== ''
        },
    ];

    /**
     * 动态配置模态框内容
     */
    const [modalConfig, setModalConfig] = useState<ModalConfig>({
        title: "", // 默认标题
        columns: [], // 无默认列配置
        dataType: "none", // 默认数据类型
    });

    const handleRightClick = (containerName: string, event: React.MouseEvent) => {
        // 阻止默认右键菜单
        event.preventDefault()
        // 获取节点框位置
        const rect = event.currentTarget.getBoundingClientRect();
        setCurrentNodePosition({
            top: rect.top,
            left: rect.left
        });
        // 显示右键菜单
        const menu: any = document.getElementById('context-menu');
        menu.style.display = 'block';
        menu.style.left = (event.pageX - 250) + 'px';
        menu.style.top = (event.pageY - 10) + 'px';
        setContextMessage(containerName) // 存储点击的container信息
        document.addEventListener('click', hideContextMenu);
        const container = containerData.find(item => 
            item.nameEn?.replaceAll(' ', '-') === containerName
        );
        setContextEid(container?.eid ?? null); // 保存找到的 eid
    }

    // 右键菜单项点击
    const handleMenuItemClick = async (item: string) => {
        console.log(item);
        hideContextMenu();

        if (item === "查看文件") {
            setIsModalOpen(true);
        } else if (item === "查看贡献") {
            if (!versionInfo?.startVersion || !versionInfo?.endVersion) {
                message.warning("请先选择开始版本和结束版本");
                return;
            }

            setLoading(true);
            let isDataProcessed = false; // 标记是否成功处理了数据
            try {
                if (circleActiveState["特性贡献"]) {
                    const response = await getBoxFeatureContribution({
                        start_version: versionInfo.startVersion,
                        end_version: versionInfo.endVersion,
                        // eidName: contextMessage?.replaceAll('-', ' ') || '', // 替换 '-' 为空格, // 使用右键选中的节点名
                        eid: contextEid, // 使用右键选中的节点eid
                        company_list: companyList
                    });
                    console.log(contextMessage);
                    console.log(response);
                    const formattedData = processContributionData(response, "feature");
                    setModalConfig({
                        title: "不同公司对该节点的特性贡献",
                        columns: featureColumns,
                        dataType: "feature",
                    });
                    setTableData(formattedData);
                    isDataProcessed = true; // 标记数据已成功处理
                } else if (circleActiveState["提交贡献"]) {
                    const response = await getBoxCommitContribution({
                        start_version: versionInfo.startVersion,
                        end_version: versionInfo.endVersion,
                        // eidName: contextMessage?.replaceAll('-', ' ') || '',
                        eid: contextEid, // 使用右键选中的节点eid
                        repo: versionInfo.repo ?? '', // 设置默认值为空字符串
                        company_list: companyList
                    });
                    const formattedData = processContributionData(response, "commit");
                    setModalConfig({
                        title: "不同公司对该节点的提交贡献",
                        columns: commitColumns,
                        dataType: "commit",
                    });
                    setTableData(formattedData);
                    isDataProcessed = true; // 标记数据已成功处理
                } else if (circleActiveState["代码贡献"]) {
                    const response = await getBoxCodeContribution({
                        start_version: versionInfo.startVersion,
                        end_version: versionInfo.endVersion,
                        // eidName: contextMessage?.replaceAll('-', ' ') || '',
                        eid: contextEid, // 使用右键选中的节点eid
                        repo: versionInfo.repo ?? '', // 设置默认值为空字符串
                        company_list: companyList
                    });
                    const formattedData = processContributionData(response, "code");
                    setModalConfig({
                        title: "不同公司对该节点的代码贡献",
                        columns: codeColumns,
                        dataType: "code",
                    });
                    setTableData(formattedData);
                    isDataProcessed = true; // 标记数据已成功处理
                } else {
                    message.warning("请选择一个贡献类型！");
                    setIsModalVisible(false); // 确保模态框不会弹出
                    return;
                }
            } catch (error) {
                console.error("获取贡献数据失败:", error);
                message.error("获取贡献数据失败，请稍后重试！");
            } finally {
                setLoading(false);
                if (isDataProcessed) {
                    setIsModalVisible(true); // 只有成功处理了数据才显示模态框
                }
            }
        }
    };

    // 点击“特性个数”列获取公司特性数据
    const handleFeatureCountClick = async (company: string, originalCompany: string) => {
        if (!versionInfo?.startVersion || !versionInfo.endVersion) {
            message.warning("请先选择开始版本和结束版本");
            return;
        }

        setLoading(true);
        try {
            const response = await getBoxFeatureDataByVersionAndCompany({
                start_version: versionInfo.startVersion,
                end_version: versionInfo.endVersion,
                company_name: originalCompany,
                // eidName: contextMessage?.replaceAll('-', ' ') || '',
                eid: contextEid, // 使用右键选中的节点eid
            });
            console.log(response, "特性贡献详情");
            const formattedData = response.map((item: any, index: number) => ({
                key: index,
                feature: item.text,
                version: item.version,
                commit: item.commit_id,
                h1: item.h1,
                commitTime: dayjs(item.commit_time).format("YYYY-MM-DD HH:mm:ss"), // 自定义格式
            }));
            setTableData(formattedData);
            setModalConfig({
                title: `${company} 的特性贡献详情`,
                columns: [
                    {
                        title: "版本",
                        dataIndex: "version",
                        key: "version",
                        align: "center",
                    },
                    {
                        title: "特性",
                        dataIndex: "feature",
                        key: "feature",
                        align: "center",
                        // width: 250,
                        render: (feature, record) => {
                            const h1WithUnderscores = (record.h1 || "").replace(/\s/g, "_"); // 替换空格为 _
                            return (
                                <a
                                    href={`https://kernelnewbies.org/Linux_${record.version}#${h1WithUnderscores}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {feature}
                                </a>
                            );
                        },
                    },
                    {
                        title: "提交",
                        dataIndex: "commit",
                        key: "commit",
                        align: "center",
                        // width: 250,
                        render: (commit) => (
                            <a
                                href={`https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=${commit}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {commit}
                            </a>
                        ),
                    },
                    {
                        title: "提交时间",
                        dataIndex: "commitTime",
                        key: "commitTime",
                        align: "center",
                    },

                ],
                dataType: "featureDetails",
            });
            setIsModalVisible(true);
        } catch (error) {
            console.error("获取公司特性数据失败:", error);
        } finally {
            setLoading(false);
        }
    };


    // 点击“提交个数”列获取公司提交数据
    const handleCommitCountClick = async (company: string, originalCompany: string) => {
        if (!versionInfo?.startVersion || !versionInfo?.endVersion) {
            message.warning("请先选择开始版本和结束版本");
            return;
        }
        setLoading(true);
        try {
            const response = await getBoxCommitDataByVersionAndCompany({
                start_version: versionInfo.startVersion,
                end_version: versionInfo.endVersion,
                company_name: originalCompany,
                // eidName: contextMessage?.replaceAll('-', ' ') || '',
                eid: contextEid, // 使用右键选中的节点eid
                repo: versionInfo.repo ?? '', // 设置默认值为空字符串
            });
            const formattedData = response.map((item: any, index: number) => ({
                key: index,
                commit: item,
            }));
            setTableData(formattedData);
            setModalConfig({
                title: `${company} 的提交贡献详情`,
                columns: [
                    {
                        title: "提交",
                        dataIndex: "commit",
                        key: "commit",
                        align: "center",
                        width: 250,
                        render: (commit) => (
                            <a
                                href={`https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=${commit}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {commit}
                            </a>
                        ),
                    },

                ],
                dataType: "commitDetails",
            });
        } catch (error) {
            console.error("获取公司提交数据失败:", error);
        } finally {
            setLoading(false);
        }
    };

    // 隐藏右键菜单
    const hideContextMenu = () => {
        const menu: any = document.getElementById('context-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    };

    const handleModalCancel = () => {
        setContextEid(null);
    };

    return (
        <>
            {dynamicCode ? dynamicCode : <Empty style={{marginTop: '20%'}}/>}
            <div id="context-menu">
                <ul>
                    <li onClick={() => handleMenuItemClick('查看文件')}>查看文件</li>
                    <li onClick={() => handleMenuItemClick('查看贡献')}>查看贡献</li>
                </ul>
            </div>
            <div className="modal1">
                <Modal
                    title={contextMessage}
                    open={isModalOpen}
                    zIndex={9999}
                    footer={null}
                    onCancel={handleModalCancel}
                    width={1200}
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
            {/* 显示贡献数据的模态框 */}
            <div className="modal2">
                <Modal
                    title={<div className={styles.modalTitle}>{modalConfig.title}</div>}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={900}
                    zIndex={9999}// 调整模态框宽度
                    style={{
                        position: 'absolute',
                        top: `calc(${currentNodePosition.top}px - 100px)`, // 根据节点框位置计算
                        left: `calc(${currentNodePosition.left}px + 90px)`
                    }}
                    mask={false} // 禁用遮罩层
                >
                    <Table
                        dataSource={tableData}
                        columns={modalConfig.columns} // 动态配置表格列
                        pagination={{
                            pageSize: 10,
                            showQuickJumper: true,
                            showSizeChanger: false,
                        }}
                        rowClassName={(record) =>
                            record.isBold ? `${styles.boldRow}` : ''
                        }
                        rowKey={'company'}
                        loading={loading}
                        className={styles.table}
                        scroll={{ x: 900 }} // 优化滚动宽度
                    />
                    {/* 添加描述文字 */}
                    <div style={{marginTop: 16, color: "gray", fontSize: 12}}>
                        <p>粗线：界定明确的组织和其他组织</p>
                        {modalConfig.dataType === "feature" && (
                            <p>备注：同一特性之间可能会有多个公司参与贡献，故占比总和超过100%。</p>
                        )}
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default Kernel;