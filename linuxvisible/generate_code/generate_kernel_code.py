import os
import json

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

def Generate():
    ClearCSSFile()
    CopyTSXFile();

    # 打开并读取 JSON 文件
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(base_dir, "../public/container.json")
    with open(json_path, 'r') as f:
        container_data = json.load(f)

    for container in container_data:
        print(f"container内容：{container}")

        # 识别是否有第七个参数，如果只有1个参数则跳过，因为是注释
        if len(container) == 6:
            GenerateKernelContainer(container[0], container[1], container[2], container[3], container[4], container[5])
        elif len(container) == 7:
            GenerateKernelContainer(container[0], container[1], container[2], container[3], container[4], container[5], container[6])

    print("json文件内容：")
    print(container_data)

    return

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
    css_path = os.path.join(base_dir, "../src/styles/Kernel.css")
    tsx_path = os.path.join(base_dir, "../src/pages/kernel.tsx")
    static_path = os.path.join(base_dir, "../src/pages/staticcontent.tsx")

    if type == "css":
        return css_path
    elif type == "tsx":
        return tsx_path
    elif type == "static":
        return static_path

def GenerateTSXCode(title, level, belong_to):
    # 处理标题
    title_with_hyphen = title.replace(" ", "-")
    parent_with_hyphen = belong_to.replace(" ", "-")

    container_tsx = f'''
        <div className=\"{title_with_hyphen} level-{level}-container {parent_with_hyphen}-{level}\">
            <div className=\"level-{level}-title {parent_with_hyphen}-title\">{title}</div>
        </div>'''
    kernel_tsx = f'''
        <div
        className={{`{title_with_hyphen} level-{level}-container {parent_with_hyphen}-{level} ${{selected === \"{title_with_hyphen}\" ? 'selected' : ''}}`}}
        onClick={{(e) => handleClick('{title_with_hyphen}', e)}}
        >
            <div className=\"level-{level}-title {parent_with_hyphen}-title\">{title}</div>
        </div>'''

    # 写tsx文件
    tsx_path = LocateFiles("tsx")
    target = f"<>"

    with open(tsx_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    # 寻找目标字符串，并在其后插入内容
    for i, line in enumerate(lines):
        if target in line:
            # 非内核组件容器
            if level != 3:
                lines.insert(i + 1, container_tsx + '\n')
            else:
                lines.insert(i + 1, kernel_tsx + '\n')
            break
    
    # 将修改后的内容写回文件
    with open(tsx_path, 'w', encoding='utf-8') as file:
        file.writelines(lines)
    return

def GenerateCSSCode(title, position):
    # 处理标题
    title_with_hyphen = title.replace(" ", "-")

    # css文件内容
    css = f'''.{title_with_hyphen}
{{
top: {position[0]}px;
bottom: {position[1]}px;
left: {position[2]}px;
right: {position[3]}px;
}}
'''

    # 写css文件
    with open(LocateFiles("css"), "a", encoding="utf-8") as file:
        # css文件参数部分
        file.write(css)
    return

# 计算css中的top、bottom、left、right
def Position(coordinate, margin, belong_to, level):
    condition_margin = level + 3
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

def ClearCSSFile():
    css_path = LocateFiles("css")
    with open(css_path, "w", encoding="utf-8") as file: 
        file.write("")
    return

def CopyTSXFile():
    static_path = LocateFiles("static")
    tsx_path = LocateFiles("tsx")

    try:
        with open(static_path, 'r', encoding='utf-8') as source_file:
            with open(tsx_path, 'w', encoding='utf-8') as target_file:
                for line in source_file:
                    target_file.write(line)  # 逐行写入
        print(f"文件内容从 '{static_path}' 成功复制到 '{tsx_path}'")
    except Exception as e:
        print(f"操作出错：{e}")
