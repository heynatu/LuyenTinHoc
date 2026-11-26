# Lời giải trâu: đổi sang số rồi tách chữ số bằng phép chia (chỉ dùng cho n nhỏ).
n = int(input())
tong = 0
while n > 0:
    tong += n % 10
    n //= 10
print(tong)
