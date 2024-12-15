import { useEffect, useState } from 'react';
import '../styles/ContainerList.css';

interface Container {
  [key: string]: string | number;
}

interface ContainerListProps {
  onContainerSelect: (component: string) => void;
}

const ContainerList: React.FC = () => {
  const [containers, setContainers] = useState<string[]>([]);

  useEffect(() => {
    fetch('/container.json')
      .then(response => response.json())
      .then((data: Container[]) => {
        const level3Index = data.findIndex(item => Array.isArray(item) && item[0] === "==============declare the level 3 containers right here==============");
        if (level3Index !== -1) {
          const level3Containers = data.slice(level3Index + 1);
          const filteredContainers = level3Containers.filter(item => Object.keys(item).length === 6 || Object.keys(item).length === 7);
          const firstElements = filteredContainers.map(item => item[0] as string);
          setContainers(firstElements);
        }
      });
  }, []);

  return (
    <div className="container-list">
      <div className="container-list-title">特性列表</div>
      <div>
        {containers.map((item, index) => (
          <button
            className="list-button"
            key={index}
            onClick={() => console.log(`Button clicked: ${item}`)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContainerList;
