import '../styles/Content.css';
import '../styles/globle.css';
import Content from './content';

const Kernel:React.FC = () => {
    return(
        <div className="screen">
            <div className="design1">
                <h2 className="design1_title">设计底图</h2>
            </div>
        <Content />
        </div>
    )
}

export default Kernel;