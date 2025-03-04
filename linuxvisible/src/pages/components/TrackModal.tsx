import React, {useEffect, useState} from "react";
import G6, {registerEdges, registerNodes} from "@/utils/graph";
import {getDependTraceInfo, getTimeTraceInfo, getTrackMethod} from "@/services/track";
import { Spin } from 'antd';

interface TrackProps {
  repo: string;
  featureId: number;
  version: string;
}

const TrackModal: React.FC<TrackProps> = ({featureId, version, repo}) => {

  useEffect(() => {

  }, [featureId, repo]);

  return (
    <>
      {repo && featureId && version && (
        <div style={{marginTop: "0px"}}>
        <Track repo={repo} featureId={featureId} version={version}/>
        </div>
      )}
    </>
  );
};

const Track: React.FC<TrackProps> = ({repo, featureId, version}) => {
  const [loadingTrack, setLoadingTrack] = useState(false);// 柱状图loading
  useEffect(() => {
    registerNodes()
    registerEdges()
    // 点击动态添加节点
    G6.registerBehavior("click-add-node", {
      getEvents: function getEvents() {
        return {
          "node:click": "onClick",
        };
      },
      onClick: function onClick(ev: any) {
        const itemModel = ev.item.getModel();
        if (itemModel.nodeType === "feature") {
          const node = JSON.parse(JSON.stringify(itemModel));
          node.anchorPoints = [
            [0.5, 0],
            [0.5, 1],
          ];
          graph.addItem("node", node);
          setLoadingTrack(true)
          getDependTraceInfo({repo, featureId}).then(
            (result) => {
            const promises = [] as any;
            const datas = [] as any;
            //一个追溯结果都没有的时候再进行报错
            let allNoResults = true;

              result.forEach((item: any) => {
              const itemDate = new Date(
                item.commitTracker.commitTime
              ).getTime();
              item.filePath.forEach((fp: any) => {
                const promise: any = getTrackMethod({
                  repoPath: repo,
                  filePaths: fp,
                  methodName: item.methodName,
                  version,
                  targetCommit: item.commitTracker.commitId,
                }).then((res) => {
                  if (res) {
                    const newNode: any = Object.values(res)[0];
                    if (newNode && newNode.length > 0) {
                      allNoResults = false;
                      const newNodeDate: any = new Date(newNode[0].commitTime).getTime();
                      datas.push({
                        ...newNode[0],
                        timeMinus: Math.max(
                            (itemDate - newNodeDate) / (1000 * 60 * 60 * 24),
                            300
                        ),
                        methodName: item.methodName,
                        filePaths: fp,
                      });
                    }
                  }
                  if (allNoResults) {
                    alert('没有追溯结果');
                  }
                });
                promises.push(promise);
              });
            });

            Promise.all(promises).then(() => {
              dependMethodNode(node, datas);
              setLoadingTrack(false)
            });
          }
        );
        } else {
          if(ev.x > itemModel.linkRange[0][0] && 
            ev.x < itemModel.linkRange[0][1] && 
            ev.y > itemModel.linkRange[1][0] && 
            ev.y < itemModel.linkRange[1][1]) {
             window.open(`https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=${itemModel.commitId}`)
            } else {
              setLoadingTrack(true)
              getTrackMethod({
                repoPath: repo,
                filePaths: itemModel.filePaths,
                methodName: itemModel.methodName,
                version,
                targetCommit: itemModel.commitId,
              }).then((result) => {
                if (result && Object.keys(result).length === 0) {
                  alert('无追溯结果');
                  setLoadingTrack(false)
                } else {
                  const newNode: any = Object.values(result)[0];
                  if (newNode && newNode.length > 0) {
                    const newNodeDate: any = new Date(
                      newNode[0].commitTime
                    ).getTime();
                    const itemDate = new Date(itemModel.commitTime).getTime();
                    newNode[0].timeMinus = Math.max(
                      (itemDate - newNodeDate) / (1000 * 60 * 60 * 24),
                      300
                    );
                    newNode[0].methodName = itemModel.methodName;
                    newNode[0].filePaths = itemModel.filePaths;
                    methodNode(itemModel, newNode[0]);
                    setLoadingTrack(false)
                  }
                }
              });
            }
        }
      },
    });
    const graph = new G6.Graph({
      container: "graph-container",
      width: 1150,
      height: window.innerHeight,
      groupByTypes: true,
      layout: {
        type: "force",
        nodeStrength: -30,
        preventOverlap: true,
        edgeStrength: 0.1,
      },
      modes: {
        default: ["click-add-node", "drag-canvas", "zoom-canvas",
          {
            type: "tooltip",
            formatText: function formatText(model: any) {
              const text = model.label;
              return text;
            },
            shouldUpdate: function shouldUpdate() {
              return true;
            },
          },
        ],
      },
      defaultNode: {
        shape: "time-track-node",
        // 矩形属性
        size: [100, 100],
        rectFontSize: 12,
        rectFill: "#e1eaff",
        rectStroke: "#99b7fe",
        rectTextColor: "#8d93a2",
        // 圆形属性
        circleText: "C",
        circleFontSize: 20,
        circleFill: "#f8cdac",
        circleStroke: "#2a231e",
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      defaultEdge: {
        shape: "line",
        style: {
          stroke: "#404040",
          lineWidth: 1,
          endArrow: true,
        },
      },
      groupType: "rect",
      groupStyle: {
        default: {
          width: 500,
          minDis: 50,
        },
        hover: {},
        collapse: {},
      },
    });
    const currentFeature = {
      id: repo + featureId,
      label: "当前特性",
      fx: graph._cfg.width / 2,
      fy: graph._cfg.height / 4,
      x: graph._cfg.width / 2,
      y: graph._cfg.height / 4,
      shape: "feature-node",
      nodeType: "feature",
      timeTrack: [],
    };
    getTimeTraceInfo({repo, featureId}).then((result) => {
      setLoadingTrack(true)
      const promises = [] as any;
      const datas = [] as any;

      result.forEach((item: any) => {
        const itemDate = new Date(item.commitTracker.commitTime).getTime();
        item.filePath.forEach((fp: any) => {
          const promise: any = getTrackMethod({
            repoPath: repo,
            filePaths: fp,
            methodName: item.methodName,
            version: version,
            targetCommit: item.commitTracker.commitId,
          }).then((res) => {
            if (res) {
              const newNode: any = Object.values(res)[0];
              if (newNode && newNode.length > 0) {
                const newNodeDate: any = new Date(
                  newNode[0].commitTime
                ).getTime();
                datas.push({
                  ...newNode[0],
                  timeMinus: Math.max(
                    (itemDate - newNodeDate) / (1000 * 60 * 60 * 24),
                    300
                  ),
                  methodName: item.methodName,
                  filePaths: fp,
                });
              }
            }
          });
          promises.push(promise);
        });
      });

      Promise.all(promises).then(() => {
        graph.addItem("node", currentFeature);
        timeMethodNode(currentFeature, datas);
        setLoadingTrack(false)
      });
    });

    graph.on('edge:click', (ev: any) => {
      const itemModel = ev.item.getModel();
      if(ev.x > itemModel.linkRange[0][0] && 
        ev.x < itemModel.linkRange[0][1] && 
        ev.y > itemModel.linkRange[1][0] && 
        ev.y < itemModel.linkRange[1][1]) {
         window.open(`https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=${itemModel.commitId}`)
        }
  });

    function timeMethodNode(itemModel: any, datas: any) {
      let pos = 0;
      for (let i = 0; i < datas.length; i++) {
        const item = datas[i];
        let greenStyle = {
          rectFill: "#d9f5d6",
          rectStroke: "#95e18d",
          circleText: "T",
          circleFill: "#249087",
        } as any;
        if (item.text === null) greenStyle = {};
        const id = item.id + "&" + item.methodName;
        graph.addItem("node", {
          ...item,
          id: id,
          label: `【${item.commitId.slice(0,5)}】\n【${item.version}】\n【${item.company}】\n【${
            item.commitTime.split(" ")[0]
          }】\t${item.text === null ? item.commitTitle : item.text}`,
          x:
            itemModel.x -
            (item.timeMinus > 0 ? 150 : -150) -
            (Math.abs(item.timeMinus) > 500
              ? 500 * (item.timeMinus / item.timeMinus)
              : item.timeMinus),
          y: itemModel.y + 160 * pos,
          ...greenStyle,
        });
        pos++;
        graph.addItem("edge", {
          source: itemModel.id,
          target: id,
          label: `${item.filePaths}: ${item.methodName}`,
          shape: "time-trace-line",
          commitId: item.commitId
        });
      }
    }

    function dependMethodNode(itemModel: any, datas: any) {
      let pos = 1;
      datas.forEach((item: any) => {
        const id = item.id + "&" + item.methodName + "&";
        graph.addItem("node", {
          ...item,
          id: id,
          // label: item.text === null ? item.commitTitle : item.text,
          label: `【${item.commitId.slice(0,5)}】\n【${item.version}】\n【${item.company}】\n【${
            item.commitTime.split(" ")[0]
          }】\t${item.text === null ? item.commitTitle : item.text}`,
          x:
            itemModel.x -
            (Math.abs(item.timeMinus) > 500
              ? 500 * (item.timeMinus / item.timeMinus)
              : item.timeMinus),
          y: itemModel.y - 160 * pos,
          shape: "depend-track-node",
        });
        pos++;
        graph.addItem("edge", {
          source: itemModel.id,
          target: id,
          label: `${item.filePaths}: ${item.methodName}`,
          shape: "depend-trace-line",
          commitId: item.commitId
        });
      });
    }

    function methodNode(itemModel: any, data: any) {
      const id = data.commitId + "&" + data.methodName;
      let greenStyle = {
        rectFill: "#d9f5d6",
        rectStroke: "#95e18d",
        circleText: "T",
        circleFill: "#249087",
      } as any;
      if (data.text === null) greenStyle = {};
      graph.addItem("node", {
        ...data,
        id: id,
        label: `【${data.commitId.slice(0,5)}】\n【${data.version}】\n【${data.company}】\n【${
          data.commitTime.split(" ")[0]
        }】\t${data.text === null ? data.commitTitle : data.text}`,
        x:
          itemModel.x -
          (Math.abs(data.timeMinus) < 120
            ? 120 * (data.timeMinus / data.timeMinus)
            : Math.abs(data.timeMinus) > 500
            ? 500 * (data.timeMinus / data.timeMinus)
            : data.timeMinus),
        y: itemModel.y,
        shape: itemModel.shape,
        ...greenStyle,
      });
      graph.addItem("edge", {
        source: itemModel.id,
        target: id,
        // shape: "time-trace-line",
      });
    }

    return () => {
      graph.destroy();
    };
  }, [featureId]);

  return (
    <Spin spinning={loadingTrack}>
      <div id="graph-container"></div>;
    </Spin>)
};

export default TrackModal;
