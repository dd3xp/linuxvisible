import React, {useEffect, useState} from "react";
import {Modal, Table, Button, Collapse, Empty, Form, Select, Tooltip, message, TableColumnType, Input, Spin} from "antd";
import styles from "../styles/ContainerList.module.css";
import TrackModal from "./components/TrackModal";
import {getVersion,
        getVersionOverview,
    getFeatureOverview
} from "../services/feature";
import {
    getAllBoxCodeData,
    getAllBoxCommitData,
    getAllBoxFeatureData,
    getCompanyFeatureContribution,
    getCompanyCommitContribution,
    getCompanyCodeContribution,
    getCompanyListByVersion,
    getCompanyFeatureDataByVersionAndCompany,
    getCompanyCommitDataByVersionAndCompany,
    getBoxMaintainerData,
    getMAINTAINERSList
} from "../services/company";
import {matchAndPopulateNodes, processContributionData} from "../utils/company";
import {getUniqueContainers} from "../utils/common";
import {SearchOutlined} from "@ant-design/icons/lib/icons";
import dayjs from "dayjs";

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
    circleActiveState: Record<string, boolean>;
    setCircleActiveState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    onCompanyChange: (company: string) => void
}

interface ModalConfig {
    title: string;
    columns: TableColumnType[];
    dataType: string;
}

