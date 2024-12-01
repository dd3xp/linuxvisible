import os

def Level1Container(width, height, top, left, maxwidth, maxheight, title):
    # 获取当前脚本文件的目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(base_dir, "../src/styles/Content.css")
    tsx_path = os.path.join(base_dir, "../src/pages/content.tsx")

    # 处理标题，将标题中的空格变成-（连字符），并增加可视标题变量
    titleWithHyphen = title.replace(" ", "-")
    visibleTitle = titleWithHyphen + "-visible"

    with open(css_path, "a", encoding="utf-8") as file:
        # css文件参数部分
        file.write(f".{titleWithHyphen}")
        file.write("{\n")
        file.write(f"   min-width: {width}px;\n")
        file.write(f"   min-height: {height}px;\n")
        file.write(f"   margin-top: {top}px;\n")
        file.write(f"   margin-left: {left}px;\n")
        file.write(f"   max-width: {maxwidth}px;\n")
        file.write(f"   max-height: {maxheight}px;\n")

        # css文件固定部分
        file.write(f"   width: auto;\n")
        file.write(f"   height: auto;\n")
        file.write("    display: inline-block;\n")
        file.write("    flex-wrap: wrap;\n")
        file.write("    border: 1px solid #000000;\n")
        file.write("}\n")

    with open(tsx_path, "a", encoding="utf-8") as file:
        # tsx文件参数部分
        file.write(f"       <div className=\"{titleWithHyphen}\">\n")
        file.write(f"           <h2 className=\"{visibleTitle}\">{title}</h2>\n")
        file.write(f"           {{/*The code to declare the subcontainer of {title} will generate right here*/}}\n")
        file.write(f"       </div>\n")
    return



def Level2Container(width, height, top, left, maxwidth, maxheight, title, belongTo):
    # 获取当前脚本文件的目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(base_dir, "../src/styles/content.css")
    tsx_path = os.path.join(base_dir, "../src/pages/content.tsx")

    # 处理标题，将标题中的空格变成-（连字符），并增加可视标题变量
    titleWithHyphen = title.replace(" ", "-")
    visibleTitle = titleWithHyphen + "-visible"

    with open(css_path, "a", encoding="utf-8") as file:
        # css文件参数部分
        file.write(f".{titleWithHyphen}")
        file.write("{\n")
        file.write(f"   min-width: {width}px;\n")
        file.write(f"   min-height: {height}px;\n")
        file.write(f"   margin-top: {top}px;\n")
        file.write(f"   margin-left: {left}px;\n")
        file.write(f"   max-width: {maxwidth}px;\n")
        file.write(f"   max-height: {maxheight}px;\n")

        # css文件固定部分
        file.write(f"   width: auto;\n")
        file.write(f"   height: auto;\n")
        file.write("    display: inline-block;\n")
        file.write("    flex-wrap: wrap;\n")
        file.write("    border: 1px dashed #000000;\n")
        file.write("}\n")

    # 定位容器摆放位置
    target_line = f"{{/*The code to declare the subcontainer of {belongTo} will generate right here*/}}"

    with open(tsx_path, "r+", encoding="utf-8") as file:
        # 找到插入组件的位置
        lines = file.readlines()
        file.seek(0)

        # tsx文件参数部分
        for line in lines:
            file.write(line)
            if target_line in line:
                file.write(f"           <div className=\"{titleWithHyphen}\">\n")
                file.write(f"               <h3 className=\"{visibleTitle}\">{title}</h3>\n")
                file.write(f"               {{/*The code to declare the subcontainer of {title} will generate right here*/}}\n")
                file.write(f"           </div>\n")
    return

def Level3Container(width, height, top, left, maxwidth, maxheight, title, belongTo):
    # 获取当前脚本文件的目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(base_dir, "../src/styles/content.css")
    tsx_path = os.path.join(base_dir, "../src/pages/content.tsx")
    # 处理标题，将标题中的空格变成-（连字符），并增加可视标题变量
    titleWithHyphen = title.replace(" ", "-")
    visibleTitle = titleWithHyphen + "-visible"

    with open(css_path, "a", encoding="utf-8") as file:
        # css文件参数部分
        file.write(f".{titleWithHyphen}")
        file.write("{\n")
        file.write(f"   min-width: {width}px;\n")
        file.write(f"   min-height: {height}px;\n")
        file.write(f"   margin-top: {top}px;\n")
        file.write(f"   margin-left: {left}px;\n")
        file.write(f"   max-width: {maxwidth}px;\n")
        file.write(f"   max-height: {maxheight}px;\n")

        # css文件固定部分
        file.write(f"   width: auto;\n")
        file.write(f"   height: auto;\n")
        file.write("    display: inline-block;\n")
        file.write("    flex-wrap: wrap;\n")
        file.write("    border: 1px dashed #000000;\n")
        file.write("}\n")

    # 定位容器摆放位置
    target_line = f"{{/*The code to declare the subcontainer of {belongTo} will generate right here*/}}"

    with open(tsx_path, "r+", encoding="utf-8") as file:
        # 找到插入组件的位置
        lines = file.readlines()
        file.seek(0)

        # tsx文件参数部分
        for line in lines:
            file.write(line)
            if target_line in line:
                file.write(f"                   <div className=\"{titleWithHyphen}\">\n")
                file.write(f"                       <h4 className=\"{visibleTitle}\">{title}</h4>\n")
                file.write(f"                       {{/*The code to declare the subcontainer of {title} will generate right here*/}}\n")
                file.write(f"                   </div>\n")
    return

def KernelContainer(width, height, top, left, maxwidth, maxheight, title, belongTo):
    return

# 用于生成在内部划分不同孩子种类的标题，而不是总标题
def Level1Title(width, height, top, left, title, belongTo):
    return

def Level2Title(width, height, top, left, title, belongTo):
    return

def Level3Title(width, height, top, left, title, belongTo):
    return