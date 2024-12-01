from generate_react_code import *

if __name__ == "__main__":
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(base_dir, "../src/styles/Content.css")
    tsx_path = os.path.join(base_dir, "../src/pages/content.tsx")

    # 清除已有的css文件
    with open(css_path, "w", encoding="utf-8") as file: 
        file.write("")

    # 生成tsx文件头部分
    with open(tsx_path, "w", encoding="utf-8") as file:
        file.write("import '../styles/Content.css';\n")
        file.write("import '../styles/globle.css';\n\n")
        file.write("const Content:React.FC = () => {\n")
        file.write("    return(\n       <>\n")


    # 一级容器部分
    # def Level1Container(width, height, top, left, maxwidth, maxheight, title):
    Level1Container("Linux", 1050, 600)
    
    # 二级容器部分
    # def Level2Container(width, height, top, left, maxwidth, maxheight, title, belongTo):
    Level2Container("arch", "Linux", 300, 300)
    Level2Container("net", "Linux", 300, 300)
    Level2Container("drivers", "Linux", 300, 175)
    Level2Container("fs", "Linux", 400, 300)
    Level2Container("Memory Management", "Linux", 300, 425)
    Level2Container("kernel", "Linux", 300, 225)
    Level2Container("ipc", "Linux", 75, 50)
    Level2Container("sound", "Linux", 75, 50)
    Level2Container("virt", "Linux", 75, 50)
    Level2Container("security", "Linux", 75, 50)
    Level2Container("init", "Linux", 75, 50)
    Level2Container("crypto", "Linux", 75, 50)
    Level2Container("tool", "Linux", 500, 50)


    # 生成tsx文件尾部分
    with open(tsx_path, "a", encoding="utf-8") as file:
        file.write("        </>\n   )\n}\nexport default Content;\n")