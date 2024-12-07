import '../styles/Content.css';
import '../styles/globle.css';
import Content from './content';
import Grid from './grid'

const Kernel:React.FC = () => {
    return(
        <div className="screen">
            <div className="operation">
                <h2 className="operation_title">设计底图</h2>
            </div>
            <div className="overlay-container">
                <div className="linux">
                    <Content />
                </div>
                <div className="grid">
                    <Grid />
                </div>
            </div>
        </div>
    )
}

export default Kernel;