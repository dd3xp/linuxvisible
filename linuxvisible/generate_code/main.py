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
    GenerateKernelContainer("tool", 1, 0, 0, 1, 9)
    GenerateKernelContainer("test", 2, 0, 0, 0, 0, "tool")
    GenerateKernelContainer("test2", 3, 0, 0, 0, 0, "test")
    GenerateKernelContainer("crypto", 1, 0, 10, 1, 11)
    GenerateKernelContainer("init", 1, 0, 12, 1, 13)
    GenerateKernelContainer("security", 1, 0, 14, 1, 15)
    GenerateKernelContainer("virt", 1, 0, 16, 1, 17)
    GenerateKernelContainer("sound", 1, 0, 18, 1, 19)
    GenerateKernelContainer("ipc", 1, 0, 20, 1, 21)
    GenerateKernelContainer("test3", 2, 0, 20, 1, 21, "ipc")
    GenerateKernelContainer("test4", 3, 0, 20, 1, 21, "test3")
    GenerateKernelContainer("kernel", 1, 2, 0, 7, 6)
    GenerateKernelContainer("Memory Menagement", 1, 2, 7, 10, 13)
    GenerateKernelContainer("fs", 1, 2, 14, 8, 21)
    GenerateKernelContainer("drivers", 1, 8, 0, 12, 6)
    GenerateKernelContainer("arch", 1, 11, 7, 12, 21)
    GenerateKernelContainer("net", 1, 9, 14, 10, 21)

    # 生成tsx文件尾部分
    with open(tsx_path, "a", encoding="utf-8") as file:
        file.write("        </>\n   )\n}\nexport default Content;\n")