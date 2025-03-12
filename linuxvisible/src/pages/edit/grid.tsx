import { useEffect, useState } from 'react';
import styles from '../../styles/Grid.module.css';
import { gridSize, linuxSize } from '../../utils/calculateContainerPos';

interface GridProps {
    setLeftSelected: (pos: { row: number; col: number } | null) => void;
    setRightSelected: (pos: { row: number; col: number } | null) => void;
    isEditing: boolean;
    resetSelection: boolean;
}

const Grid: React.FC<GridProps> = ({ setLeftSelected, setRightSelected, isEditing, resetSelection }) => {
    const WIDTH = linuxSize[0];
    const HEIGHT = linuxSize[1];
    const GRID = gridSize;

    const COLS = WIDTH / GRID;
    const ROWS = HEIGHT / GRID;

    // 记录左键和右键选中的位置
    const [leftSelected, setLocalLeftSelected] = useState<{ row: number; col: number } | null>(null);
    const [rightSelected, setLocalRightSelected] = useState<{ row: number; col: number } | null>(null);

    const handleCellClick = (row: number, col: number, isRightClick = false) => {
        if (isRightClick) {
            if (rightSelected && rightSelected.row === row && rightSelected.col === col) {
                setLocalRightSelected(null);
                setRightSelected(null);
            } else {
                setLocalRightSelected({ row, col });
                setRightSelected({ row, col });
            }
        } else {
            if (leftSelected && leftSelected.row === row && leftSelected.col === col) {
                setLocalLeftSelected(null);
                setLeftSelected(null);
            } else {
                setLocalLeftSelected({ row, col });
                setLeftSelected({ row, col });
            }
        }
    };

    useEffect(() => {
      if (resetSelection) {
          setLocalLeftSelected(null);
          setLocalRightSelected(null);
          setLeftSelected(null);
          setRightSelected(null);
      }
    }, [resetSelection]); 

    return (
        <div
            className={styles.gridContainer}
            style={{
                zIndex: isEditing ? 9999 : 999, // 默认 999，编辑时 9999
                height: '100%',
            }}
        >
            {/* 清空按钮，供 "保存编辑" 时调用 */}
            <button
                style={{ display: 'none' }} // 这个按钮不会展示，但会被 `Dashboard.tsx` 触发
                onClick={() => {
                    setLocalLeftSelected(null);
                    setLocalRightSelected(null);
                    setLeftSelected(null);
                    setRightSelected(null);
                }}
            >
                Reset
            </button>

            {Array.from({ length: ROWS }).map((_, i) => (
                <div key={i} className={styles.gridRow}>
                    {Array.from({ length: COLS }).map((_, j) => {
                        const isLeftActive = leftSelected && leftSelected.row === i && leftSelected.col === j;
                        const isRightActive = rightSelected && rightSelected.row === i && rightSelected.col === j;
                        const isBothActive = isLeftActive && isRightActive;

                        return (
                            <button
                                key={j}
                                className={`${styles.gridCell} 
                                    ${isBothActive ? styles.activeBoth : ''} 
                                    ${!isBothActive && isLeftActive ? styles.activeLeft : ''} 
                                    ${!isBothActive && isRightActive ? styles.activeRight : ''}`}
                                onClick={() => handleCellClick(i, j, false)}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    handleCellClick(i, j, true);
                                }}
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
