import '../styles/Home.css';
import '../styles/globle.css'

export default function Home() {
  return (
  <div className="level-1-container">
    <h2 className="level-1-container-title">一级容器</h2>
    {/*这里面将会填充所有二级容器的代码*/}
    <div className="level-2-container">
      <h3 className="level-2-container-title">二级容器</h3>
      {/*这里面将会填充所有三级容器的代码*/}
      <div className="level-3-container">
        <h4 className="level-3-container-title">三级容器</h4>
        {/*这里面将会填充所有内核组件的代码*/}
        <div className="kernel-container">
          <h5 className="kernel-container-title">内核容器</h5>
        </div>
        <div className="kernel-container">
          <h5 className="kernel-container-title">内核容器</h5>
        </div>
        <div className="kernel-container">
          <h5 className="kernel-container-title">内核容器</h5>
        </div>
        <div className="kernel-container">
          <h5 className="kernel-container-title">内核容器</h5>
        </div>
        <div className="kernel-container">
          <h5 className="kernel-container-title">内核容器</h5>
        </div>
        <div className="kernel-container">
          <h5 className="kernel-container-title">内核容器</h5>
        </div>
        <div className="kernel-container">
          <h5 className="kernel-container-title">内核容器</h5>
        </div>
      </div>
    </div>
  </div>
  );
}