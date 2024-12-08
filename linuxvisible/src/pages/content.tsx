import '../styles/Content.css';
import '../styles/globle.css';

const Content:React.FC = () => {
    return(
       <>
       <div className="tool level-1-container linux-1">
           <div className="level-1-title linux-title">tool</div>
       </div>
       <div className="test level-2-container tool-2">
           <div className="level-2-title tool-title">test</div>
       </div>
       <div className="test2 level-3-container test-3">
           <div className="level-3-title test-title">test2</div>
       </div>
       <div className="crypto level-1-container linux-1">
           <div className="level-1-title linux-title">crypto</div>
       </div>
       <div className="init level-1-container linux-1">
           <div className="level-1-title linux-title">init</div>
       </div>
       <div className="security level-1-container linux-1">
           <div className="level-1-title linux-title">security</div>
       </div>
       <div className="virt level-1-container linux-1">
           <div className="level-1-title linux-title">virt</div>
       </div>
       <div className="sound level-1-container linux-1">
           <div className="level-1-title linux-title">sound</div>
       </div>
       <div className="ipc level-1-container linux-1">
           <div className="level-1-title linux-title">ipc</div>
       </div>
       <div className="test3 level-2-container ipc-2">
           <div className="level-2-title ipc-title">test3</div>
       </div>
       <div className="test4 level-3-container test3-3">
           <div className="level-3-title test3-title">test4</div>
       </div>
       <div className="kernel level-1-container linux-1">
           <div className="level-1-title linux-title">kernel</div>
       </div>
       <div className="Memory-Menagement level-1-container linux-1">
           <div className="level-1-title linux-title">Memory Menagement</div>
       </div>
       <div className="fs level-1-container linux-1">
           <div className="level-1-title linux-title">fs</div>
       </div>
       <div className="drivers level-1-container linux-1">
           <div className="level-1-title linux-title">drivers</div>
       </div>
       <div className="arch level-1-container linux-1">
           <div className="level-1-title linux-title">arch</div>
       </div>
       <div className="net level-1-container linux-1">
           <div className="level-1-title linux-title">net</div>
       </div>
        </>
   )
}
export default Content;
