import '../styles/Kernel.css';
import '../styles/Global.css';

interface KernelProps {
    selected: string | null;
    onContainerSelect: (component: string | null) => void;
  }
  
  const Kernel: React.FC<KernelProps> = ({ selected, onContainerSelect }) => {
    
    const handleClick = (containerName: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (selected === containerName) {
            onContainerSelect(null);
        } else {
            onContainerSelect(containerName);
        }
        console.log(`${containerName} activated`);
    };

    return(
        <>

        <div
        className={`test24 level-3-container test3-3 ${selected === "test24" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test24', e)}
        >
            <div className="level-3-title test3-title">test24</div>
        </div>

        <div
        className={`test23 level-3-container test3-3 ${selected === "test23" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test23', e)}
        >
            <div className="level-3-title test3-title">test23</div>
        </div>

        <div
        className={`test22 level-3-container test3-3 ${selected === "test22" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test22', e)}
        >
            <div className="level-3-title test3-title">test22</div>
        </div>

        <div
        className={`test21 level-3-container test3-3 ${selected === "test21" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test21', e)}
        >
            <div className="level-3-title test3-title">test21</div>
        </div>

        <div
        className={`test20 level-3-container test3-3 ${selected === "test20" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test20', e)}
        >
            <div className="level-3-title test3-title">test20</div>
        </div>

        <div
        className={`test19 level-3-container test3-3 ${selected === "test19" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test19', e)}
        >
            <div className="level-3-title test3-title">test19</div>
        </div>

        <div
        className={`test18 level-3-container test3-3 ${selected === "test18" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test18', e)}
        >
            <div className="level-3-title test3-title">test18</div>
        </div>

        <div
        className={`test17 level-3-container test3-3 ${selected === "test17" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test17', e)}
        >
            <div className="level-3-title test3-title">test17</div>
        </div>

        <div
        className={`test16 level-3-container test3-3 ${selected === "test16" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test16', e)}
        >
            <div className="level-3-title test3-title">test16</div>
        </div>

        <div
        className={`test15 level-3-container test3-3 ${selected === "test15" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test15', e)}
        >
            <div className="level-3-title test3-title">test15</div>
        </div>

        <div
        className={`test14 level-3-container test3-3 ${selected === "test14" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test14', e)}
        >
            <div className="level-3-title test3-title">test14</div>
        </div>

        <div
        className={`test13 level-3-container test3-3 ${selected === "test13" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test13', e)}
        >
            <div className="level-3-title test3-title">test13</div>
        </div>

        <div
        className={`test12 level-3-container test3-3 ${selected === "test12" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test12', e)}
        >
            <div className="level-3-title test3-title">test12</div>
        </div>

        <div
        className={`test11 level-3-container test3-3 ${selected === "test11" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test11', e)}
        >
            <div className="level-3-title test3-title">test11</div>
        </div>

        <div
        className={`test10 level-3-container test3-3 ${selected === "test10" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test10', e)}
        >
            <div className="level-3-title test3-title">test10</div>
        </div>

        <div
        className={`test9 level-3-container test3-3 ${selected === "test9" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test9', e)}
        >
            <div className="level-3-title test3-title">test9</div>
        </div>

        <div
        className={`test8 level-3-container test3-3 ${selected === "test8" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test8', e)}
        >
            <div className="level-3-title test3-title">test8</div>
        </div>

        <div
        className={`test7 level-3-container test3-3 ${selected === "test7" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test7', e)}
        >
            <div className="level-3-title test3-title">test7</div>
        </div>

        <div
        className={`test6 level-3-container test3-3 ${selected === "test6" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test6', e)}
        >
            <div className="level-3-title test3-title">test6</div>
        </div>

        <div
        className={`test5 level-3-container test3-3 ${selected === "test5" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test5', e)}
        >
            <div className="level-3-title test3-title">test5</div>
        </div>

        <div
        className={`test4 level-3-container test3-3 ${selected === "test4" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test4', e)}
        >
            <div className="level-3-title test3-title">test4</div>
        </div>

        <div
        className={`test2 level-3-container test-3 ${selected === "test2" ? 'selected' : ''}`}
        onClick={(e) => handleClick('test2', e)}
        >
            <div className="level-3-title test-title">test2</div>
        </div>

        <div className="test3 level-2-container Memory-Menagement-2">
            <div className="level-2-title Memory-Menagement-title">test3</div>
        </div>

        <div className="test level-2-container tool-2">
            <div className="level-2-title tool-title">test</div>
        </div>

        <div className="net level-1-container linux-1">
            <div className="level-1-title linux-title">net</div>
        </div>

        <div className="arch level-1-container linux-1">
            <div className="level-1-title linux-title">arch</div>
        </div>

        <div className="drivers level-1-container linux-1">
            <div className="level-1-title linux-title">drivers</div>
        </div>

        <div className="fs level-1-container linux-1">
            <div className="level-1-title linux-title">fs</div>
        </div>

        <div className="Memory-Menagement level-1-container linux-1">
            <div className="level-1-title linux-title">Memory Menagement</div>
        </div>

        <div className="kernel level-1-container linux-1">
            <div className="level-1-title linux-title">kernel</div>
        </div>

        <div className="ipc level-1-container linux-1">
            <div className="level-1-title linux-title">ipc</div>
        </div>

        <div className="sound level-1-container linux-1">
            <div className="level-1-title linux-title">sound</div>
        </div>

        <div className="virt level-1-container linux-1">
            <div className="level-1-title linux-title">virt</div>
        </div>

        <div className="security level-1-container linux-1">
            <div className="level-1-title linux-title">security</div>
        </div>

        <div className="init level-1-container linux-1">
            <div className="level-1-title linux-title">init</div>
        </div>

        <div className="crypto level-1-container linux-1">
            <div className="level-1-title linux-title">crypto</div>
        </div>

        <div className="tool level-1-container linux-1">
            <div className="level-1-title linux-title">tool</div>
        </div>
        </>
    )
}

export default Kernel;