import {useEffect, useState} from 'react';
import Kernel from './kernel';
import Grid from './grid';
import ContainerList from './containerlist';
import {getFeatureListByEid, getFeatureListByVersion, getFeatureModules} from './api/services/feature';
import {message} from "antd";

interface VersionInformation {
    repo: string | null;
    startVersion: string | null;
    endVersion: string | null;
}

interface Container {
    featureId: number;
    text: string;
    version: string;
}

const Dashboard: React.FC = () => {
    const [selected, setSelectedContainer] = useState<string[] | null>(null);
    const [versionInfo, setVersionInfo] = useState<VersionInformation | null>(null)
    const [containers, setContainers] = useState<Container[]>([]);


    const handleContainerSelect = async (component: string | null, type: string, id?: number) => {
        if (component !== null) {
            const components: string[] = [component];
            if (type === 'list' && id !== undefined) {
                const response = await getFeatureModules({featureId: id});
                if (Array.isArray(response)) {
                    response.forEach((item: { nameEn: string }) =>
                        components.push(item.nameEn.replace(/&/g, 'and').replace(/\//g, '').replace(/ /g, '-'))
                    );
                }
            }
            setSelectedContainer(components);
        } else {
            setSelectedContainer(null);
        }
    };

    const onVersionSelect = (repo: string, version1: string, version2: string) => {
        setVersionInfo({
            repo: repo,
            startVersion: version1,
            endVersion: version2
        })
    }

    const handleDocumentClick = (event: MouseEvent) => {
        if (!event.target || !(event.target instanceof HTMLElement)) return;
        if (
            !event.target.closest('.kernel-container') &&
            !event.target.closest('.container-list')
        ) {
            setSelectedContainer(null);
        }
    };

    const freshFeatureListByVersion = (repo: string, version1: string, version2: string) => {
        if ((version1 && version2 && version1 > version2) || (version1 && version2 && version1 > version2)) {
            message.error("开始版本不能大于结束版本！");
            return;
        }

        // 获取特性列表
        getFeatureListByVersion({
            repo: repo ?? '',
            startVersion: version1 ?? '',
            endVersion: version2 ?? ''
        }).then(data => {
            const texts = data.map((item: Container) => {
                return {
                    featureId: item.featureId,
                    text: item.text,
                    version: item.version
                }
            });
            setContainers(texts);
        })
        // 设定版本信息
        onVersionSelect(repo ?? '', version1 ?? '', version2 ?? '')
    }

    const freshFeatureListByKgentity = (repo: string, version1: string, version2: string, eid: number) => {
        // 获取特性列表
        getFeatureListByEid({
            repo: repo ?? '',
            startVersion: version1 ?? '',
            endVersion: version2 ?? '',
            kgId: eid,
        }).then(data => {
            const texts = data.map((item: Container) => {
                return {
                    featureId: item.featureId,
                    text: item.text,
                    version: item.version
                }
            });
            setContainers(texts);
        })
    }

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    return (
        <div className="screen">
            <div>
                <ContainerList selected={selected} onContainerSelect={handleContainerSelect}
                               onVersionSelect={onVersionSelect} freshFeatureListByVersion={freshFeatureListByVersion}
                               containers={containers}/>
            </div>
            <div className="overlay-container">
                <div className="grid">
                    <Grid/>
                </div>
                <div className="linux">
                    <Kernel selected={selected} onContainerSelect={handleContainerSelect} versionInfo={versionInfo}
                            freshFeatureListByVersion={freshFeatureListByVersion}
                            freshFeatureListByKgentity={freshFeatureListByKgentity}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;