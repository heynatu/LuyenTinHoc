# Lời giải trâu: với mỗi chữ cái, đếm bằng str.count trên đoạn văn đã đổi chữ thường.
import string
import sys

van = sys.stdin.read().lower()
for chu in string.ascii_lowercase:
    so_lan = van.count(chu)
    if so_lan:
        print(chu, so_lan)
