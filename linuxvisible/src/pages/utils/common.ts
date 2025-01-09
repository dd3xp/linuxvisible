import { EntityNode } from "../api/API";
import { getEntities } from "../api/services/entity";

// 获取版本范围内的所有版本
export const getVersionsBetween = (version1: string, version2: string)=>{
    const versions = [];
    let currentVersion = parseFloat(version1.replace('v', ''));
    const end = parseFloat(version2.replace('v', ''));

    while (currentVersion <= end) {
        versions.push(`${currentVersion.toFixed(1)}`);
        currentVersion += 0.1;
    }

    return versions;
}

export const containArray = (parentArr: any[], arr: any[])=>{
    return parentArr.some(item => JSON.stringify(item) === JSON.stringify(arr));
}

// 动态加载多个版本的 container.json 文件并合并容器
export const getUniqueContainers = async (repo: string, version1: string, version2: string)=>{
    const versions = getVersionsBetween(version1, version2);
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

// 根据不同的level1获取不同的叶节点背景色
export const getLevel3Color = (level1_container: EntityNode|undefined)=>{
    if (level1_container !== undefined) {
        switch(level1_container.eid) {
            case 107: return '#b4c4ec';//kernel
            case 108: return '#cce4b4';//mm
            case 109: return '#f4b484';//fs
            default: return '#fff799';
        }
    }
    return '#fff799'// 默认颜色
}