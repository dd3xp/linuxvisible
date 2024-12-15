import { useState } from 'react';
import '../styles/Kernel.css';
import '../styles/Global.css';
import ContainerList from './containerlist';

const Kernel:React.FC = () => {

    const [selected, setSelected] = useState<string | null>(null);

    const handleContainerSelect = (component: string) => {
        setSelected(component);
      };

    return(
        <>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test24 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test24 activated");
            }
        }}
        className="test24 level-3-container test3-3 ${selected === test24 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test24</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test23 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test23 activated");
            }
        }}
        className="test23 level-3-container test3-3 ${selected === test23 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test23</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test22 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test22 activated");
            }
        }}
        className="test22 level-3-container test3-3 ${selected === test22 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test22</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test21 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test21 activated");
            }
        }}
        className="test21 level-3-container test3-3 ${selected === test21 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test21</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test20 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test20 activated");
            }
        }}
        className="test20 level-3-container test3-3 ${selected === test20 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test20</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test19 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test19 activated");
            }
        }}
        className="test19 level-3-container test3-3 ${selected === test19 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test19</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test18 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test18 activated");
            }
        }}
        className="test18 level-3-container test3-3 ${selected === test18 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test18</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test17 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test17 activated");
            }
        }}
        className="test17 level-3-container test3-3 ${selected === test17 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test17</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test16 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test16 activated");
            }
        }}
        className="test16 level-3-container test3-3 ${selected === test16 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test16</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test15 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test15 activated");
            }
        }}
        className="test15 level-3-container test3-3 ${selected === test15 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test15</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test14 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test14 activated");
            }
        }}
        className="test14 level-3-container test3-3 ${selected === test14 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test14</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test13 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test13 activated");
            }
        }}
        className="test13 level-3-container test3-3 ${selected === test13 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test13</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test12 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test12 activated");
            }
        }}
        className="test12 level-3-container test3-3 ${selected === test12 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test12</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test11 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test11 activated");
            }
        }}
        className="test11 level-3-container test3-3 ${selected === test11 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test11</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test10 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test10 activated");
            }
        }}
        className="test10 level-3-container test3-3 ${selected === test10 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test10</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test9 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test9 activated");
            }
        }}
        className="test9 level-3-container test3-3 ${selected === test9 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test9</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test8 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test8 activated");
            }
        }}
        className="test8 level-3-container test3-3 ${selected === test8 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test8</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test7 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test7 activated");
            }
        }}
        className="test7 level-3-container test3-3 ${selected === test7 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test7</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test6 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test6 activated");
            }
        }}
        className="test6 level-3-container test3-3 ${selected === test6 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test6</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test5 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test5 activated");
            }
        }}
        className="test5 level-3-container test3-3 ${selected === test5 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test5</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test4 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test4 activated");
            }
        }}
        className="test4 level-3-container test3-3 ${selected === test4 ? 'highlight' : ''}"
        >
            <div className="level-3-title test3-title">test4</div>
        </div>

        <div
        role="button"
        tabIndex={0}
        onClick={() => console.log("test2 clicked")}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                console.log("test2 activated");
            }
        }}
        className="test2 level-3-container test-3 ${selected === test2 ? 'highlight' : ''}"
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