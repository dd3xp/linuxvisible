import '../styles/Content.css';
import '../styles/globle.css';

const Content:React.FC = () => {
    return(
       <>
       <div className="Linux">
           <div className="Linux-visible">Linux</div>
           {/*The code to declare the subcontainer of Linux will generate right here*/}
           <div className="tool">
               <div className="tool-visible">tool</div>
               {/*The code to declare the subcontainer of tool will generate right here*/}
           </div>
           <div className="crypto">
               <div className="crypto-visible">crypto</div>
               {/*The code to declare the subcontainer of crypto will generate right here*/}
           </div>
           <div className="init">
               <div className="init-visible">init</div>
               {/*The code to declare the subcontainer of init will generate right here*/}
           </div>
           <div className="security">
               <div className="security-visible">security</div>
               {/*The code to declare the subcontainer of security will generate right here*/}
           </div>
           <div className="virt">
               <div className="virt-visible">virt</div>
               {/*The code to declare the subcontainer of virt will generate right here*/}
           </div>
           <div className="sound">
               <div className="sound-visible">sound</div>
               {/*The code to declare the subcontainer of sound will generate right here*/}
           </div>
           <div className="ipc">
               <div className="ipc-visible">ipc</div>
               {/*The code to declare the subcontainer of ipc will generate right here*/}
           </div>
           <div className="kernel">
               <div className="kernel-visible">kernel</div>
               {/*The code to declare the subcontainer of kernel will generate right here*/}
           </div>
           <div className="Memory-Management">
               <div className="Memory-Management-visible">Memory Management</div>
               {/*The code to declare the subcontainer of Memory Management will generate right here*/}
           </div>
           <div className="fs">
               <div className="fs-visible">fs</div>
               {/*The code to declare the subcontainer of fs will generate right here*/}
           </div>
           <div className="drivers">
               <div className="drivers-visible">drivers</div>
               {/*The code to declare the subcontainer of drivers will generate right here*/}
           </div>
           <div className="net">
               <div className="net-visible">net</div>
               {/*The code to declare the subcontainer of net will generate right here*/}
           </div>
           <div className="arch">
               <div className="arch-visible">arch</div>
               {/*The code to declare the subcontainer of arch will generate right here*/}
           </div>
       </div>
        </>
   )
}
export default Content;
