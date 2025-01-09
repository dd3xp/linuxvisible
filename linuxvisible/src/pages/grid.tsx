import styles from '../styles/Grid.module.css';
// import '../styles/Global.css';
import { gridSize, linuxSize } from './utils/calculateContainerPos';

const Grid:React.FC = () => {

    const WIDTH = linuxSize[0];
    const HEIGHT = linuxSize[1];
    const GRID = gridSize;
    
    const COLS = WIDTH / GRID;
    const ROWS = HEIGHT / GRID;
    const grid = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));

    return(
        <div className={styles.gridContainer}>
        {grid.map((row, i) => (
          <div key={i} className={styles.gridRow}>
            {row.map((_, j) => (
              <div key={j} className={styles.gridCell}>
                {/* 不显示坐标 */}
                {i},{j}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
}

export default Grid;