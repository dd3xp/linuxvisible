from generate_react_code import *

if __name__ == "__main__":
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(base_dir, "../src/styles/test.css")
    tsx_path = os.path.join(base_dir, "../src/pages/test.tsx")

    # 清除已有的css文件
    with open(css_path, "w") as file: 
        file.write("")

    # 生成tsx文件头部分
    with open(tsx_path, "w") as file:
        file.write("import '../styles/Test.css';\n")
        file.write("import '../styles/globle.css';\n\n")
        file.write("export default function Home() {\n")
        file.write("    return (\n      <>\n")

    # 一级容器部分
    # def Level1Container(width, height, top, left, maxwidth, maxheight, title):
    Level1Container(100, 100, 10, 10, 500, 500, "lizhixu1")
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
    Level2Container(100, 100, 10, 10, 100, 100, "kanhaibin11", "lizhixu1")

    Level3Container(100, 100, 10, 10, 50, 50, "wzh3", "kanhaibin1")
    Level3Container(100, 100, 10, 10, 50, 50, "wzh2", "kanhaibin1")
    Level3Container(100, 100, 10, 10, 50, 50, "wzh1", "kanhaibin1")

    # 生成tsx文件尾部分
    with open(tsx_path, "a") as file:
        file.write("      </>\n   )\n}")