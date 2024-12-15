import os

# 单元化网格
linux_size = [1100, 650]
grid_size = 50
col_amount = linux_size[0] / grid_size
row_amount = linux_size[1] / grid_size
max_level = 3

# 设置边距
level_1_margin = 5
level_2_margin = 7.25
level_3_margin = 9.5
title_size = 10

# 组件字典
kernel_list = {"linux": [0, 0, row_amount - 1, col_amount - 1]}

def GenerateKernelContainer(title, level, x1, y1, x2, y2, belong_to = "linux"):
    # 将坐标信息添加到字典中
    coordinate = [x1, y1, x2, y2]
    kernel_list[title] = coordinate

    # 算出相对大容器的位置
    margin = MarginDefine(level)
    position = Position(coordinate, margin, belong_to, level)

    # 生成两个所需的文件
    GenerateTSXCode(title, level, belong_to)
    GenerateCSSCode(title, position)

    print(kernel_list)
    return

def LocateFiles(type):
    # 确定文件位置
    # 获取当前脚本文件的目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(base_dir, "../src/styles/Content.css")
    tsx_path = os.path.join(base_dir, "../src/pages/content.tsx")

    if type == "css":
        return css_path
    elif type == "tsx":
        return tsx_path

def GenerateTSXCode(title, level, belong_to):
    # 处理标题
    title_with_hyphen = title.replace(" ", "-")
    parent_with_hyphen = belong_to.replace(" ", "-")

    # tsx文件
    with open(LocateFiles("tsx"), "a", encoding="utf-8") as file:
    # tsx文件参数部分
        file.write(f"       <div className=\"{title_with_hyphen} level-{level}-container {parent_with_hyphen}-{level}\">\n")
        file.write(f"           <div className=\"level-{level}-title {parent_with_hyphen}-title\">{title}</div>\n")
        file.write(f"       </div>\n")

    return

def GenerateCSSCode(title, position):
    # 处理标题
    title_with_hyphen = title.replace(" ", "-")

    # css文件
    with open(LocateFiles("css"), "a", encoding="utf-8") as file:
        # css文件参数部分
        file.write(f".{title_with_hyphen}")
        file.write("{\n")
        file.write(f"   top: {position[0]}px;\n")
        file.write(f"   bottom: {position[1]}px;\n")
        file.write(f"   left: {position[2]}px;\n")
        file.write(f"   right: {position[3]}px;\n")
        file.write("}\n")
    
    return

# 计算css中的top、bottom、left、right
def Position(coordinate, margin, belong_to, level):
    condition_margin = level + 2
    parents_coordinate = kernel_list.get(belong_to)

    print(f"parents: {parents_coordinate}\ncoordinate: {coordinate}")
    
    # 设置标题间距
    if belong_to != "linux":
        if coordinate[0] == parents_coordinate[0]:
            top_margin = margin + title_size * (level - 1)
        else:
            top_margin = margin
    else:
        top_margin = margin

    # top
    top = coordinate[0] * grid_size + top_margin - condition_margin
    # bottom
    bottom = (row_amount - coordinate[2] - 1) * grid_size + margin - condition_margin
    # left
    left = coordinate[1] * grid_size + margin - condition_margin
    # right
    right = (col_amount - coordinate[3] - 1) * grid_size + margin - condition_margin

    # 检查是否靠上边
    if coordinate[0] == parents_coordinate[0]:
        top = top + condition_margin
    
    # 检查是否靠下边
    if coordinate[2] == parents_coordinate[2]:
        bottom = bottom + condition_margin
    
    # 检查是否靠左边
    if coordinate[1] == parents_coordinate[1]:
        left = left + condition_margin
        
    # 检查是否靠右边
    if coordinate[3] == parents_coordinate[3]:
        right = right + condition_margin

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

