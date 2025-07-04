from collections import defaultdict
from . import folder

def build_folder_tree(folders):
    by_parent = defaultdict(list)
    for folder in folders:
        by_parent[folder.parent_id].append(folder)
    return by_parent

def print_folder_tree(by_parent, parent_id=None, depth=0):
    for folder in by_parent[parent_id]:
        indent = "  " * depth
        print(f"{indent}- 📁 {folder.name}")

        # Print decks inside this folder
        for deck in folder.decks:
            print(f"{indent}  - 📚 {deck.name}")

        # Recurse into subfolders
        print_folder_tree(by_parent, folder.id, depth + 1)

def print_all(folders):
    folder_tree = build_folder_tree(folders)
    print_folder_tree(folder_tree)
