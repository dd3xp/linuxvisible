declare global {
  interface Window {
    G6: any;
  }
}

export const G6 = typeof window !== "undefined" ? window.G6 : null;
// 注册节点
export const registerNodes = () => {
  if (!G6) return; // 确保 G6 存在
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx!.font = "16px Arial"; // 设置字体，可根据需要修改
  const companySet = new Set([
    "amazon",
    "arm",
    "bytedance",
    "chromium",
    "google",
    "hisilicon",
    "huawei",
    "ibm",
    "intel",
    "linux",
    "microsoft",
    "nvidia",
    "oppo",
    "oracle",
    "redhat",
    "suse",
    "tencent",
    "ubuntu",
    "yandex",
    "zte",
  ]);
  G6.registerNode("time-track-node", {
    draw(cfg: any, group: any) {
      // 绘制矩形
      const rect = group.addShape("rect", {
        attrs: {
          x: 10,
          y: 10,
          width: cfg.size[0] * 1.4,
          height: cfg.size[1] * 1.2,
          fill: cfg.rectFill,
          stroke: cfg.rectStroke,
          lineWidth: 2,
          radius: 5,
        },
      });

      const str = cfg.label;
      if (str) {
        const strArr = str.split('\t');
        let textLine = '';
        const verText = strArr[0].split('\n');
        verText.forEach((item: any) => {
          while(item.length > 18) {
            textLine += item.slice(0, 18) + '\n'
            item = item.slice(18)
          }
          textLine += item + '\n'
        })
        let text = strArr[1];
        while(text.length > 18) {
          textLine += text.slice(0, 18) + '\n'
          text = text.slice(18)
          if(text[0] == ' ') text = text.slice(1)
        }
        textLine += text
        const arr = textLine.split("\n");
        let yPos = rect._attrs.y + Math.min(rect._attrs.width, rect._attrs.height) / 8 + 7;
        cfg.linkRange = [[cfg.x + 10, cfg.x + 75],[cfg.y + 20, cfg.y + 40]]
        for(let i = 0; i < Math.min(arr.length, 7); i++){
          if(arr.length > 7 && i === 6) arr[i] += '...'
          group.addShape("text", {
            attrs: {
              x: rect._attrs.x + 5,
              y: yPos,
              text: arr[i],
              fontSize: 12,
              fill: i === 0 ? "blue": "#404040",
              textAlign: "left",
              textBaseline: "middle",
            },
          });
          yPos += 15
        }
      }

      if (companySet.has(cfg.company.split(".")[0])) {
        const img = new Image();
        img.src = `\CompanyLogoAsset\\${cfg.company.split(".")[0]}.png`; // 替换为你的图片路径
        img.onload = function () {
          canvas.width = img.width;
          canvas.height = img.height;
          const size = canvas.width / canvas.height;
          const radius = Math.min(canvas.width, canvas.height) / 2;

          ctx!.beginPath();
          ctx!.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
          ctx!.closePath();
          ctx!.clip();

          ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);

          const newImg = new Image();
          newImg.src = canvas.toDataURL(cfg.imagePath);
          const i = group.addShape("image", {
            attrs: {
              x: (-Math.min(rect._attrs.width, rect._attrs.height) / 8) * 0.5,
              y: 0,
              width: (Math.min(rect._attrs.width, rect._attrs.height) / 8) * 3,
              height:
                ((Math.min(rect._attrs.width, rect._attrs.height) / 8) * 3) /
                size,
              img: newImg,
            },
          });
          // 绘制圆形
          group.addShape("circle", {
            attrs: {
              x: (rect._attrs.x / 2) * 3,
              y: -rect._attrs.y / 2 + 20,
              r: Math.max(i._attrs.width, i._attrs.height) / 3,
              stroke: cfg.circleStroke,
              lineWidth: 2,
            },
          });
        };
      } else {
        // 绘制圆形
        const circle = group.addShape("circle", {
          attrs: {
            x: (rect._attrs.x / 2) * 3,
            y: -rect._attrs.y / 2 + 20,
            r: Math.min(rect._attrs.width, rect._attrs.height) / 8,
            fill: cfg.circleFill,
            stroke: cfg.circleStroke,
            lineWidth: 2,
          },
        });
        // 在圆形内添加文字
        group.addShape("text", {
          attrs: {
            x: circle._attrs.x - cfg.circleFontSize * 0.4,
            y: circle._attrs.y + 2,
            text: cfg.company[0].toUpperCase(),
            fontSize: cfg.circleFontSize,
            fill: "#404040",
            textAlign: "left",
            textBaseline: "middle",
          },
        });
      }

      return rect;
    },
  });

  G6.registerNode("depend-track-node", {
    draw(cfg: any, group: any) {
      // 绘制矩形
      const rect = group.addShape("rect", {
        attrs: {
          x: 10,
          y: 10,
          width: cfg.size[0],
          height: cfg.size[1],
          fill: cfg.rectFill,
          stroke: cfg.rectStroke,
          lineWidth: 2,
          radius: 5,
        },
      });

      const str = cfg.label;
      if (str) {
        const strArr = str.split('\t');
        let textLine = '';
        const verText = strArr[0].split('\n');
        verText.forEach((item: any) => {
          while(item.length > 14) {
            textLine += item.slice(0, 14) + '\n'
            item = item.slice(14)
          }
          textLine += item + '\n'
        })
        let text = strArr[1];
        while(text.length > 14) {
          textLine += text.slice(0, 14) + '\n'
          text = text.slice(14)
          if(text[0] == ' ') text = text.slice(1)
        }
        textLine += text
        const arr = textLine.split("\n");
        let yPos = rect._attrs.y + 15;
        cfg.linkRange = [[cfg.x + 10, cfg.x + 75],[cfg.y + 20, cfg.y + 40]]
        for(let i = 0; i < Math.min(arr.length, 6); i++){
          if(arr.length > 6 && i === 5) arr[i] += '...'
          group.addShape("text", {
            attrs: {
              x: rect._attrs.x + 5,
              y: yPos,
              text: arr[i],
              fontSize: 12,
              fill: i === 0 ? "blue": "#404040",
              textAlign: "left",
              textBaseline: "middle",
            },
          });
          yPos += 15
        }
      }
      return rect;
    },
  });


  G6.registerNode("feature-node", {
    draw(cfg: any, group: any) {
      const rect = group.addShape("rect", {
        attrs: {
          x: 20,
          y: 35,
          width: 100,
          height: 50,
          fill: "#f76964",
          lineWidth: 2,
          radius: 5,
        },
      });

      let str = cfg.label;
      let fontSize = 20;
      let fontWidth = fontSize * 1.2; //字号+边距
      let lineNum = Math.floor((rect._attrs.width * 2 - 10) / fontWidth); // 一行能展示多少字
      let result =
        str.length > lineNum ? str.substring(0, lineNum - 1) + "..." : str;

      // 在矩形内添加文字
      group.addShape("text", {
        attrs: {
          x: rect._attrs.x + rect._attrs.width / 2,
          y: rect._attrs.y + rect._attrs.height / 2,
          text: result,
          fontSize: 20,
          fill: "#fff",
          textAlign: "center",
          textBaseline: "middle",
        },
      });
      return rect;
    },
  });
};

