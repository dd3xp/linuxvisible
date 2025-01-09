import React, { useEffect, useState } from "react";
import { Modal, Table, Button, Collapse, Empty, Form, Select, Tooltip, message, TableColumnType, Input } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import styles from "../styles/ContainerList.module.css";
import FeatureModal from "./components/FeatureModal";
import { getVersion } from "./api/services/feature";
import {
    getAllBoxCodeData,
    getAllBoxCommitData,
    getAllBoxFeatureData,
    getCompanyFeatureContribution,
    getCompanyCommitContribution,
    getCompanyCodeContribution
} from "./api/services/company";
import { matchAndPopulateNodes, processFeatureContributionData, processCommitContributionData,processCodeContributionData} from "./utils/company";
import { getUniqueContainers } from "./utils/common";

interface Container {
    featureId: number;
    text: string;
    version: string;
}

interface VersionInformation {
    repo: string | null;
    startVersion: string | null;
    endVersion: string | null;
}

interface VersionData {
    [key: string]: string[];
}

interface ContainerListProps {
    selected: string[] | null;
    onContainerSelect: (text: string | null, type: string, id?: number) => void;
    onVersionSelect: (repo: string, version1: string, version2: string) => void;
    freshFeatureListByVersion: (repo: string, version1: string, version2: string) => void;
    freshFeatureListByKgentity?: () => void;
    containers?: Container[];
}

interface ModalConfig {
    title: string;
    columns: TableColumnType[];
    dataType: string;
}

interface ProcessedFeatureContribution {
    key: number;
    company: string;
    featureCount: number;
    percentage: string;
    isBold: boolean;
}

// 定义提交贡献数据的接口类型
interface ProcessedCommitContribution {
    key: number;
    company: string;
    commitCount: number;
    percentage: string;
    isBold: boolean;
}

// 定义代码贡献数据的接口类型
interface ProcessedCodeContribution {
    key: number;
    company: string;
    added: number;
    deleted: number;
    total: number;
    percentage: string;
    isBold: boolean;
}

