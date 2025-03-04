import {useEffect, useState} from 'react';
import Kernel from './kernel';
import Grid from './edit/grid';
import ContainerList from './containerlist';
import {getFeatureListByEid, getFeatureListByVersion, getFeatureModules} from '../services/feature';


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
    const [circleActiveState, setCircleActiveState] = useState<Record<string, boolean>>({
        特性贡献: false,
        提交贡献: false,
        代码贡献: false,
        Maintainer贡献: false,
    });
    const [companyList, setCompanyList] = useState<string>('')


    const handleContainerSelect = async (component: string | null,type: string, id?: number) => {
        if (component !== null) {
            localStorage.setItem('selectedFeatureId', String(id));
            console.log("i set id",id);
            const components: string[] = [component];
            if (type === 'list' && id !== undefined) {
                const response = await getFeatureModules({featureId: id, repo: versionInfo?.repo ?? ''});
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

    const onCompanyChange = (company: string) => {
        setCompanyList(company)
    }

    const handleDocumentClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!event.target || !(event.target instanceof HTMLElement)) return;
        if (
            event.target.closest('.version-select')&&
            target.tagName === "SPAN" && target.innerText === "确 认"
        ) {
            setSelectedContainer(null);
        }
    };

    const freshFeatureListByVersion = (repo: string, version1: string, version2: string) => {
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
                <ContainerList 
                    selected={selected} 
                    onContainerSelect={handleContainerSelect}
                    onVersionSelect={onVersionSelect}
                    freshFeatureListByVersion={freshFeatureListByVersion}
                    circleActiveState={circleActiveState}
                    setCircleActiveState={setCircleActiveState}
                    onCompanyChange={onCompanyChange}
                    containers={containers}/>
            </div>
            <div className="overlay-container">
                {/* 这个页面将不再需要Grid
                <div className="grid">
                    <Grid/>
                </div>
                */}
                <div className="linux">
                    <Kernel 
                        selected={selected} 
                        onContainerSelect={handleContainerSelect} 
                        versionInfo={versionInfo}
                        freshFeatureListByVersion={freshFeatureListByVersion}
                        circleActiveState={circleActiveState}
                        companyList={companyList}
                        freshFeatureListByKgentity={freshFeatureListByKgentity}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;