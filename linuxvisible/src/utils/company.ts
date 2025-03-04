import { EntityNode } from "./API";

// // 动态匹配 container.json 和后端数据
// export const matchAndPopulateNodes = (containerData: EntityNode[], backendData: any, isActive: boolean) => {
//     const containerMap = buildContainerMap(containerData);
//     console.log('容器映射表:', containerMap);
//
//     Object.keys(backendData).forEach((eidName) => {
//         const entityNode = containerData.find((item)=>item.nameEn===eidName)
//         const node = entityNode?.eid ? containerMap[entityNode?.eid] : undefined;
//         if (node) {
//             const companyContributions = backendData[eidName];
//             toggleNodeImages(node, companyContributions, isActive);
//         } else {
//             console.warn(`未找到匹配的节点框: ${eidName}`);
//         }
//     });
// };
//
// // 构建容器节点的映射表
// const buildContainerMap = (containerData: EntityNode[]) => {
//     const map: { [key: number]: any } = {};
//
//     containerData.forEach((item) => {
//         if (item.level >= 1) {
//             const containerNode = {
//                 eid: item.eid,
//                 title: item.nameEn,
//                 level : item.level,
//                 coordinates: { x1:item.x1, y1:item.y1, x2:item.x2, y2: item.y2 },
//                 belong_to: item.belongTo
//             };
//
//             if (!map[item.eid]) {
//                 map[item.eid] = containerNode;
//             }else{// 防止先遍历到叶节点
//                 map[item.eid] = {
//                     ...map[item.eid],
//                     title: item.nameEn,
//                     level : item.level,
//                     coordinates: { x1:item.x1, y1:item.y1, x2:item.x2, y2: item.y2 },
//                     belong_to: item.belongTo
//                 }
//             }
//
//             if (item.belongTo != -1) {
//                 if (map[item.belongTo]) {
//                     map[item.belongTo].children = map[item.belongTo].children || [];
//                     map[item.belongTo].children.push(containerNode);
//                 } else {
//                     map[item.belongTo] = { eid: item.belongTo, children: [containerNode] };
//                 }
//             }
//         }
//     });
//
//     return map;
// };
//
// // 切换节点图片的逻辑（插入或删除）
// const toggleNodeImages = (node: any, companyContributions: any, isActive: boolean) => {
//     const nodeElement = Array.from(document.querySelectorAll('#__next > div > div.overlay-container > div.linux > div'))
//         .find(div => div.querySelector('.level-3-title')?.textContent?.trim() === node.title);
//
//     if (!nodeElement) {
//         console.warn(`找不到节点框：${node.title}`);
//         return;
//     }
//
//     if (isActive) {
//         console.log(`为节点框 ${node.title} 插入图片`);
//         populateNodeWithImages(nodeElement, companyContributions);
//     } else {
//         console.log(`删除节点框 ${node.title} 中的图片`);
//         removeNodeImages(nodeElement);
//     }
// };

// 动态匹配 container.json 和后端数据
export const matchAndPopulateNodes = (containerData: EntityNode[], backendData: any, isActive: boolean) => {
    // 如果 backendData 为 null 或 undefined，赋值为默认空对象
    const safeBackendData = backendData || {};

    const containerMap = buildContainerMap(containerData);
    console.log('容器映射表:', containerMap);

    // 确保 backendData 为有效对象后再使用 Object.keys
    if (safeBackendData && typeof safeBackendData === 'object') {
        Object.keys(safeBackendData).forEach((eidName) => {
            const eid = parseInt(eidName, 10); // 将 eidName 转换为整数
            const entityNode = containerData.find((item) => item.eid === eid);
            const node = entityNode?.eid ? containerMap[entityNode?.eid] : undefined;

            if (node) {
                const companyContributions = safeBackendData[eidName];
                toggleNodeImages(node, companyContributions, isActive);
            } else {
                console.warn(`未找到匹配的节点框: ${eid}`);
            }
        });
    } else {
        console.warn('backendData 为空或无效');
    }
};

// 构建容器节点的映射表
const buildContainerMap = (containerData: EntityNode[]) => {
    const map: { [key: number]: any } = {};

    containerData.forEach((item) => {
        if (item.level >= 1) {
            const containerNode = {
                eid: item.eid,
                title: item.nameEn,
                level: item.level,
                coordinates: { x1: item.x1, y1: item.y1, x2: item.x2, y2: item.y2 },
                belong_to: item.belongTo
            };

            if (!map[item.eid]) {
                map[item.eid] = containerNode;
            } else { // 防止先遍历到叶节点
                map[item.eid] = {
                    ...map[item.eid],
                    title: item.nameEn,
                    level: item.level,
                    coordinates: { x1: item.x1, y1: item.y1, x2: item.x2, y2: item.y2 },
                    belong_to: item.belongTo
                };
            }

            if (item.belongTo !== -1) {
                if (map[item.belongTo]) {
                    map[item.belongTo].children = map[item.belongTo].children || [];
                    map[item.belongTo].children.push(containerNode);
                } else {
                    map[item.belongTo] = { eid: item.belongTo, children: [containerNode] };
                }
            }
        }
    });

    return map;
};

