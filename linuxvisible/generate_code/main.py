from generate_react_code import *
from generate_test1 import *

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
        file.write("    return(\n")

    # 一级容器部分
    # def Level1Container(width, height, top, left, maxwidth, maxheight, title):
    generate_left_container()
    
    '''Level1Container(100, 100, 10, 10, 500, 500, "lizhixu1")
    Level1Container(100, 100, 10, 10, 200, 200, "lizhixu2")
    Level1Container(100, 100, 10, 10, 200, 200, "lizhixu3")
    Level1Container(100, 100, 10, 10, 200, 200, "lizhixu4")
    Level1Container(100, 100, 10, 10, 200, 200, "lizhixu5")
    
    Level2Container(100, 100, 10, 10, 300, 300, "kanhaibin1", "lizhixu1")
    Level2Container(100, 100, 10, 10, 100, 100, "kanhaibin2", "lizhixu1")
    Level2Container(100, 100, 10, 10, 100, 100, "kanhaibin3", "lizhixu1")
    Level2Container(100, 100, 10, 10, 100, 100, "kanhaibin4", "lizhixu1")
    Level2Container(100, 100, 10, 10, 100, 100, "kanhaibin5", "lizhixu1")
    Level2Container(100, 100, 10, 10, 100, 100, "kanhaibin6", "lizhixu1")
    Level2Container(100, 100, 10, 10, 100, 100, "kanhaibin7", "lizhixu1")
    Level2Container(100, 100, 10, 10, 100, 100, "kanhaibin8", "lizhixu1")
    Level2Container(100, 100, 10, 10, 100, 100, "kanhaibin9", "lizhixu1")
    Level2Container(100, 100, 10, 10, 100, 100, "kanhaibin10", "lizhixu1")
    Level2Container(100, 200, 10, 10, 100, 200, "kanhaibin11", "lizhixu1")

    Level3Container(100, 100, 10, 10, 50, 50, "wzh3", "kanhaibin1")
    Level3Container(100, 100, 10, 10, 50, 50, "wzh2", "kanhaibin1")
    Level3Container(100, 100, 10, 10, 50, 50, "wzh1", "kanhaibin1")'''

    # 生成tsx文件尾部分
    with open(tsx_path, "a", encoding="utf-8") as file:
        file.write("    )\n}\nexport default Content;\n")