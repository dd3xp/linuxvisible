import styles from '../styles/Grid.module.css';
import '../styles/Global.css';

const Grid:React.FC = () => {

    const WIDTH = 1100;
    const HEIGHT = 650;
    const GRID = 50;
    
    const COLS = WIDTH / GRID;
    const ROWS = HEIGHT / GRID;
    const grid = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));

    return(
        <div className={styles.gridContainer}>
        {grid.map((row, i) => (
          <div key={i} className={styles.gridRow}>
            {row.map((_, j) => (
              <div key={j} className={styles.gridCell}>
                {i},{j}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
}

export default Grid;