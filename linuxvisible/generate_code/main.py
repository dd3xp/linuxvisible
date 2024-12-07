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

    # GenerateKernelContainer(title, level, x1, y1, x2, y2, belong_to = "linux")
    GenerateKernelContainer("lizhixu", 1, 0, 0, 5, 5)
    GenerateKernelContainer("kanhaibin", 2, 0, 0, 5, 5, "lizhixu")
    GenerateKernelContainer("wangzhihui1", 3, 0, 0, 0, 0, "kanhaibin")
    GenerateKernelContainer("wangzhihui2", 3, 0, 1, 0, 1, "kanhaibin")
    GenerateKernelContainer("wangzhihui3", 3, 0, 2, 0, 2, "kanhaibin")
    GenerateKernelContainer("wangzhihui4", 3, 0, 3, 0, 3, "kanhaibin")
    GenerateKernelContainer("wangzhihui5", 3, 1, 0, 5, 1, "kanhaibin")
    GenerateKernelContainer("wangzhihui4", 3, 2, 2, 3, 5, "kanhaibin")
    GenerateKernelContainer("wangzhihui6", 3, 1, 2, 1, 2, "kanhaibin")

    # 生成tsx文件尾部分
    with open(tsx_path, "a", encoding="utf-8") as file:
        file.write("        </>\n   )\n}\nexport default Content;\n")