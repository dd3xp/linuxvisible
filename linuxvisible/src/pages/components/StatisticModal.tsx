import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Select } from 'antd';
import { get } from "../utils/request";
import { baseUrl } from "../utils/urlConfig";
import { createHandleCatched, createHandleResponse } from "../utils/response";
import { stringify } from "querystring";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend} from "recharts";

interface ContainerInfo {
    initialCompany: string;
    mostFeatureCodeCompany: string;
    mostCommitCompany: string;
    mostLayerCodeCompany: string;
    mostExistCompany: string;
    maintainerCompany: string;
}

interface StatisticModalProps {
    containerName: string | null;
    eid: number | null;
    repo?: string;
    startVersion?: string;
    endVersion?: string;
}

// API 函数定义
// 统计部分
// 获得文件列表
function getCommitFileList(data: {
    kgId: number;
    startVersion?: string;
    endVersion?: string;
}) {
    const url = `${baseUrl}/territory/getFileList`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 根据版本号获得commit号
function findCommitByVersionList(data: {
    versionList: string[];
    repoPath: string;
}) {
    const url = `${baseUrl}/territory/findCommitByVersionList`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 留存代码最多的公司
function findMaxRetainCodeCompany(data: {
    repoPath: string;
    filePath: string;
    endVersion?: string;
}) {
    const url = `${baseUrl}/territory/findMaxRetainCodeCompany`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 最初的公司
function findOriginMessage(data: {
        repoPath: string;
        filePath: string;
}) {
    const url = `${baseUrl}/territory/findOriginMessage`;
    return get(`${url}?${stringify(data)}`)
    .then(createHandleResponse(url))
    .catch(createHandleCatched(url));
}

// 最多特性的公司
function findMaxFeatureCompany(data: {
    filePath: string;
    startVersion?: string;
    endVersion?: string;
}) {
    const url = `${baseUrl}/territory/findMaxFeature`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 最多提交的公司
function findMaxCommitCompany(data: {
    repoPath: string;
    filePath: string;
    startVersion?: string;
    endVersion?: string;
}) {
    const url = `${baseUrl}/territory/findMaxCommit`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 最多代码增减的公司
function findMaxAddAndDelCompany(data: {
    repoPath: string;
    filePath: string;
    startVersion?: string;
    endVersion?: string;
}) {
    const url = `${baseUrl}/territory/findMaxAddAndDel`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 获取MAINTAINERS信息
function getMaintainers(data: {
    fileList: string[];
    endVersion?: string;
    repoPath: string;
}) {
    const url = `${baseUrl}/territory/getMAINTAINERS`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}

// 柱状图部分-----------------------------------------------------------------------------------
function view_file_history(data:{
    repoPath: string;
    filePath: string;
   // VersionList:string[];
    type: string;
}){
    const url = `${baseUrl}/territory/viewFileHistory`;
    return get(`${url}?${stringify(data)}`)
        .then(createHandleResponse(url))
        .catch(createHandleCatched(url));
}
//-----------------------------------------------------------------------------------------------

const StatisticModal: React.FC<StatisticModalProps> = ({ 
    containerName,
    eid,
    repo,
    startVersion,
    endVersion
    }) => {
    const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);
    const [selectedType, setSelectedType] = useState<string>('');
    const [typeOptions, setTypeOptions] = useState<{ value: string; label: string; }[]>([]);
    const [loading, setLoading] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [companySortWithRetainCodeLines, setCompanySortWithRetainCodeLines] = useState<{ [key: string]: any }[]>([]);
    const [companyLists, setCompanyLists] = useState<string[]>([]);
    // 组件初始化或重新打开时重置状态
    useEffect(() => {
        setSelectedType('');
        setShowContent(false);
        setContainerInfo(null);
        // 只有在有 eid 的时候才获取文件列表
        if (eid) {
            fetchFileList();
        }
    }, [eid]);

    const getCompanyLogo = (companyName: string) => {
        if (!companyName) return '/CompanyLogoAsset/Unknown.png';
        
        const name = companyName.toLowerCase();
        const companyMap: { [key: string]: string } = {
            'intel.com': 'intel.png',
            'arm.com': 'arm.png',
            'bytedance.com': 'bytedance.png',
            'google.com': 'google.png',
            'hisilicon.com': 'hisilicon.png',
            'huawei.com': 'huawei.png',
            'ibm.com': 'ibm.png',
            'linux.org': 'linux.png',
            'oppo.com': 'oppo.png',
            'oracle.com': 'oracle.png',
            'redhat.com': 'redhat.png',
            'yandex.ru': 'yandex.png',
            'zte.com.cn': 'zte.png'
        };

        return `/CompanyLogoAsset/${companyMap[name] || 'Unknown.png'}`;
    };

    // 获取文件列表
    const fetchFileList = async () => {
        if (!eid) {
            console.warn('未找到eid');
            return;
        }
        
        try {
            setLoading(true);
            const response = await getCommitFileList({
                kgId: eid,
                startVersion,
                endVersion
            });
            
            const options = response.map((item: string) => ({
                value: item,
                label: item
            }));
            setTypeOptions(options);
        } catch (error) {
            console.error('Error fetching file list:', error);
        } finally {
            setLoading(false);
        }
    };

    // 当版本改变时更新文件列表
    useEffect(() => {
        if (eid) {
            fetchFileList();
        }
    }, [startVersion, endVersion]);

    // 选择不同的文件时
    const handleTypeChange = async (value: string) => {
        setSelectedType(value);
        if (value) {
            setLoading(true);
            try {
                // 统计部分
                // 默认使用linux-stable仓库
                const repoPath = repo || 'linux-stable';
                const type = "4";
                // 获取版本对应的 commit
                // 开始版本
                const startCommits = await findCommitByVersionList({
                    versionList: [startVersion!],
                    repoPath
                });
                // 结束版本
                const endCommits = await findCommitByVersionList({
                    versionList: [endVersion!],
                    repoPath
                });
                if (!endCommits || endCommits.length === 0) {
                    throw new Error('未找到对应的commit');
                }

                // 获取留存代码最多的公司
                const maxRetainCompany = await findMaxRetainCodeCompany({
                    repoPath,
                    filePath: value,
                    endVersion  // 使用第一个找到的commit
                });

                // 最初的公司
                const originMessage = await findOriginMessage({
                    repoPath,
                    filePath: value
                });

                // 最多特性的公司
                const maxFeature = await findMaxFeatureCompany({
                    filePath: value,
                    startVersion,
                    endVersion
                });

                // 最多提交的公司
                const maxCommit = await findMaxCommitCompany({
                    repoPath,
                    filePath: value,
                    startVersion,
                    endVersion
                });

                // 获取最多代码增减的公司
                const maxAddAndDel = await findMaxAddAndDelCompany({
                    repoPath,
                    filePath: value,
                    startVersion,
                    endVersion
                });

                // 获取maintainer
                const maintainers = await getMaintainers({
                    fileList: typeOptions.map(option => option.value),
                    endVersion,
                    repoPath
                });
                //按照留存代码排序
                const versionList = ["v2.6.12","v3.0","v4.0","v5.0","v6.0","v6.6"];
                const companySortData = await view_file_history({
                    repoPath,
                    filePath: value,
                    type
                });
                console.log(companySortData);
                const dictionary_array: { [key: string]: any }[] = [];
                versionList.forEach((version) => {
                    dictionary_array.push({ version }); // 直接添加对象到一维数组
                });
                if (Array.isArray(companySortData)) {
                    console.log("companySortData 是一个数组");
                }
                const companyList = [
                    ...new Set(
                        (companySortData as { company: string }[]) // 强制声明类型
                            .filter(item => item !== null && item.company)
                            .map(item => item.company)
                    )
                ];
                console.log(companyList);
                dictionary_array.forEach((item) => {
                    companyList.forEach((company) => {
                        item[company] = 0;
                    });
                });
                console.log("start to get dictionary_array");
                console.log(dictionary_array);
                console.log("start to match the graph data");
                (companySortData as any[]).forEach((companyItem) => {
                    dictionary_array.forEach((dictItem) => {
                        if (dictItem.version === companyItem.version) {
                            console.log("version",dictItem.version,companyItem.version); 
                            dictItem[companyItem.company] = companyItem.retainCodeLines;
                            //console.log(companyItem.company,companyItem.retainCodeLines);
                            //console.log(dictItem);
                        }
                    });
                });

                console.log(dictionary_array);
                setCompanySortWithRetainCodeLines(dictionary_array);
                setCompanyLists(companyList)
                setShowContent(true);
                setContainerInfo({
                    initialCompany: originMessage?.originCompanyName || '未知公司',
                    mostFeatureCodeCompany: maxFeature.data ?? '暂无公司提供特性',
                    mostCommitCompany: maxCommit.data ?? '暂无公司提交代码',
                    mostLayerCodeCompany: maxAddAndDel.data ?? '暂无公司增减代码',
                    mostExistCompany: maxRetainCompany ?? '暂无公司留存代码',
                    maintainerCompany: (maintainers.data?.additionalProp1?.[0] || 
                        maintainers.data?.additionalProp2?.[0] || 
                        maintainers.data?.additionalProp3?.[0]) ?? '暂无维护者'
                    });
                    //barchart_data_retainCodeLines:company_sort_with_retainCodeLines.data
                } catch (error) {
                    console.error('公司获取错误：', error);
                    setShowContent(false);
                    setContainerInfo(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setShowContent(false);
                setContainerInfo(null);
            }
    };

    const logoStyle = {
        width: '50px',
        height: '50px',
        marginLeft: '8px',
        verticalAlign: 'middle',
        objectFit: 'contain' as const
    };

    return (
        <>
        <Card 
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Select
                        value={selectedType}
                        onChange={handleTypeChange}
                        style={{ width: 200 }}
                        options={typeOptions}
                        loading={loading}
                        placeholder="请选择文件"
                        allowClear
                    />
                </div>
            }
            style={{ width: '100%' }}
            styles={{ header: { background: '#f5f5f5', padding: '12px' } }}
        >
            {showContent && containerInfo && (
                <Row gutter={20}>
                    <Col span={12}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <span style={{ color: '#666', marginRight: '8px' }}>最初提交的公司/组织:</span>
                                <span>
                                    {containerInfo.initialCompany}
                                    <img 
                                        src={getCompanyLogo(containerInfo.initialCompany)}
                                        alt={containerInfo.initialCompany}
                                        style={logoStyle}
                                    />
                                </span>
                            </div>
                            <div>
                                <span style={{ color: '#666', marginRight: '8px' }}>最多特性的公司/组织:</span>
                                <span>
                                    {containerInfo.mostFeatureCodeCompany}
                                    <img 
                                        src={getCompanyLogo(containerInfo.mostFeatureCodeCompany)}
                                        alt={containerInfo.mostFeatureCodeCompany}
                                        style={logoStyle}
                                    />
                                </span>
                            </div>
                            <div>
                                <span style={{ color: '#666', marginRight: '8px' }}>最多提交的公司/组织:</span>
                                <span>
                                    {containerInfo.mostCommitCompany}
                                    <img 
                                        src={getCompanyLogo(containerInfo.mostCommitCompany)}
                                        alt={containerInfo.mostCommitCompany}
                                        style={logoStyle}
                                    />
                                </span>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <span style={{ color: '#666', marginRight: '8px' }}>最多增减代码的公司/组织:</span>
                                <span>
                                    {containerInfo.mostLayerCodeCompany}
                                    <img 
                                        src={getCompanyLogo(containerInfo.mostLayerCodeCompany)}
                                        alt={containerInfo.mostLayerCodeCompany}
                                        style={logoStyle}
                                    />
                                </span>
                            </div>
                            <div>
                                <span style={{ color: '#666', marginRight: '8px' }}>最多留存代码的公司/组织:</span>
                                <span>
                                    {containerInfo.mostExistCompany}
                                    <img 
                                        src={getCompanyLogo(containerInfo.mostExistCompany)}
                                        alt={containerInfo.mostExistCompany}
                                        style={logoStyle}
                                    />
                                </span>
                            </div>
                            <div>
                                <span style={{ color: '#666', marginRight: '8px' }}>MAINTAINERS公司/组织:</span>
                                <span>
                                    {containerInfo.maintainerCompany}
                                    <img 
                                        src={getCompanyLogo(containerInfo.maintainerCompany)}
                                        alt={containerInfo.maintainerCompany}
                                        style={logoStyle}
                                    />
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </Card>
        {showContent && containerInfo && (
            <Card
                style={{ width: '100%', marginTop:'5px' }}
            >
                <div>柱状图</div>
                <BarChart
                    width={700}
                    height={500}
                    data={companySortWithRetainCodeLines}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="version" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* 每个公司用不同的 Bar */}
                    <Bar dataKey={companyLists[0]} fill="#8884d8" />
                    <Bar dataKey={companyLists[1]} fill="#82ca9d" />
                    <Bar dataKey={companyLists[2]} fill="#ffc658" />
                    <Bar dataKey={companyLists[3]} fill="#d84f4f" />
                    <Bar dataKey={companyLists[4]} fill="#4fd8d8" />
                </BarChart>
            </Card>
        )}
        </>
    );
};

export default StatisticModal;