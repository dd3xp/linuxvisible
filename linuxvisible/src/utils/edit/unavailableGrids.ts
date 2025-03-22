import { EntityNode } from "../API.d";
// import { gridSize } from "../../utils/calculateContainerPos";

// 计算不可用的格子
export const calculateUnavailableGrids = (entities: EntityNode[]): number[][] => {
    const unavailableGrids: number[][] = [];

    // 只处理 level === 3 的实体
    entities
        .filter(entity => entity.level === 3) // 添加过滤条件
        .forEach(({ x1, y1, x2, y2 }) => {
            // 确保 x1 < x2, y1 < y2
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);

            // 计算起始和结束的 row/col
            const startRow = Math.floor(minX);
            const endRow = Math.floor(maxX);
            const startCol = Math.floor(minY);
            const endCol = Math.floor(maxY);

            // 遍历该区域内的所有格子
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol; col <= endCol; col++) {
                    unavailableGrids.push([row, col]);
                }
            }
        });

    return unavailableGrids;
};

// 计算 level 2 容器的格子
export const calculateLevel2ContainerGrids = (entities: EntityNode[]): Record<number, number[][]> => {
    const level2ContainerGrids: Record<number, number[][]> = {};

    entities
        .filter(entity => entity.level === 2)
        .forEach(({ eid, x1, y1, x2, y2 }) => {
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);

            const startRow = Math.floor(minX);
            const endRow = Math.floor(maxX);
            const startCol = Math.floor(minY);
            const endCol = Math.floor(maxY);

            const grids: number[][] = [];
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol; col <= endCol; col++) {
                    grids.push([row, col]);
                }
            }

            level2ContainerGrids[eid] = grids;
        });

    return level2ContainerGrids;
};

// 计算添加特征时不可用的格子
export const calculateAddFeatureUnavailableGrids = (entities: EntityNode[]): number[][] => {
    return calculateUnavailableGrids(entities);
};

// 计算修改特征时不可用的格子
export const calculateEditFeatureUnavailableGrids = (
    entities: EntityNode[],
    editingFeature: EntityNode
): number[][] => {
    // 获取原始的 unavailableGrids
    const originalUnavailableGrids = calculateUnavailableGrids(entities);

    // 计算 `editingFeature` 所占的格子
    const editingFeatureGrids = calculateUnavailableGrids([editingFeature]);

    // 过滤掉 editingFeature 占据的格子
    return originalUnavailableGrids.filter(
        ([row, col]) => !editingFeatureGrids.some(([er, ec]) => er === row && ec === col)
    );
};