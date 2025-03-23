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

// 计算某一层级的容器格子（level 1 或 2）
export const calculateParentsGrids = (entities: EntityNode[], level: number): Record<number, number[][]> => {
    const containerGrids: Record<number, number[][]> = {};

    entities
        .filter(entity => entity.level === level)
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

            containerGrids[eid] = grids;
        });

    return containerGrids;
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

// 添加一个格式化容器名称的函数
export const formatContainerName = (
    entities: EntityNode[],
    parentInfo: { eid: number; level: 1 | 2 } | null
): string => {
    if (!parentInfo) return '无效的父容器';
    
    const { eid, level } = parentInfo;
    // 如果 eid 是 -1，返回 'linux'
    if (eid === -1) return 'linux';
    
    const found = entities.find(e => e.eid === eid);
    if (!found) return '无效的父容器';
    
    return `${found.nameEn} (${level === 2 ? '二级' : '一级'})`;
};

// 严格查找父容器名称
export const findStrictContainerName = (
    entities: EntityNode[],
    level2Grids: Record<number, number[][]>,
    level1Grids: Record<number, number[][]>,
    x1: number, y1: number, x2: number, y2: number
): string => {  // 改为直接返回 string
    const parentInfo = findParentContainerId(x1, y1, x2, y2, level2Grids, level1Grids);
    if (!parentInfo) return '无效的父容器';
    
    // 如果 eid 是 -1，返回 'linux'
    if (parentInfo.eid === -1) return 'linux';
    
    const found = entities.find(e => e.eid === parentInfo.eid);
    return found?.nameEn ?? '无效的父容器';
};

// 添加位置字符串解析函数
export const parsePosition = (position: string) => {
    const pos = position.match(/\((\d+), (\d+)\) - \((\d+), (\d+)\)/);
    if (!pos) return null;
    return {
        x1: Number(pos[1]),
        y1: Number(pos[2]),
        x2: Number(pos[3]),
        y2: Number(pos[4])
    };
};

// 添加父容器查找函数（返回 eid）
export const findParentContainerId = (
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number,
    level2Grids: Record<number, number[][]>,
    level1Grids: Record<number, number[][]>
): { eid: number; level: 1 | 2 } | null => {
    // 检查是否在同一个二级容器中
    for (const [eidStr, grids] of Object.entries(level2Grids)) {
        const hasStart = grids.some(([r, c]) => r === x1 && c === y1);
        const hasEnd = grids.some(([r, c]) => r === x2 && c === y2);
        if (hasStart && hasEnd) {
            return { eid: Number(eidStr), level: 2 };
        }
    }

    // 检查两个点是否在任何二级容器中
    const point1Level2Container = Object.entries(level2Grids).find(([_, grids]) => 
        grids.some(([r, c]) => r === x1 && c === y1)
    );
    const point2Level2Container = Object.entries(level2Grids).find(([_, grids]) => 
        grids.some(([r, c]) => r === x2 && c === y2)
    );

    // 如果两个点在不同的二级容器中，返回 null
    if (point1Level2Container && point2Level2Container) {
        return null;
    }

    // 检查是否在同一个一级容器中
    for (const [eidStr, grids] of Object.entries(level1Grids)) {
        const hasStart = grids.some(([r, c]) => r === x1 && c === y1);
        const hasEnd = grids.some(([r, c]) => r === x2 && c === y2);
        if (hasStart && hasEnd) {
            return { eid: Number(eidStr), level: 1 };
        }
    }

    // 检查两个点是否完全不在任何容器中
    const point1InAnyContainer = Object.values(level2Grids).some(grids => 
        grids.some(([r, c]) => r === x1 && c === y1)
    ) || Object.values(level1Grids).some(grids => 
        grids.some(([r, c]) => r === x1 && c === y1)
    );

    const point2InAnyContainer = Object.values(level2Grids).some(grids => 
        grids.some(([r, c]) => r === x2 && c === y2)
    ) || Object.values(level1Grids).some(grids => 
        grids.some(([r, c]) => r === x2 && c === y2)
    );

    // 只有当两个点都不在任何容器中时，返回 -1
    if (!point1InAnyContainer && !point2InAnyContainer) {
        return { eid: -1, level: 1 };
    }

    // 其他情况（比如只有一个点在容器中）返回 null
    return null;
};

// 修改坐标计算函数，确保返回值不为 null
export const calculateSelectedCoordinates = (selectedCells: Set<string>) => {
    if (selectedCells.size === 0) return {
        minRow: 0,
        maxRow: 0,
        minCol: 0,
        maxCol: 0
    };
    
    const coords = Array.from(selectedCells).map(cell => {
        const [r, c] = cell.split('-').map(Number);
        return { row: r, col: c };
    });

    const rows = coords.map(coord => coord.row);
    const cols = coords.map(coord => coord.col);
    
    return {
        minRow: Math.min(...rows),
        maxRow: Math.max(...rows),
        minCol: Math.min(...cols),
        maxCol: Math.max(...cols)
    };
};

// 添加格式化位置字符串函数
export const formatPosition = (coords: { minRow: number; maxRow: number; minCol: number; maxCol: number }) => {
    return `(${coords.minRow}, ${coords.minCol}) - (${coords.maxRow}, ${coords.maxCol})`;
};

// 计算父容器名称
export const calculateParentContainerName = (
    position: string | null,
    entities: EntityNode[],
    level2Grids: Record<number, number[][]>
): string => {
    if (!position) return '暂无';

    const pos = position.match(/\((\d+), (\d+)\) - \((\d+), (\d+)\)/);
    if (!pos) return '暂无';

    const [x1, y1, x2, y2] = [Number(pos[1]), Number(pos[2]), Number(pos[3]), Number(pos[4])];
    const level1Grids = calculateParentsGrids(entities, 1);
    return findStrictContainerName(entities, level2Grids, level1Grids, x1, y1, x2, y2);
};
