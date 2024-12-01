import os

def generate_left_container():
    # 获取当前脚本文件的目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(base_dir, "../src/styles/Content.css")
    tsx_path = os.path.join(base_dir, "../src/pages/content.tsx")

    with open(tsx_path, "a", encoding="utf-8") as file:
        # tsx文件参数部分
        file.write(f"       <div className=\"design1\">\n")
        file.write(f"           <h2 className=\"design1_title\">设计底图</h2>\n")
        file.write(f"       </div>\n")

    with open(css_path, "a",encoding="utf-8") as file:
        file.write(".design1 {\n")
        file.write("    display: flex;\n")
        file.write("    justify-content: flex-start; /* 使内容靠左 */\n")
        file.write("    align-items: center; /* 垂直居中 */\n")
        file.write("    height: 100vh; /* 设置容器高度为视口高度 */\n")
        file.write("    padding-left: 20px; /* 给容器添加左侧内边距，使文字更靠近左侧 */\n")
        file.write("}\n\n")
        
        # 写入文字样式部分
        file.write(".design1_title {\n")
        file.write("    font-size: 24px;\n")
        file.write("    font-weight: bold;\n")
        file.write("    color: #333;\n")
        file.write("}\n")
    pass