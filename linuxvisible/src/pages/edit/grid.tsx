import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/Edit/Grid.module.css';
import { gridSize, linuxSize } from '../../utils/calculateContainerPos';

interface GridProps {
    isEditing: boolean;
    resetSelection: boolean;
    unavailableGrids: number[][]; // 接收不可用格子数据
    level2ContainerGrids: Record<number, number[][]>; // 接收 level 2 容器的格子数据
    setHaveUnavailableGrids: (value: boolean) => void; // 用于根据是否有不可用格子来控制是否可以保存
    setDifferentParents: (value: boolean) => void; // 用于根据是否有不同父级来控制是否可以保存
}

const Grid: React.FC<GridProps> = ({ 
    isEditing, 
    resetSelection, 
    unavailableGrids, 
    level2ContainerGrids, 
    setHaveUnavailableGrids, 
    setDifferentParents }) => {

    const WIDTH = linuxSize[0];
    const HEIGHT = linuxSize[1];
    const GRID = gridSize;

    const COLS = WIDTH / GRID;
    const ROWS = HEIGHT / GRID;

    const gridRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectionBox, setSelectionBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

    // 记录框选过程中选中的按钮
    const [hoverSelectedCells, setHoverSelectedCells] = useState<Set<string>>(new Set());
    // 记录鼠标松开时最终选中的按钮
    const [finalSelectedCells, setFinalSelectedCells] = useState<Set<string>>(new Set());
    // 记录是否框选了不可用的格子
    const [hasInvalidSelection, setHasInvalidSelection] = useState<boolean>(false);

    // 获取鼠标相对 Grid 容器的位置
    const getRelativePosition = (event: MouseEvent) => {
        if (!gridRef.current) return { x: 0, y: 0 };
        const rect = gridRef.current.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    // 获取按钮的坐标范围
    const getCellBounds = (row: number, col: number) => ({
        left: col * GRID,
        top: row * GRID,
        right: (col + 1) * GRID,
        bottom: (row + 1) * GRID,
    });

    // 判断按钮是否被框选到（部分覆盖也算）
    const isCellIntersecting = (cell: { left: number; top: number; right: number; bottom: number }, box: { left: number; top: number; width: number; height: number }) => {
        const boxRight = box.left + box.width;
        const boxBottom = box.top + box.height;
        return !(
            cell.left > boxRight || 
            cell.right < box.left || 
            cell.top > boxBottom || 
            cell.bottom < box.top
        );
    };

    // 鼠标按下 -> 开始框选（仅在 `isEditing === true` 时生效）
    const handleMouseDown = (event: React.MouseEvent) => {
        if (!isEditing) return; 
        const { x, y } = getRelativePosition(event.nativeEvent);
        setStartPoint({ x, y });
        setIsDragging(true);
        setSelectionBox({ left: x, top: y, width: 0, height: 0 });
        setHoverSelectedCells(new Set());
    };

    // 鼠标移动 -> 更新选框和"框选中的按钮"
    const handleMouseMove = (event: React.MouseEvent) => {
        if (!isDragging || !startPoint || !isEditing) return;

        const { x, y } = getRelativePosition(event.nativeEvent);
        const newSelectionBox = {
            left: Math.min(x, startPoint.x),
            top: Math.min(y, startPoint.y),
            width: Math.abs(x - startPoint.x),
            height: Math.abs(y - startPoint.y),
        };
        setSelectionBox(newSelectionBox);

        // 计算当前框选到的按钮
        const newHoverSelectedCells = new Set<string>();
        let hasInvalid = false;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = getCellBounds(r, c);
                if (isCellIntersecting(cell, newSelectionBox)) {
                    newHoverSelectedCells.add(`${r}-${c}`);
                    // 检查是否是无效格子
                    if (unavailableGrids.some(([ur, uc]) => ur === r && uc === c)) {
                        hasInvalid = true;
                    }
                }
            }
        }

        setHoverSelectedCells(newHoverSelectedCells);
        setHasInvalidSelection(hasInvalid);
    };

    // 鼠标释放 -> 记录最终选中的按钮
    const handleMouseUp = () => {
        if (!isEditing) return;
        setIsDragging(false);
        setSelectionBox(null);
        setFinalSelectedCells(new Set(hoverSelectedCells));

        if (hoverSelectedCells.size === 0) {
            console.log('No grids selected.');
            setFinalSelectedCells(new Set());
            setHaveUnavailableGrids(false);
            return;
        }

        // 检查是否有不同的父级
        const parentSet = new Set<number>();
        const findParent = (row: number, col: number): number | null => {
            for (const [eid, gridList] of Object.entries(level2ContainerGrids)) {
                if (gridList.some(([r, c]) => r === row && c === col)) {
                    return Number(eid);
                }
            }
            return null;
        };
    
        hoverSelectedCells.forEach((cellStr) => {
            const [row, col] = cellStr.split('-').map(Number);
            const parent = findParent(row, col);
            if (parent !== null) {
                parentSet.add(parent);
            }
        });
    
        if (parentSet.size > 1) {
            console.error('different parents selected:', parentSet);
            setDifferentParents(true);
        } else {
            setDifferentParents(false);
        }

        setFinalSelectedCells(new Set(hoverSelectedCells));

        // 对比框选的格子和不可用格子
        const invalidCells = Array.from(hoverSelectedCells).filter((cell) => {
            const [row, col] = cell.split('-').map(Number);
            return unavailableGrids.some(([ur, uc]) => ur === row && uc === col);
        });

        if (invalidCells.length > 0) {
            console.log('Invalid cells selected:', invalidCells);
            setHaveUnavailableGrids(true);
        } else {
            console.log('All selected cells are valid.');
            setHaveUnavailableGrids(false);
        }
    };

    // 监听重置逻辑
    useEffect(() => {
        if (resetSelection) {
            setHoverSelectedCells(new Set());
            setFinalSelectedCells(new Set());
            setSelectionBox(null);
            setStartPoint(null);
        }
    }, [resetSelection]);

    return (
        <div
            ref={gridRef}
            className={styles.gridContainer}
            style={{ zIndex: isEditing ? 9999 : 999, height: '100%' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* 框选区域（仅在 `isEditing` 开启时可见） */}
            {isEditing && selectionBox && (
                <div
                    className={styles.selectionBox}
                    style={{
                        left: selectionBox.left,
                        top: selectionBox.top,
                        width: selectionBox.width,
                        height: selectionBox.height,
                    }}
                />
            )}

            {/* 网格按钮 */}
            {Array.from({ length: ROWS }).map((_, i) => (
                <div key={i} className={styles.gridRow}>
                    {Array.from({ length: COLS }).map((_, j) => {
                        const isHovered = isEditing && hoverSelectedCells.has(`${i}-${j}`);
                        const isFinalSelected = isEditing && finalSelectedCells.has(`${i}-${j}`);
                        const isUnavailable = unavailableGrids.some(([ur, uc]) => ur === i && uc === j);

                        return (
                            <button
                                key={j}
                                className={`${styles.gridCell} ${!isEditing ? styles.disabled : ''} 
                                    ${isHovered ? styles.hoverActive : ''} 
                                    ${isFinalSelected ? styles.finalActive : ''} 
                                    ${isUnavailable ? styles.unavailableActive : ''}`}
                                style={isUnavailable ? { backgroundColor: 'rgba(255, 99, 71, 0.6)', borderColor: 'red' } : {}}
                            >
                                {i},{j}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Grid;