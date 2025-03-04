import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Select, Empty, Spin } from 'antd';
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend} from "recharts";
import {findCommitByVersionList, findMaxAddAndDelCompany, findMaxCommitCompany, findMaxFeatureCompany, findMaxRetainCodeCompany, findOriginMessage, getCommitFileList, getMaintainers, view_file_history} from '../../services/statistic'
import { flushSync } from 'react-dom';
const { Option } = Select;

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
let selectedVersion = ["v2.6.12","v3.0","v4.0","v5.0","v6.0","v6.6"];
let versionList = ["v2.6.12","v3.0","v4.0","v5.0","v6.0","v6.6"];
const StatisticModal: React.FC<StatisticModalProps> = ({ 
    containerName,
    eid,
    repo,
    startVersion,
    endVersion
    }) => {
    const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [typeOptions, setTypeOptions] = useState<{ value: string; label: string; isGray: boolean; }[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingChart, setLoadingChart] = useState(false);// 柱状图loading
    const [showContent, setShowContent] = useState(false);
    const [companySortWithRetainCodeLines, setCompanySortWithRetainCodeLines] = useState<{ [key: string]: any }[]>([]);
    const [companyLists, setCompanyLists] = useState<string[]>([]);
    // 默认选择状态为 "按留存代码行数"
    const [selectedOption, setSelectedOption] = useState<string>("按留存代码行数");
    const [showVersionList,setshowVersionList] = useState<string[]>([]);
    let selectedfeatureId: number | null = null;
     // 版本号列表
    const versions = [
        "v6.12", "v6.11", "v6.10", "v6.9", "v6.8", "v6.7", "v6.6", "v6.5", "v6.4", "v6.3", "v6.2", "v6.1", "v6.0",
        "v5.19", "v5.18", "v5.17", "v5.16", "v5.15", "v5.14", "v5.13", "v5.12", "v5.11", "v5.10", "v5.9", "v5.8", "v5.7", "v5.6",
        "v5.5", "v5.4", "v5.3", "v5.2", "v5.1", "v5.0", "v4.20", "v4.19", "v4.18", "v4.17", "v4.16", "v4.15", "v4.14", "v4.13",
        "v4.12", "v4.11", "v4.10", "v4.9", "v4.8", "v4.7", "v4.6", "v4.5", "v4.4", "v4.3", "v4.2", "v4.1", "v4.0", "v3.19", "v3.18",
        "v3.17", "v3.16", "v3.15", "v3.14", "v3.13", "v3.12", "v3.11", "v3.10", "v3.9", "v3.8", "v3.7", "v3.6", "v3.5", "v3.4",
        "v3.3", "v3.2", "v3.1", "v3.0", "v2.6.39", "v2.6.38", "v2.6.37", "v2.6.36", "v2.6.35", "v2.6.34", "v2.6.33", "v2.6.32",
        "v2.6.31", "v2.6.30", "v2.6.29", "v2.6.28", "v2.6.27", "v2.6.26", "v2.6.25", "v2.6.24", "v2.6.23", "v2.6.22", "v2.6.21",
        "v2.6.20", "v2.6.19", "v2.6.18", "v2.6.17", "v2.6.16", "v2.6.15", "v2.6.14", "v2.6.13", "v2.6.12"
    ];
    // 转化为 versionOptions 数组
    const versionOptions = versions.map(version => ({
        value: version,
        label: version
    }));
    // 组件初始化或重新打开时重置状态
    useEffect(() => {
        setSelectedType(null);
        setShowContent(false);
        setContainerInfo(null);
        setSelectedOption("按留存代码行数");
        const savedValue = localStorage.getItem('selectedFeatureId');
        selectedfeatureId = savedValue !== null ? Number(savedValue) : null;
        selectedVersion = ["v2.6.12","v3.0","v4.0","v5.0","v6.0","v6.6"];
        versionList = ["v2.6.12","v3.0","v4.0","v5.0","v6.0","v6.6"];
        setshowVersionList(selectedVersion);
        console.log("now is useEffect!");
        // 只有在有 eid 的时候才获取文件列表
        if (eid) {
            fetchFileList();
        }
    }, [eid]);

    const getCompanyLogo = (companyName: String) => {
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
            let response;
            console.log("watch selectedfeatureId",selectedfeatureId);
            if(selectedfeatureId){
                response = await getCommitFileList({kgId: eid,startVersion,endVersion,featureId:selectedfeatureId});
            }
            else{
                response = await getCommitFileList({kgId: eid,startVersion,endVersion});
            }
            const response_temp = response.map((item: { filePath: string }) => item.filePath);
            let options = response_temp.map((item: string) => ({
                value: item,
                label: item,
                isGray: false
            }));
            if(selectedfeatureId||true){//保留后续修改的可能的写法
                for(let i = 0;i<options.length;i++){
                    for(let j = 0;j<response.length;j++){
                        if(options[i].value===response[j].filePath&&response[j].changeStatus===false){
                            options[i].isGray = true;
                        }
                    }
                }
            }
            options.sort((a: { value: string; label: string; isGray: boolean }, b: { value: string; label: string; isGray: boolean }) => {
                if (a.isGray === b.isGray) {
                  return 0; // 如果 isGray 相同，保持原顺序
                }
                return a.isGray ? 1 : -1; // isGray 为 true 的排后面
            });
            console.log("options now is ",options);
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
                let type = "4";
                // 获取版本对应的 commit
                // 开始版本
                const startCommitsPromise = findCommitByVersionList({
                    versionList: [startVersion!],
                    repoPath
                });
                // 结束版本
                const endCommitsPromise =  findCommitByVersionList({
                    versionList: [endVersion!],
                    repoPath
                });
                // 获取留存代码最多的公司
                const maxRetainCompanyPromise = findMaxRetainCodeCompany({
                    repoPath,
                    filePath: value,
                    endVersion  // 使用第一个找到的commit
                });

                // 最初的公司
                const originMessagePromise = findOriginMessage({
                    repoPath,
                    filePath: value
                });

                // 最多特性的公司
                const maxFeaturePromise = findMaxFeatureCompany({
                    filePath: value,
                    startVersion,
                    endVersion
                });
                // 最多提交的公司
                const maxCommitPromise = findMaxCommitCompany({
                    repoPath,
                    filePath: value,
                    startVersion,
                    endVersion
                });

                // 获取最多代码增减的公司
                const maxAddAndDelPromise = findMaxAddAndDelCompany({
                    repoPath,
                    filePath: value,
                    startVersion,
                    endVersion
                });

                // 获取maintainer
                const maintainersPromise =  getMaintainers({
                    fileList: typeOptions.map(option => option.value),
                    endVersion,
                    repoPath
                });
                const companySortDataPromise =  view_file_history({
                    repoPath,
                    filePath: value,
                    type
                });
                 // 等待所有 Promise 完成
                const [startCommits, endCommits, maxRetainCompany, originMessage, maxFeature, maxCommit, maxAddAndDel, maintainers,companySortData] = 
                await Promise.all([
                    startCommitsPromise,
                    endCommitsPromise,
                    maxRetainCompanyPromise,
                    originMessagePromise,
                    maxFeaturePromise,
                    maxCommitPromise,
                    maxAddAndDelPromise,
                    maintainersPromise,
                    companySortDataPromise
                ]);
                console.log("维护公司列表",maintainers)
                //按照留存代码排序
                if (!endCommits || endCommits.length === 0) {
                    throw new Error('未找到对应的commit');
                }
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
                        }
                    });
                });
                setCompanySortWithRetainCodeLines(dictionary_array);
                setCompanyLists(companyList)
                setShowContent(true);
                setContainerInfo({
                    initialCompany: originMessage?.originCompanyName || '未知公司',
                    mostFeatureCodeCompany: maxFeature ?? '暂无公司提供特性',
                    mostCommitCompany: maxCommit?? '暂无公司提交代码',
                    mostLayerCodeCompany: maxAddAndDel ?? '暂无公司增减代码',
                    mostExistCompany: maxRetainCompany ?? '暂无公司留存代码',
                    maintainerCompany:  maintainers[value]?.[0] ?? '暂无维护者'
                    });
                setSelectedOption("按留存代码行数");
                    //barchart_data_retainCodeLines:company_sort_with_retainCodeLines.data
                } catch (error) {
                    console.error('公司获取错误：', error);
                    setShowContent(false);
                    setContainerInfo(null);
                } finally {
                    setLoading(false);
                }
        }
    };

    const logoStyle = {
        width: '50px',
        height: '50px',
        marginLeft: '8px',
        verticalAlign: 'middle',
        objectFit: 'contain' as const
    };


    const options = [
        "按特性数",
        "按提交数",
        "按增减代码行数",
        "按留存代码行数"
    ];

    // 处理选择变化
    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value); // 更新状态
        setLoadingChart(true)
        console.log("选择了：", event.target.value); // 打印选择结果
        let type = "4";
        if(event.target.value === options[0]) type = "1";
        else if(event.target.value === options[1]) type = "5";
        else if(event.target.value === options[2]) type = "3";
        else if(event.target.value === options[3]) type = "4";
        const repoPath = repo || 'linux-stable';
        const companySortData = await view_file_history({
            repoPath,
            filePath: selectedType ?? '',
            versionList,
            type
        });
        console.log("在处理选择变化的时候的VersionList",versionList);
        const dictionary_array: { [key: string]: any }[] = [];
        versionList.forEach((version) => {
            dictionary_array.push({ version }); // 直接添加对象到一维数组
        });
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
        (companySortData as any[]).forEach((companyItem) => {
            dictionary_array.forEach((dictItem) => {
                if (dictItem.version === companyItem.version|| 
                    dictItem.version === companyItem.version.split('-')[1]) {
                    console.log("version",dictItem.version,companyItem.version); 
                    if(type==="4") dictItem[companyItem.company] = companyItem.retainCodeLines;
                    if(type==="3") dictItem[companyItem.company] = companyItem.totalLine;
                    if(type==="5") dictItem[companyItem.company] = companyItem.commitCount;
                    if(type==="1") dictItem[companyItem.company] = companyItem.featureCount;
                }
            });
        });
        setCompanySortWithRetainCodeLines(dictionary_array);
        setCompanyLists(companyList)
        setLoadingChart(false)
    };

    const handleSelectedVersionChange = async (values:string[]) => {
        setLoadingChart(true);
        const selectedVersion = values.sort((a, b) => {
            // 去除版本号前的 'v'
            const parseVersion = (value:string) => value.slice(1).split('.').map(Number); // 去除 'v' 后分解版本号
            const [majorA, minorA, patchA] = parseVersion(a); // 分解版本号为数组
            const [majorB, minorB, patchB] = parseVersion(b); // 分解版本号为数组
          
            // 先比较主版本号，再比较次版本号，最后比较补丁版本号
            return (
              majorA - majorB || // 主版本号排序
              minorA - minorB || // 次版本号排序
              (patchA || 0) - (patchB || 0) // 补丁版本号排序（无补丁时默认为 0）
            );
          });
        versionList = selectedVersion;
        setshowVersionList(selectedVersion);
        const repoPath = repo || 'linux-stable';
        let type = "4";
        if(selectedOption === options[0]) type = "1";
        else if(selectedOption === options[1]) type = "5";
        else if(selectedOption === options[2]) type = "3";
        else if(selectedOption === options[3]) type = "4";
        const companySortData = await view_file_history({
            repoPath,
            filePath: selectedType ?? '',
            versionList,
            type
        });
        const dictionary_array: { [key: string]: any }[] = [];
        versionList.forEach((version) => {
            dictionary_array.push({ version }); // 直接添加对象到一维数组
        });
        const companyList = [
            ...new Set(
                (companySortData as { company: string }[]) // 强制声明类型
                    .filter(item => item !== null && item.company)
                    .map(item => item.company)
            )
        ];
        dictionary_array.forEach((item) => {
            companyList.forEach((company) => {
                item[company] = 0;
            });
        });
        (companySortData as any[]).forEach((companyItem) => {
            dictionary_array.forEach((dictItem) => {
                if (dictItem.version === companyItem.version|| 
                    dictItem.version === companyItem.version.split('-')[1]) {
                    if(type==="4") dictItem[companyItem.company] = companyItem.retainCodeLines;
                    if(type==="3") dictItem[companyItem.company] = companyItem.totalLine;
                    if(type==="5") dictItem[companyItem.company] = companyItem.commitCount;
                    if(type==="1") dictItem[companyItem.company] = companyItem.featureCount;
                }
            });
        });
        setCompanySortWithRetainCodeLines(dictionary_array);
        setCompanyLists(companyList)
        setLoadingChart(false);
    }
    return (
        <>
        <Card 
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Select
                        value={selectedType}
                        onChange={handleTypeChange}
                        style={{ width: 200 }}
                        options={typeOptions.map(option => ({
                            value: option.value,
                            label: (
                              <span style={{ color: option.isGray ? 'gray' : 'inherit' }}>
                                {option.label}
                              </span>
                            ),
                          }))}
                        loading={loading}
                        placeholder="请选择文件"
                        allowClear
                    />
                </div>
            }
            style={{ width: '100%' }}
            styles={{ header: { background: '#f5f5f5', padding: '12px' } }}
        >
            <Spin spinning={loading}>
            {showContent && containerInfo ? (
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
            ) : <Empty/>}
            </Spin>
        </Card>
        {showContent && containerInfo && (
            <Card
                style={{ width: '100%', marginTop:'5px' }}
            >
                <div style={{
                    fontSize: "22px", // 字体加大
                    fontWeight: "bold", // 加粗
                    textAlign: "center", // 居中
                    textShadow: "2px 2px 3px rgba(0, 0, 0, 0.3)" // 立体效果（文字阴影）
                }}>
                    柱状图
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between", // 左右排列
                    alignItems: "center", // 垂直居中
                    width: "100%", // 撑满整个父容器
                    padding: "10px 40px" // 左右留出适当间距
                }}>
                    {/* 版本号选择（靠左，有一点间距） */}
                    <Select
                        mode="multiple"
                        style={{
                            width: "220px",
                            border: "2px solid #333", // 深色边框
                            borderRadius: "4px",
                            padding: "4px"
                        }}
                        placeholder="版本号选择"
                        value={showVersionList}
                        onChange={handleSelectedVersionChange}
                        //tagRender={() => <span />} // 隐藏已选标签
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <div style={{ padding: "4px", textAlign: "center", color: "#999" }}>
                                    已选择 {showVersionList.length} 个版本
                                </div>
                            </>
                        )}
                        optionLabelProp="label"
                    >
                        {versionOptions.map((option) => (
                            <Option key={option.value} value={option.value} label={option.label}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>

                    {/* 按留存代码行（靠右，有一点间距） */}
                    <select
                        value={selectedOption}
                        onChange={handleSelectChange}
                        style={{
                            width: "220px",
                            padding: "8px",
                            fontSize: "14px",
                            cursor: "pointer",
                            border: "2px solid #333", // 深色边框
                            borderRadius: "4px",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                            marginRight: "40px" 
                        }}
                    >
                        {options
                            .filter((option) => option !== "按留存代码行") // 过滤掉不需要的选项
                            .map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                    </select>
                </div>
                <Spin spinning={loadingChart}>
                <BarChart
                    width={850}
                    height={600}
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
                </Spin>
            </Card>
        )}
        </>
    );
};

export default StatisticModal;