import { EntityNode } from "./API";
import { getEntities } from "../services/entity";

// 动态加载多个版本的 container.json 文件并合并容器
export const getUniqueContainers = async (repo: string, version1: string, version2: string)=>{
    let uniqueContainers: EntityNode[] = [];

    uniqueContainers = await getEntities({
        repoPath: repo,
        startVersion: version1,
        endVersion: version2
    })

    console.log("获取的json内容：")
    console.log(uniqueContainers)
    return uniqueContainers;
}

// 暂时用来加载本地的json文件（位于public目录）
export const getLocalContainers = async (): Promise<EntityNode[]> => {
    try {
        const response = await fetch('/6.1.json');
        const rawData: any[][] = await response.json();

        console.log("从 6.1.json 读取的内容：", rawData);

        const filteredData = rawData.filter(item => Array.isArray(item) && item.length === 7);
        const formattedData: EntityNode[] = filteredData.map(item => ({
            eid: item[0],
            level: item[1],
            x1: item[2],
            y1: item[3],
            x2: item[4],
            y2: item[5],
            belongTo: item[6],
            nameEn: `Node-${item[0]}`
        }));

        console.log("格式化后的数据：", formattedData);
        return formattedData;
    } catch (error) {
        console.error("加载6.1.json失败:", error);
        return [];
    }
};

// 根据不同的level1获取不同的叶节点背景色
export const getLevel3Color = (level1_container: EntityNode|undefined)=>{
    if (level1_container !== undefined) {
        switch(level1_container.eid) {
            case 107: return '#b4c4ec';//kernel
            case 108: return '#cce4b4';//mm
            case 109: return '#f4b484';//fs
            case 110: return '#ec949c';//drivers
            case 111: return '#04b4f4';//arch
            case 112: return '#7cdcd3';//net
            case 113: return '#b4c4ec';//process
            default: return '#fff799';
        }
    }
    return '#fff799'// 默认颜色
}