// 切换节点图片的逻辑（插入或删除）
const toggleNodeImages = (node: any, companyContributions: any, isActive: boolean) => {
    const nodeElement = Array.from(document.querySelectorAll('#__next > div > div.overlay-container > div.linux > div'))
        .find(div => div.querySelector('.level-3-title')?.textContent?.trim() === node.title);

    if (!nodeElement) {
        console.warn(`找不到节点框：${node.title}`);
        return;
    }

    if (isActive) {
        console.log(`为节点框 ${node.title} 插入图片`);
        populateNodeWithImages(nodeElement, companyContributions);
    } else {
        console.log(`删除节点框 ${node.title} 中的图片`);
        removeNodeImages(nodeElement);
    }
};


// 插入图片的逻辑
const populateNodeWithImages = (nodeElement: Element, companyContributions: any) => {
    const nodeStyles = window.getComputedStyle(nodeElement);
    const nodeWidth = parseFloat(nodeStyles.width);
    const nodeHeight = parseFloat(nodeStyles.height);

    const imgWidth = Math.min(20, nodeWidth * 0.2);
    const imgHeight = imgWidth;

    // 直接使用前5名公司（假设后端已按顺序返回前5名）
    const imgContainer = document.createElement('div')
    Object.entries(companyContributions).slice(0, 5).forEach(([company, contributions]) => {
        const imgPath = getImagePath(company);
        const imgElement = document.createElement('img');
        imgElement.src = imgPath;
        imgElement.alt = company;
        imgElement.className = 'company-logo';

        imgElement.style.width = `${imgWidth}px`;
        imgElement.style.height = `${imgHeight}px`;

        // 添加提示信息，显示公司名称和贡献数
        imgElement.title = `${company}: ${contributions}`;

        imgContainer.appendChild(imgElement);
    });
    nodeElement.appendChild(imgContainer)

    nodeElement.setAttribute('data-inserted', 'true');
};

// 删除图片的逻辑（优化版）
const removeNodeImages = (nodeElement: Element) => {
    if (nodeElement.getAttribute('data-inserted') === 'true') {
        // 清除特定的 .company-logo 元素
        const images = nodeElement.querySelectorAll('.company-logo');
        if (images.length) {
            const fragment = document.createDocumentFragment();
            images.forEach((img) => fragment.appendChild(img));
            fragment.textContent = ''; // 清空内容
        }
        nodeElement.removeAttribute('data-inserted');
    }
};

// 生成图片路径
const getImagePath = (company: string) => {
    const basePath = '/CompanyLogoAsset/';
    const prioritizedCompanies = [
        'arm', 'bytedance', 'google', 'huawei', 'intel', 'redhat', 'yandex','ibm','zte','oppo','oracle','hisilicon','suse','chromium','tencent','ubuntu','nvidia','microsoft','amazon'
    ];

    for (const prioritizedCompany of prioritizedCompanies) {
        if (company.toLowerCase().includes(prioritizedCompany.toLowerCase())) {
            return `${basePath}${prioritizedCompany}.png`;
        }
    }

    if (company.toLowerCase().includes('linux')) {
        return `${basePath}linux.png`;
    }

    if (company.toLowerCase().includes('kernel')) {
        return `${basePath}linux.png`;
    }

    return `${basePath}Unknown.png`;
};

const companySet = new Set([
    "meta", "vivo", "us.ibm", "loongson", "efficios", "linutronix", "microsoft", "suse", "redhat",
    "alibaba", "bytedance", "oracle", "huawei", "samsung", "collabora", "nvidia", "mediatek", "intel",
    "amd", "tencent", "arm", "broadcom", "xilinx", "marvell", "google", "amazon", "ibm", "oppo",
    "siemens", "hp", "micron", "fairphone", "vmware", "linux.alibaba", "cyberus", "selenic", "osdl",
    "gnumonks", "austin.rr", "freescale", "jp.fujitsu", "qlogic", "pengutronix", "samba", "netfilter", "veritas", "unisys", "windriver", "dell", "emc", "mvista",
    "ubuntu", "ozlabs", "renesas", "sun", "ti", "tirol", "debian", "cisco", "hitachi", "seiko-epson",
    "atmel", "tsmc", "airbus", "tesla", "nokia", "philips", "armhf", "data61.csiro", "stmicroelectronics",
    "western-digital", "zte", "qualcomm", "linux.intel", "linux.ibm", "realtek", "armlinux.org",
    "linux.microsoft", "linux.vnet.ibm", "zte.com", "yandex", "hisilicon","suse.com","suse.cz","suse.de"
]);

