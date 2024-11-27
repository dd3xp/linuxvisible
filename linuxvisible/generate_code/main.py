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

    Level1Container(100, 100, 10, 10, 200, 200, "lizhixu1")
    Level1Container(100, 100, 10, 10, 200, 200, "lizhixu2")
    Level1Container(100, 100, 10, 10, 200, 200, "lizhixu3")
    Level1Container(100, 100, 10, 10, 200, 200, "lizhixu4")
    Level1Container(100, 100, 10, 10, 200, 200, "lizhixu5")

    # 生成tsx文件尾部分
    with open(tsx_path, "a") as file:
        file.write("      </>\n   )\n}")