const ContainerList: React.FC<ContainerListProps> = ({
                                                         selected,
                                                         onContainerSelect,
                                                         freshFeatureListByVersion,
                                                         containers,
                                                     }) => {
    const [clickTimer, setClickTimer] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFeatureId, setCurrentFeatureId] = useState<number | null>(null);
    const [versionData, setVersionData] = useState<VersionData>();
    const [repoList, setRepoList] = useState<string[]>([]);
    const [versionList, setVersionList] = useState<string[]>([]);
    const [versionInfo, setVersionInfo] = useState<VersionInformation>({
        repo: null,
        startVersion: null,
        endVersion: null,
    });
    const [circleActiveState, setCircleActiveState] = useState<Record<string, boolean>>({
        特性贡献: false,
        提交贡献: false,
        代码贡献: false,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    // 特性搜索
    const [searchInput, setSearchInput] = useState<string>('')

    useEffect(() => {
        getVersion().then((data) => {
            setVersionData(data);
            setRepoList(Object.keys(data));
            setVersionList([]);
        });
    }, []);

    const handleClick = (component: Container, event: React.MouseEvent) => {
        clearTimeout(clickTimer);
        setClickTimer(
            setTimeout(() => {
                event.stopPropagation();
                if (selected?.includes(component.text)) {
                    onContainerSelect(null, "null");
                } else {
                    onContainerSelect(component.text, "list", component.featureId);
                }
            }, 800)
        );
    };

    const handleDoubleClick = (component: Container, event: React.MouseEvent) => {
        clearTimeout(clickTimer);
        event.stopPropagation();
        setCurrentFeatureId(component.featureId);
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const handleCircleClick = async (type: string) => {
        const { repo, startVersion, endVersion } = versionInfo;

        if (!startVersion || !endVersion || !repo) {
            message.warning("请先选择库、开始版本和结束版本");
            return;
        }

        const currentActiveType = Object.keys(circleActiveState).find((key) => circleActiveState[key]);
        const isActive = circleActiveState[type];

        try {
            if (currentActiveType && currentActiveType !== type) {
                const containerData = await getUniqueContainers(repo, startVersion, endVersion);
                const param = { start_version: startVersion, end_version: endVersion };
                let backendData;

                if (currentActiveType === "特性贡献") {
                    backendData = await getAllBoxFeatureData(param);
                } else if (currentActiveType === "提交贡献") {
                    backendData = await getAllBoxCommitData(param);
                } else if (currentActiveType === "代码贡献") {
                    backendData = await getAllBoxCodeData(param);
                }

                matchAndPopulateNodes(containerData, backendData, false);
                message.success(`${currentActiveType} 功能已成功触发，操作: 删除图片！`);
            }

            setCircleActiveState((prevState) => {
                const newState: Record<string, boolean> = {};
                Object.keys(prevState).forEach((key) => {
                    newState[key] = key === type ? !isActive : false;
                });
                return newState;
            });

            const containerData = await getUniqueContainers(repo, startVersion, endVersion);
            const param = { start_version: startVersion, end_version: endVersion };
            let backendData;

            if (type === "特性贡献") {
                backendData = await getAllBoxFeatureData(param);
            } else if (type === "提交贡献") {
                backendData = await getAllBoxCommitData(param);
            } else if (type === "代码贡献") {
                backendData = await getAllBoxCodeData(param);
            }

            matchAndPopulateNodes(containerData, backendData, !isActive);

            message.success(`${type} 功能已成功触发，操作: ${isActive ? "删除图片" : "插入图片"}！`);
        } catch (error) {
            console.error(`${type} 时发生错误：`, error);
            message.error(`${type} 功能触发失败，请检查日志！`);
        }
    };

    const handleFeatureContributionClick = async () => {
        const { startVersion, endVersion } = versionInfo;

        if (!startVersion || !endVersion) {
            message.warning("请先选择开始版本和结束版本");
            return;
        }

        setLoading(true);
        try {
            const response = await getCompanyFeatureContribution({
                start_version: startVersion,
                end_version: endVersion,
            });
            const formattedData = processFeatureContributionData(response);
            setTableData(formattedData);
        } catch (error) {
            console.error("获取特性贡献数据失败:", error);
        } finally {
            setLoading(false);
            setIsModalVisible(true);
        }
    };

    const featureColumns: TableColumnType[] = [
        {
            title: "公司",
            dataIndex: "company",
            key: "company",
            width: 250, // 固定列宽
            align: 'center', // 表格内容
            render: (text: string) => (
                <div style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",textAlign: "center" }} title={text}>
                    {text}
                </div>
            ),
        },
        {
            title: "特性个数",
            dataIndex: "featureCount",
            key: "featureCount",
            width: 250,
            align: 'center', // 表格内容居中
        },
        {
            title: "占比",
            dataIndex: "percentage",
            key: "percentage",
            align: 'center', // 表格内容居中
        },
    ];

    const handleCommitContributionClick = async () => {
        const { startVersion, endVersion } = versionInfo;

        if (!startVersion || !endVersion) {
            message.warning("请先选择开始版本和结束版本");
            return;
        }

        setLoading(true);
        try {
            const response = await getCompanyCommitContribution({
                start_version: startVersion,
                end_version: endVersion,
            });
            console.log(response, "提交贡献数据");
            const formattedData = processCommitContributionData(response);
            setTableData(formattedData);
        } catch (error) {
            console.error("获取提交贡献数据失败:", error);
        } finally {
            setLoading(false);
            setIsModalVisible(true);
        }
    };

    // 提交贡献数据表格的列配置
    const commitColumns: TableColumnType[] = [
        {
            title: "公司",
            dataIndex: "company",
            key: "company",
            width: 250, // 固定列宽
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
            width: 250,
            align: "center", // 表格内容居中
        },
        {
            title: "占比",
            dataIndex: "percentage",
            key: "percentage",
            align: "center", // 表格内容居中
        },
    ];

    const handleCodeContributionClick = async () => {
        const { startVersion, endVersion } = versionInfo;

        if (!startVersion || !endVersion) {
            message.warning("请先选择开始版本和结束版本");
            return;
        }

        setLoading(true);
        try {
            // 调用获取代码贡献数据的接口
            const response = await getCompanyCodeContribution({
                start_version: startVersion,
                end_version: endVersion,
            });
            console.log(response, "代码贡献数据");
            // 格式化数据
            const formattedData = processCodeContributionData(response);
            // 更新表格数据
            setTableData(formattedData);
        } catch (error) {
            console.error("获取代码贡献数据失败:", error);
        } finally {
            setLoading(false);
            setIsModalVisible(true); // 显示模态框
        }
    };

// 代码贡献数据表格的列配置
    const codeColumns: TableColumnType[] = [
        {
            title: "公司",
            dataIndex: "company",
            key: "company",
            width: 175,
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
            width: 150,
            align: "center",
        },
        {
            title: "删除代码行",
            dataIndex: "deleted",
            key: "deleted",
            width: 150,
            align: "center",
        },
        {
            title: "总代码行",
            dataIndex: "total",
            key: "total",
            width: 150,
            align: "center",
        },
        {
            title: "占比",
            dataIndex: "percentage",
            key: "percentage",
            align: "center",
        },
    ];

    /**
     * 动态配置模态框内容
     */
    const [modalConfig, setModalConfig] = useState<ModalConfig>({
        title: "不同公司在特性方面的贡献", // 默认标题
        columns: featureColumns, // 默认列配置
        dataType: "feature", // 默认数据类型
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { value: inputValue } = e.target;
        setSearchInput(inputValue)
    }

    const items = [
        {
            key: "version-select",
            label: "版本选择",
            children: (
                <div className="version-select">
                    <Form>
                        <Form.Item label="库" className={styles.versionItem}>
                            <Select
                                placeholder="请选择"
                                value={versionInfo?.repo}
                                onChange={(v) => {
                                    setVersionInfo({
                                        repo: v || null,
                                        startVersion: null,
                                        endVersion: null,
                                    });
                                    setVersionList(v ? versionData![v] : []);
                                }}
                                allowClear
                                options={repoList.map((v) => ({ value: v, label: v }))}
                            />
                        </Form.Item>
                        {/* 版本选择表单 */}
                        <Form.Item label="开始版本" className={styles.versionItem}>
                            <Select
                                placeholder="请选择"
                                value={versionInfo?.startVersion}
                                onChange={(v) => setVersionInfo((prev) => ({ ...prev!, startVersion: v }))}
                                allowClear
                                options={versionList.map((v) => ({ value: v, label: v }))}
                            />
                        </Form.Item>
                        <Form.Item label="结束版本" className={styles.versionItem}>
                            <Select
                                placeholder="请选择"
                                value={versionInfo?.endVersion}
                                onChange={(v) => setVersionInfo((prev) => ({ ...prev!, endVersion: v }))}
                                allowClear
                                options={versionList.map((v) => ({ value: v, label: v }))}
                            />
                        </Form.Item>
                        <Form.Item className={styles.versionItem}>
                            <Button
                                type="primary"
                                onClick={() =>
                                    freshFeatureListByVersion(
                                        versionInfo?.repo || "",
                                        versionInfo?.startVersion || "",
                                        versionInfo?.endVersion || ""
                                    )
                                }
                            >
                                确认
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key: "container-list",
            label: "特性列表",
            children: (
                <>
                <Input placeholder="搜索特性" prefix={<SearchOutlined />} style={{marginBottom: '10px'}} onChange={handleInputChange}/>
                <div className={styles.containerList}>
                    {containers && containers.length === 0 ? (
                        <Empty />
                    ) : (
                        containers?.filter((item)=>item.text.includes(searchInput)).map((item, index) => (
                            <Tooltip title={item.text} placement="right" key={index}>
                                <div
                                    className={`${styles.listItem} ${
                                        selected?.includes(item.text) ? "feature-selected" : ""
                                    }`}
                                    onClick={(e) => handleClick(item, e)}
                                    onDoubleClick={(e) => handleDoubleClick(item, e)}
                                >
                                    {item.text.length > 55
                                        ? item.text.substring(0, 50) + "..."
                                        : item.text}
                                </div>
                            </Tooltip>
                        ))
                    )}
                </div>
                </>
            ),
        },
        {
            key: "company-contribution",
            label: "公司组织",
            children: (
                <div className={styles.contributionSection}>
                    {["特性贡献", "提交贡献", "代码贡献"].map((label, index) => (
                        <div className={styles.contributionItem} key={index}>
                            <div
                                className={`${styles.contributionCircle} ${
                                    circleActiveState[label] ? styles.contributionCircleActive : ""
                                }`}
                                onClick={() => handleCircleClick(label)}
                            ></div>
                            <span className={styles.contributionLabel}>{label}</span>
                            <img
                                className={styles.contributionIcon}
                                src="/contribution.png"
                                alt={label}
                                onClick={() => {
                                    if (label === "特性贡献") {
                                        handleFeatureContributionClick();
                                        setModalConfig({
                                            title: "不同公司在特性方面的贡献",
                                            columns: featureColumns,
                                            dataType: "feature",
                                        });
                                    } else if (label === "提交贡献") {
                                        handleCommitContributionClick();
                                        setModalConfig({
                                            title: "不同公司在提交方面的贡献",
                                            columns: commitColumns,
                                            dataType: "commit",
                                        });
                                    } else if (label === "代码贡献") {
                                        handleCodeContributionClick();
                                        setModalConfig({
                                            title: "不同公司在代码方面的贡献",
                                            columns: codeColumns,
                                            dataType: "code",
                                        });
                                    }
                                }}
                            />
                        </div>
                    ))}
                    <Modal
                        title={<div className={styles.modalTitle}>{modalConfig.title}</div>}
                        open={isModalVisible}
                        onCancel={() => setIsModalVisible(false)} // 点击叉键关闭
                        footer={null}
                        width={800} // 固定模态框宽度
                        zIndex={9999}
                        maskClosable={false}
                    >
                        <Table
                            dataSource={tableData}
                            columns={modalConfig.columns} // 动态切换列配置
                            pagination={{
                                pageSize: 10, // 默认每页显示 10 条
                                showQuickJumper: true, // 显示跳页输入框
                                showSizeChanger: false, // 移除分页大小选择器（默认行为）
                            }}
                            rowClassName={(record) =>
                                record.isBold ? `${styles.boldRow}` : ""
                            }
                            loading={loading}
                            className={styles.table}
                            scroll={{ x: 500 }} // 强制表格横向滚动，宽度稳定
                        />
                        <div style={{ marginTop: 16, color: "gray", fontSize: 12 }}>
                            <p>粗线：界定明确的组织和其他组织</p>
                            {modalConfig.dataType === "feature" && (
                                <p>备注：同一特性之间可能会有多个公司参与贡献，故占比总和超过100%。</p>
                            )}
                        </div>
                    </Modal>
                </div>
            ),
        }
    ];

    return (
        <>
            <Collapse
                items={items}
                expandIconPosition="end"
                bordered={false}
                defaultActiveKey={["version-select"]}
                className={styles.sideCollapse}
            />
            <div className="feature-modal">
                <Modal
                    title="追溯结果"
                    open={isModalOpen}
                    zIndex={9999}
                    width={800}
                    onCancel={handleModalCancel}
                >
                    <FeatureModal
                        featureId={currentFeatureId}
                        version={
                            containers?.find((c) => c.featureId === currentFeatureId)?.version ||
                            null
                        }
                        repo={versionInfo?.repo || null}
                    />
                </Modal>
            </div>
        </>
    );
};

export default ContainerList;