// /**
//  * 处理特性贡献数据，标记需要加粗的行
//  * @param {Array} data 后端返回的特性贡献数据
//  * @returns {Array} 处理后的数据
//  */
// export const processFeatureContributionData = (data: any) => {
//     return data.map((item: any, index: number) => {
//         // 提取数字部分，将字符串的百分比（如 "6.66%"）转换为数字
//         const percentageValue = parseFloat(item.percentage.replace('%', ''));
//
//         // 判断是否需要加粗，当前行的特性贡献数大于前一行
//         const isBold = index > 0 && item.featureCount > data[index - 1].featureCount;
//
//         return {
//             key: index, // 唯一标识符
//             company: item.companyName, // 公司名称
//             featureCount: item.featureCount, // 特性贡献数量
//             percentage: `${percentageValue.toFixed(2)}%`, // 转换并格式化百分比
//             isBold, // 加粗标志
//         };
//     });
// };
//
// /**
//  * 处理提交贡献数据，标记需要加粗的行
//  * @param {Array} data 后端返回的特性贡献数据
//  * @returns {Array} 处理后的数据
//  */
// export const processCommitContributionData = (data: any) => {
//     return data.map((item: any, index: number) => {
//         // 提取数字部分，将字符串的百分比（如 "6.66%"）转换为数字
//         const percentageValue = parseFloat(item.percentage.replace('%', ''));
//
//         // 判断是否需要加粗，当前行的特性贡献数大于前一行
//         const isBold = index > 0 && item.commitCount > data[index - 1].commitCount;
//
//         return {
//             key: index, // 唯一标识符
//             company: item.companyName, // 公司名称
//             commitCount: item.commitCount, // 特性贡献数量
//             percentage: `${percentageValue.toFixed(2)}%`, // 转换并格式化百分比
//             isBold, // 加粗标志
//         };
//     });
// };
//
// /**
//  * 处理代码贡献数据，标记需要加粗的行
//  * @param {Array} data 后端返回的代码贡献数据
//  * @returns {Array} 处理后的数据
//  */
// export const processCodeContributionData = (data: any) => {
//     return data.map((item: any, index: number) => {
//         // 提取数字部分，将字符串的百分比（如 "6.66%"）转换为数字
//         const percentageValue = parseFloat(item.percentage.replace('%', ''));
//
//         // 判断是否需要加粗，当前行的 total 大于前一行的 total
//         const isBold = index > 0 && item.total > data[index - 1].total;
//
//         return {
//             key: index, // 唯一标识符
//             company: item.companyName, // 公司名称
//             added: item.added, // 新增行数
//             deleted: item.deleted, // 删除行数
//             total: item.total, // 总行数
//             percentage: `${percentageValue.toFixed(2)}%`, // 转换并格式化百分比
//             isBold, // 加粗标志
//         };
//     });
// };

export const processContributionData = (data: any[], dataType: "feature" | "commit" | "code" | "maintainer") => {
    let isBoldApplied = false; // 标记是否已加粗
    return data.map((item) => {
        const companyName = item.companyName.toLowerCase();
        let isBold = false;

        // 判断公司是否在集合中
        if (!companySet.has(companyName) && !isBoldApplied) {
            isBold = true;
            isBoldApplied = true; // 仅加粗第一个不在集合的公司
        }

        // 根据数据类型格式化数据
        switch (dataType) {
            case "feature":
                return {
                    company: item.companyName,
                    originalCompany: item.originalCompanyName,
                    featureCount: item.featureCount,
                    percentage: item.percentage,
                    isBold
                };
            case "commit":
                return {
                    company: item.companyName,
                    originalCompany: item.originalCompanyName,
                    commitCount: item.commitCount,
                    percentage: item.percentage,
                    isBold
                };
            case "code":
                return {
                    company: item.companyName,
                    added: item.added,
                    deleted: item.deleted,
                    total: item.total,
                    percentage: item.percentage,
                    isBold
                };
            case "maintainer":
                return {
                    company: item.companyName,
                    version: item.version,
                    filePath: item.filePath,
                    nameEn: item.nameEn,
                    isBold
                };
            default:
                throw new Error("Unsupported data type");
        }
    });
};
