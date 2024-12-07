import os

kernel_list = {}

# 单元化网格
linux_size = [1100, 650]
grid_size = 50
col_amount = linux_size[0] / grid_size
row_amount = linux_size[1] / grid_size

# 设置边距
level_1_margin = 3
level_2_margin = 6
level_3_margin = 8
title_size = 8

def GenerateKernelContainer(title, level, x1, y1, x2, y2, belong_to = "linux"):
    # 将坐标信息添加到字典中
    coordinate = [x1, y1, x2, y2]
    kernel_list[title] = coordinate

    # 处理标题
    title_with_hyphen = title.replace(" ", "-")
    visible_title = title_with_hyphen + "-visible"

    # 算出相对大容器的位置
    margin = MarginDefine(level)
    position = Position(coordinate, margin, belong_to, level)

    # 获取当前脚本文件的目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(base_dir, "../src/styles/Content.css")
    tsx_path = os.path.join(base_dir, "../src/pages/content.tsx")

    # tsx文件
    with open(tsx_path, "a", encoding="utf-8") as file:
    # tsx文件参数部分
        file.write(f"       <div className=\"{title_with_hyphen} level-{level}-container\">\n")
        file.write(f"           <div className=\"{visible_title}\">{title}</div>\n")
        file.write(f"       </div>\n")

    # css文件
    with open(css_path, "a", encoding="utf-8") as file:
        # css文件参数部分
        file.write(f".{title_with_hyphen}")
        file.write("{\n")
        file.write(f"   top: {position[0]}px;\n")
        file.write(f"   bottom: {position[1]}px;\n")
        file.write(f"   left: {position[2]}px;\n")
        file.write(f"   right: {position[3]}px;\n")
        file.write("}\n")

    print(kernel_list)
    return

# 计算css中的top、bottom、left、right
def Position(coordinate, margin, belong_to, level):
    # 设置标题间距
    if belong_to != "linux":
        parents_coordinate = kernel_list.get(belong_to)
        if coordinate[0] == parents_coordinate[0]:
            top_margin = margin + title_size * (level - 1)
        else:
            top_margin = margin
    else:
        top_margin = margin

    # top
    top = coordinate[0] * grid_size + top_margin
    # bottom
    bottom = (row_amount - coordinate[2] - 1) * grid_size + margin
    # left
    left = coordinate[1] * grid_size + margin
    # right
    right = (col_amount - coordinate[3] - 1) * grid_size + margin

    position = [top, bottom, left, right]
    return position

# 决定容器的边距
def MarginDefine(level):
    if level == 1:
        margin = level_1_margin
    elif level == 2:
        margin = level_2_margin
    elif level == 3:
        margin = level_3_margin
    else:
        print("Invalid level input!!!")
    return margin
