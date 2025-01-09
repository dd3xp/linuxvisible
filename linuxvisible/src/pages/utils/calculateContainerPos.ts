import { EntityNode } from "../api/API";

// 单元化网格
export const linuxSize: [number, number] = [1400, 750]; // 直接定义为元组
export const gridSize: number = 50;
const colAmount: number = linuxSize[0] / gridSize;
const rowAmount: number = linuxSize[1] / gridSize;
const maxLevel: number = 3;

// 设置边距
const level1Margin: number = 6;
const level2Margin: number = 8.7;
const level3Margin: number = 11.4;
const titleSize: number = 12;

// 组件字典
const kernelList: { [key: number]: number[] } = {
    "-1": [0, 0, rowAmount - 1, colAmount - 1]
};

export const addPosToList = (containerData: EntityNode[])=>{
    for (const container of containerData) {
        // 将坐标信息添加到字典中
        const coordinate: [number, number, number, number] = [container.x1, container.y1, container.x2, container.y2];
        kernelList[container.eid] = coordinate
    }
}

export const calculateKernelContainerPos = (eid: number, level: number, x1:number, y1:number, x2: number, y2: number, belong_to: number=-1)=>{
    // 将坐标信息添加到字典中
    const coordinate: [number, number, number, number] = [x1, y1, x2, y2];

    // 算出相对大容器的位置
    const margin = marginDefine(level)
    const position = getPosition(coordinate, margin, belong_to, level)

    return position
}

export const marginDefine = (level: number)=>{
    let margin: number = 0;

    if (level === 1) {
        margin = level1Margin;
    } else if (level === 2) {
        margin = level2Margin;
    } else if (level === 3) {
        margin = level3Margin;
    } else {
        console.error("Invalid level input!!!");
    }

    return margin;
}

//计算css中的top、bottom、left、right
export const getPosition = (coordinate: number[], margin: number, belong_to: number, level: number)=> {
    const condition_margin = level + 3;
    const parents_coordinate = kernelList[belong_to];

    if (!parents_coordinate) {
        console.error(`没有找到归属于 '${belong_to}' 的父坐标。请检查容器名称。`);
    }

    let top_margin = margin;
    // 设置标题间距
    if (belong_to !== -1) {
        if (coordinate[0] === parents_coordinate[0]) {
            top_margin = margin + titleSize * (level - 1);
            if (level === 3) {
                top_margin -= titleSize * 2;
            }
        }
    }

    // 计算位置
    const top = coordinate[0] * gridSize + top_margin - condition_margin;
    const bottom = (rowAmount - coordinate[2] - 1) * gridSize + margin - condition_margin;
    const left = coordinate[1] * gridSize + margin - condition_margin;
    const right = (colAmount - coordinate[3] - 1) * gridSize + margin - condition_margin;

    // 检查边界
    let adjustedTop = top;
    let adjustedBottom = bottom;
    let adjustedLeft = left;
    let adjustedRight = right;

    if (coordinate[0] === parents_coordinate[0]) {
        adjustedTop = top + condition_margin;
    }
    if (coordinate[2] === parents_coordinate[2]) {
        adjustedBottom = bottom + condition_margin;
    }
    if (coordinate[1] === parents_coordinate[1]) {
        adjustedLeft = left + condition_margin;
    }
    if (coordinate[3] === parents_coordinate[3]) {
        adjustedRight = right + condition_margin;
    }

    return [adjustedTop, adjustedBottom, adjustedLeft, adjustedRight];
}