// 注册自定义边
export const registerEdges = () => {
  if (!G6) return; // 确保 G6 存在
  // 水平方向的边
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx!.font = "16px Arial";
  G6.registerEdge("time-trace-line", {
    draw(cfg: any, group: any) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;
      const firstX = startPoint.x + (endPoint.x > startPoint.x ? 100 : -100);
      const path = [
        ["M", startPoint.x, startPoint.y],
        ["L", firstX, startPoint.y],
        ["L", firstX, endPoint.y],
        ["L", endPoint.x, endPoint.y],
      ];

      const edgeL = group.addShape("path", {
        attrs: {
          stroke: "#404040",
          lineWidth: 1,
          path: path,
          endArrow: true,
        },
      });

      const str = cfg.label;
      if (str) {
        const maxWidth = firstX - endPoint.x - 30;
        let textLine = "";
        let labelWidth = 0;
        let rWidth = 0;
        str.split(" ").forEach((item: string) => {
          if (ctx!.measureText(item).width > maxWidth) {
            let itWidth: number = 0;
            textLine += "\n";
            [...item].forEach((it: string) => {
              if (itWidth + ctx!.measureText(it).width <= maxWidth) {
                textLine += it;
                itWidth += ctx!.measureText(it).width;
                rWidth = Math.max(rWidth, itWidth);
              } else {
                textLine += "\n" + it;
                rWidth = Math.max(rWidth, itWidth);
                itWidth = ctx!.measureText(it).width;
              }
            });
          } else if (labelWidth + ctx!.measureText(item).width > maxWidth) {
            rWidth = Math.max(rWidth, labelWidth);
            textLine += "\n" + item + " ";
            labelWidth = ctx!.measureText(item).width;
          } else if (labelWidth + ctx!.measureText(item).width <= maxWidth) {
            rWidth = Math.max(rWidth, labelWidth);
            textLine += item + " ";
            labelWidth += ctx!.measureText(item).width;
          }
        });
        rWidth = Math.max(rWidth, labelWidth);
        const h = textLine.split("\n").length * 15;
        group.addShape("rect", {
          attrs: {
            x: endPoint.x + 15,
            y: endPoint.y - h / 2,
            width: Math.min(maxWidth, rWidth),
            height: h,
            fill: "#fff",
          },
        });
        cfg.linkRange = [[endPoint.x + 15,  endPoint.x + 15 + Math.min(maxWidth, rWidth)],[endPoint.y - h / 2, endPoint.y + h / 2]]
        group.addShape("text", {
          attrs: {
            x: endPoint.x + 30,
            y: endPoint.y + h / 2 - 1,
            text: textLine,
            fontSize: 12,
            fill: "#404040",
          },
        });
      }
      return edgeL;
    },
  });
  // 垂直方向的边
  G6.registerEdge("depend-trace-line", {
    draw(cfg: any, group: any) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;
      const path = [
        ["M", startPoint.x, startPoint.y],
        ["L", startPoint.x, endPoint.y],
        ["L", endPoint.x, endPoint.y],
      ];
      const edgeL = group.addShape("path", {
        attrs: {
          stroke: "#404040",
          lineWidth: 1,
          path: path,
          endArrow: true,
        },
      });
      const str = cfg.label;
      if (str) {
        const maxWidth = startPoint.x - endPoint.x - 30;
        let textLine = "";
        let labelWidth = 0;
        let rWidth = 0;
        str.split(" ").forEach((item: string) => {
          if (ctx!.measureText(item).width > maxWidth) {
            let itWidth: number = 0;
            textLine += "\n";
            [...item].forEach((it: string) => {
              if (itWidth + ctx!.measureText(it).width <= maxWidth) {
                textLine += it;
                itWidth += ctx!.measureText(it).width;
                rWidth = Math.max(rWidth, itWidth);
              } else {
                textLine += "\n" + it;
                rWidth = Math.max(rWidth, itWidth);
                itWidth = ctx!.measureText(it).width;
              }
            });
          } else if (labelWidth + ctx!.measureText(item).width > maxWidth) {
            rWidth = Math.max(rWidth, labelWidth);
            textLine += "\n" + item + " ";
            labelWidth = ctx!.measureText(item).width;
          } else if (labelWidth + ctx!.measureText(item).width <= maxWidth) {
            rWidth = Math.max(rWidth, labelWidth);
            textLine += item + " ";
            labelWidth += ctx!.measureText(item).width;
          }
        });
        rWidth = Math.max(rWidth, labelWidth);
        const h = textLine.split("\n").length * 15;
        group.addShape("rect", {
          attrs: {
            x: endPoint.x + 15,
            y: endPoint.y - h / 2,
            width: Math.min(maxWidth, rWidth),
            height: h,
            fill: "#fff",
          },
        });
        cfg.linkRange = [[endPoint.x + 15,  endPoint.x + 15 + Math.min(maxWidth, rWidth)],[endPoint.y - h / 2, endPoint.y + h / 2]]
        group.addShape("text", {
          attrs: {
            x: endPoint.x + 30,
            y: endPoint.y + h / 2 - 1,
            text: textLine,
            fontSize: 12,
            fill: "#404040",
          },
        });
      }
      return edgeL;
    },
  });
};

export default G6;