const ContainerList: React.FC<ContainerListProps> = ({
                                                         selected,
                                                         onContainerSelect,
                                                         freshFeatureListByVersion,
                                                         containers,
                                                         circleActiveState, // 从父组件传递
                                                         setCircleActiveState, // 从父组件传递
                                                         onCompanyChange
                                                     }) => {
    const [clickTimer, setClickTimer] = useState<any>(null);
    const [currentFeatureId, setCurrentFeatureId] = useState<number | null>(null);
    const [versionData, setVersionData] = useState<VersionData>();
    const [repoList, setRepoList] = useState<string[]>([]);
    const [versionList, setVersionList] = useState<string[]>([]);
    const [versionInfo, setVersionInfo] = useState<VersionInformation>({
        repo: null,
        startVersion: null,
        endVersion: null,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFeatureOverviewVisible, setFeatureOverviewModalVisible] = useState(false);
    const [isTrackVisible, setTrackVisible] = useState(false);
    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [overviewData, setOverviewData] = useState({
        featureCount: 0,
        commitCount: 0,
        companyCount: 0
    });
    // 特性搜索
    const [searchInput, setSearchInput] = useState<string>('')
    // 组织选择
    const [companyList, setCompanyList] = useState<string[]>([])
    const [company1, setCompany1] = useState<string | null>(null)
    const [company2, setCompany2] = useState<string | null>(null)
    const [currentNodePosition, setCurrentNodePosition] = useState<{ top: number, left: number }>({top: 0, left: 0});
    const [selectedfeatureId,setselectedfeatureId] = useState<number | null>(null);

    useEffect(() => {
        getVersion().then((data) => {
            setVersionData(data);
            setRepoList(Object.keys(data));
            setVersionList([]);
            localStorage.setItem('selectedFeatureId', '');
        });
    }, []);

    const handleVersionClick = () => {
        const version1 = versionInfo?.startVersion || ""
        const version2 = versionInfo?.endVersion || ""
        if ((version1 && version2 && version1 > version2) || (version1 && version2 && version1 > version2)) {
            message.error("开始版本不能大于结束版本！");
            return;
        }

        freshFeatureListByVersion(
            versionInfo?.repo || "",
            version1,
            version2
        )

        // 根据版本信息获取公司列表
        getCompanyListByVersion({
            start_version: version1,
            end_version: version2
        }).then((data) => {
            setCompanyList(data)
        })

        getVersionOverview({
            repoPath: versionInfo?.repo || "",
            startVersion: version1,
            endVersion: version2
        })
        .then(data => {
            setOverviewData(data);
        })
    }

    const handleClick = (component: Container, event: React.MouseEvent) => {
        clearTimeout(clickTimer);
        setClickTimer(
            setTimeout(() => {
                event.stopPropagation();
                console.log("watch selected",selected);
                if (selected?.includes(component.text)) {
                    onContainerSelect(null, "null");
                    setselectedfeatureId(null);
                    localStorage.setItem('selectedFeatureId', '');
                } else {
                    onContainerSelect(component.text, "list", component.featureId);
                    setselectedfeatureId(component.featureId);
                    localStorage.setItem('selectedFeatureId', String(component.featureId));
                }
            }, 800)
        );
    };

    const handleRightClick = (component: Container, event: React.MouseEvent) => {
        // 阻止默认右键菜单
        event.preventDefault();
        hideContextMenu();

        const rect = event.currentTarget.getBoundingClientRect();
        setCurrentNodePosition({
            top: rect.top,
            left: rect.left
        });

        const menu: any = document.getElementById('feature-context-menu');
        menu.style.display = 'block';
        menu.style.left = (event.pageX + 20) + 'px';
        menu.style.top = (event.pageY + 10) + 'px';

        // 记录当前点击的 featureId
        setCurrentFeatureId(component.featureId);
        document.addEventListener('click', hideContextMenu); // 点击其他区域时隐藏菜单
    };

    const hideContextMenu = () => {
        const menu: any = document.getElementById('feature-context-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    };

    const handleMenuItemClick = (action: string) => {
        hideContextMenu();
        if (action === "特性追溯") {
            setTrackVisible(true);
        } else if (action === "特性详情") {
            if (currentFeatureId !== null) {
                fetchFeatureOverview();
            } else {
                message.error("无效的特性ID，请选择有效的特性！");
            }
        }
    };

    const fetchFeatureOverview = async () => {
        setLoading(true);
        getFeatureOverview({
            featureId: currentFeatureId
        }).then(data => {
            setTableData(data.detail); // 更新表格数据
            setFeatureOverviewModalVisible(true);  // 显示模态框
            setLoading(false);
        })
    };

    const handleCircleClick = async (type: string) => {

        // if (type === "代码贡献" || type === "提交贡献") {
        //     message.info("该功能未开放");
        //     return; // 直接返回，不执行后续逻辑
        // }

        const {repo, startVersion, endVersion} = versionInfo;

        // if(startVersion == endVersion && (type === "代码贡献" || type === "提交贡献")) {
        //     message.info("提交贡献功能不支持单版本查询");
        //     return;
        // }

        if (!startVersion || !endVersion || !repo) {
            message.warning("请先选择库、开始版本和结束版本");
            return;
        }

        const currentActiveType = Object.keys(circleActiveState).find((key) => circleActiveState[key]);
        const isActive = circleActiveState[type];

        try {
            const containerData = await getUniqueContainers(repo, startVersion, endVersion);
            const company = company1 && company2 ? `${company1},${company2}` : company1 || company2 || ''
            const param = {start_version: startVersion, end_version: endVersion, repo: versionInfo?.repo ?? '',company_list: isActive ? '' : company};
            const maintainerParam = {endVersion : endVersion, repoPath : repo};
            // 传公司值给父组件
            onCompanyChange(isActive ? '' : company)

            if (currentActiveType && currentActiveType !== type) {
                let backendData;

                if (currentActiveType === "特性贡献") {
                    backendData = await getAllBoxFeatureData(param);
                } else if (currentActiveType === "提交贡献") {
                    backendData = await getAllBoxCommitData(param);

                } else if (currentActiveType === "代码贡献") {
                    backendData = await getAllBoxCodeData(param);

                } else if(currentActiveType === "Maintainer贡献") {
                    backendData = await getBoxMaintainerData(maintainerParam);
                }

                matchAndPopulateNodes(containerData, backendData, false);
                // message.success(`${currentActiveType} 功能已成功触发，操作: 删除图片！`);
            }

            setCircleActiveState((prevState) => {
                const newState: Record<string, boolean> = {};
                Object.keys(prevState).forEach((key) => {
                    newState[key] = key === type ? !isActive : false;
                });
                return newState;
            });

            let backendData;

            if (type === "特性贡献") {
                backendData = await getAllBoxFeatureData(param);
            } else if (type === "提交贡献") {
                backendData = await getAllBoxCommitData(param);
            } else if (type === "代码贡献") {
                backendData = await getAllBoxCodeData(param);

            } else if(type === "Maintainer贡献") {
                backendData = await getBoxMaintainerData(maintainerParam);

            }

            matchAndPopulateNodes(containerData, backendData, !isActive);

            // message.success(`${type} 功能已成功触发，操作: ${isActive ? "删除图片" : "插入图片"}！`);
        } catch (error) {
            console.error(`${type} 时发生错误：`, error);
            message.error(`${type} 功能触发失败，请检查日志！`);
        }
    };

    const handleFeatureContributionClick = async () => {
        const {startVersion, endVersion} = versionInfo;

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
            console.log(response, '1111')
            const formattedData = processContributionData(response, "feature");
            setTableData(formattedData);
        } catch (error) {
            console.error("获取特性贡献数据失败:", error);
        } finally {
            setLoading(false);
            setIsModalVisible(true);
        }
    };

    // 点击“特性个数”列获取公司特性数据
    const handleFeatureCountClick = async (company: string, originalCompany: string) => {
        const {startVersion, endVersion} = versionInfo;
        console.log(company, originalCompany, startVersion, endVersion, "特性贡献详情");

        if (!startVersion || !endVersion) {
            message.warning("请先选择开始版本和结束版本");
            return;
        }

        setLoading(true);
        try {
            const response = await getCompanyFeatureDataByVersionAndCompany({
                    start_version: startVersion,
                    end_version: endVersion,
                    company_name: originalCompany
                }

            );
            console.log(response, "特性贡献详情");
            const formattedData = response.map((item: any, index: number) => ({
                key: index,
                feature: item.text,
                version: item.version,
                h1: item.h1,
                commit: item.commit_id,
                commitTime: dayjs(item.commit_time).format("YYYY-MM-DD HH:mm:ss"), // 自定义格式
            }));
            setTableData(formattedData);
            // 设置模态框配置
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
                        width: 250,
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

    const featureColumns: TableColumnType[] = [
        {
            title: "公司",
            dataIndex: "company",
            key: "company",
            width: 250, // 固定列宽
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
            width: 250,
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
        },
    ];

    const featureOverviewColumns: TableColumnType[] = [
        {
            title: "commitId",
            dataIndex: "commitId",  // 确保字段名与数据匹配
            key: "commitId",
            align: 'center',
            render: (commitId) => (
                <a
                    href={`https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=${commitId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {commitId}
                </a>
            ),
        },
        {
            title: "作者邮箱",
            dataIndex: "authorName",
            key: "authorName",
            align: 'center'
        },
        {
            title: "新增行",
            dataIndex: "added",
            key: "added",
            align: 'center'
        },
        {
            title: "删除行",
            dataIndex: "deleted",
            key: "deleted",
            align: 'center'
        },
        {
            title: "提交时间",
            dataIndex: "commitTime",
            key: "commitTime",
            align: 'center'
        },
        {
            title: "提交信息",
            dataIndex: "commitTitle",
            key: "commitTitle",
            align: 'center'
        },
    ];

    const handleCommitContributionClick = async () => {
        const {startVersion, endVersion} = versionInfo;

        if (!startVersion || !endVersion) {
            message.warning("请先选择开始版本和结束版本");
            return;
        }

        setLoading(true);
        try {
            const response = await getCompanyCommitContribution({
                start_version: startVersion,
                end_version: endVersion,
                repo: versionInfo?.repo ?? ''
            });
            console.log(response, "提交贡献数据");
            const formattedData = processContributionData(response, "commit");
            setTableData(formattedData);
        } catch (error) {
            console.error("获取提交贡献数据失败:", error);
        } finally {
            setLoading(false);
            setIsModalVisible(true);
        }
    };

    // 点击“提交个数”列获取公司提交数据
    const handleCommitCountClick = async (company: string, originalCompany: string) => {
        const {startVersion, endVersion} = versionInfo;
        console.log(company, originalCompany, startVersion, endVersion, "提交贡献详情");
        if (!startVersion || !endVersion) {
            message.warning("请先选择开始版本和结束版本");
            return;
        }
        setLoading(true);
        try {
            const response = await getCompanyCommitDataByVersionAndCompany({
                start_version: startVersion,
                end_version: endVersion,
                repo: versionInfo?.repo ?? '',
                company_name: originalCompany
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
        },
    ];

    const handleCodeContributionClick = async () => {
        const {startVersion, endVersion} = versionInfo;

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
                repo: versionInfo?.repo ?? ''
            });
            console.log(response, "代码贡献数据");
            // 格式化数据
            const formattedData = processContributionData(response, "code");
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

    const handleMaintainerContributionClick = async () => {
        const {startVersion, endVersion} = versionInfo;

        if (!startVersion || !endVersion) {
            message.warning("请先选择开始版本和结束版本");
            return;
        }

        setLoading(true);
        try {
            const response = await getMAINTAINERSList({
                endVersion: endVersion,
                repoPath: versionInfo?.repo ?? ''
            });
            console.log(response, "maintainer贡献数据");
            // 格式化数据
            const formattedData = processContributionData(response, "maintainer");
            // 更新表格数据
            setTableData(formattedData);
        } catch (error) {
            console.error("获取maintainer贡献数据失败:", error);
        } finally {
            setLoading(false);
            setIsModalVisible(true); // 显示模态框
        }
    };

    // maintainer贡献数据表格的列配置
    const maintainerColumns: TableColumnType[] = [
        {
            title: "版本名",
            dataIndex: "version",
            key: "version",
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
            title: "公司名",
            dataIndex: "company",
            key: "company",
            width: 150,
            align: "center",
        },
        {
            title: "文件名",
            dataIndex: "filePath",
            key: "filePath",
            width: 150,
            align: "center",
        },
        {
            title: "对应知识节点",
            dataIndex: "nameEn",
            key: "nameEn",
            width: 150,
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value: inputValue} = e.target;
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
                                options={repoList.map((v) => ({value: v, label: v}))}
                            />
                        </Form.Item>
                        {/* 版本选择表单 */}
                        <Form.Item label="开始版本" className={styles.versionItem}>
                            <Select
                                placeholder="请选择"
                                value={versionInfo?.startVersion}
                                onChange={(v) => setVersionInfo((prev) => ({...prev!, startVersion: v}))}
                                allowClear
                                options={versionList.map((v) => ({value: v, label: v}))}
                            />
                        </Form.Item>
                        <Form.Item label="结束版本" className={styles.versionItem}>
                            <Select
                                placeholder="请选择"
                                value={versionInfo?.endVersion}
                                onChange={(v) => setVersionInfo((prev) => ({...prev!, endVersion: v}))}
                                allowClear
                                options={versionList.map((v) => ({value: v, label: v}))}
                            />
                        </Form.Item>
                        <Form.Item className={styles.versionItem}>
                            <Button
                                type="primary"
                                onClick={handleVersionClick}
                            >
                                确认
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key:"version-overview",
            label:"版本概要",
            children: (
                <>
                    <div>
                        <div style={{ width: '100%' }}>
                            <div>特性数量：{overviewData?.featureCount || 0}</div>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div>提交数量：{overviewData?.commitCount || 0}</div>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div>公司数量：{overviewData?.companyCount || 0}</div>
                        </div>
                    </div>
                </>
            )
        },
        {
            key: "container-list",
            label: `特性列表 (${containers?.length || 0})`,
            children: (
                <>
                    <Input
                        placeholder="搜索特性"
                        style={{marginBottom: '10px'}}
                        prefix={<SearchOutlined/>}
                        onChange={handleInputChange}
                    />
                    <div className={styles.containerList}>
                        {containers && containers.length === 0 ? (
                            <Empty/>
                        ) : (
                            containers?.filter((item) => item.text.includes(searchInput)).map((item, index) => (
                                <Tooltip title={item.text} placement="right" key={index}>
                                    <div
                                        className={`${styles.listItem} ${
                                            selected?.includes(item.text) ? "feature-selected" : ""
                                        }`}
                                        onClick={(e) => handleClick(item, e)}
                                        onContextMenu={(e) => handleRightClick(item, e)} // 修改为右键点击事件
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
                <>
                    <div>
                        <div style={{width: '100%'}}>
                        <div>组织1：</div>
                            <Select
                                placeholder="请选择"
                                value={company1}
                                onChange={(v) => {
                                    setCompany1(v)
                                }}
                                allowClear
                                style={{width: '100%', marginTop: '10px', marginBottom: '10px'}}
                                options={companyList.map((v) => ({value: v, label: v}))}
                            />
                        </div>
                        <div style={{width: '100%'}}>
                            <div>组织2：</div>
                            <Select
                                placeholder="请选择"
                                value={company2}
                                onChange={(v) => {
                                    setCompany2(v)
                                }}
                                allowClear
                                style={{width: '100%', marginTop: '10px'}}
                                options={companyList.map((v) => ({value: v, label: v}))}
                            />
                        </div>
                    </div>
                    <div className={styles.contributionSection}>
                        {["特性贡献", "提交贡献", "代码贡献", "Maintainer贡献"].map((label, index) => (
                            <div className={styles.contributionItem} key={index}>
                                <div
                                    className={`${styles.contributionCircle} ${
                                        (circleActiveState && circleActiveState[label]) ? styles.contributionCircleActive : ""
                                    }`}
                                    onClick={() => handleCircleClick(label)}
                                ></div>
                                <span className={styles.contributionLabel}>{label}</span>
                                {(
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
                                            } else if(label === "Maintainer贡献") {
                                                handleMaintainerContributionClick();
                                                setModalConfig({
                                                    title: "不同公司在Maintainer方面的贡献",
                                                    columns: maintainerColumns,
                                                    dataType: "maintainer",
                                                });
                                            }
                                        }}
                                        style={{ cursor: 'pointer' }} // 统一设置为 pointer 样式

                                    />
                                )}
                            </div>
                        ))}
                        <Modal
                            title={<div className={"modalTitle"}>{modalConfig.title}</div>}
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
                                scroll={{x: 500}} // 强制表格横向滚动，宽度稳定
                            />
                            <div style={{marginTop: 16, color: "gray", fontSize: 12}}>
                                {modalConfig.dataType != "maintainer" && (
                                    <p>粗线：界定明确的组织和其他组织</p>
                                )}
                                {modalConfig.dataType === "feature" && (
                                    <p>备注：同一特性之间可能会有多个公司参与贡献，故占比总和超过100%。</p>
                                )}
                            </div>
                        </Modal>
                    </div>
                </>
            ),
        }
    ];

    return (
        <>
            <div id="feature-context-menu">
                <ul>
                    <li onClick={() => handleMenuItemClick("特性详情")}>特性详情</li>
                    <li onClick={() => handleMenuItemClick("特性追溯")}>特性追溯</li>
                </ul>
            </div>
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
                    open={isTrackVisible}
                    zIndex={9999}
                    width={1200}
                    onCancel={() => {
                        setTrackVisible(false);
                    }}
                >
                    {isTrackVisible && (
                        <TrackModal
                            featureId={currentFeatureId ?? 0}
                            version={
                                containers?.find((c) => c.featureId === currentFeatureId)?.version ?? "unknown"
                            }
                            repo={versionInfo?.repo ?? "unknown"}
                        />
                    )}
                </Modal>
            </div>
            <Modal
                title={<div className={"modalTitle"}>特性详情</div>}
                open={isFeatureOverviewVisible}
                onCancel={() => setFeatureOverviewModalVisible(false)}
                width={1600}
                zIndex={9999}
                maskClosable={true}
            >
                <Spin spinning={loading}>
                    <Table
                        dataSource={tableData}
                        columns={featureOverviewColumns}
                        pagination={{
                            pageSize: 10,
                            showQuickJumper: true,
                            showSizeChanger: false,
                        }}
                        rowClassName={(record) => (record.isBold ? `${styles.boldRow}` : '')}
                        className={styles.table}
                        scroll={{ x: 800 }}
                        rowKey={(record) => record.commitId}  // 添加唯一的 rowKey
                    />
                </Spin>
            </Modal>
        </>
    );
};

export default ContainerList;