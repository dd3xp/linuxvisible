import os

def Level1Container(width, height, top, left, maxwidth, maxheight, title):
    # 获取当前脚本文件的目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(base_dir, "../src/styles/test.css")
    tsx_path = os.path.join(base_dir, "../src/pages/test.tsx")

    # 处理标题，将标题中的空格变成-（连字符），并增加可视标题变量
    titleWithHyphen = title.replace(" ", "-")
    visibleTitle = titleWithHyphen + "-visible"

    with open(css_path, "a") as file:
        # css文件参数部分
        file.write(f".{titleWithHyphen}")
        file.write("{\n")
        file.write(f"   width: {width}px;\n")
        file.write(f"   height: {height}px;\n")
        file.write(f"   margin-top: {top}px;\n")
        file.write(f"   margin-left: {left}px;\n")
        file.write(f"   max-width: {maxwidth}px;\n")
        file.write(f"   max-height: {maxheight}px;\n")

        # css文件固定部分
        file.write("display: inline-block;\n")
        file.write("flex-wrap: wrap;\n")
        file.write("border: 1px solid #000000;\n")
        file.write("}\n")

    with open(tsx_path, "a") as file:
        # tsx文件参数部分
        file.write(f"       <div className=\"{titleWithHyphen}\">\n")
        file.write(f"           <h2 className=\"{visibleTitle}\">{title}</h2>\n")
        file.write(f"           {{/*The code to declare the subcontainer of {title} will generate right here*/}}\n")
        file.write(f"       </div>\n")
    return

def Level2Container(width, height, top, left, maxwidth, maxheight, title, belongTo):
    return

def Level3Container(width, height, top, left, maxwidth, maxheight, title, belongTo):
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