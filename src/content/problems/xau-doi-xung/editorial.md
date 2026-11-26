---
timeComplexity: O(|S|)
memoryComplexity: O(|S|)
---

## Phân tích

Chuẩn hóa trước: giữ các ký tự khác dấu cách và đổi về chữ thường. Sau đó dùng hai con trỏ `i` từ đầu, `j` từ cuối, gặp cặp khác nhau thì kết luận `NO`.

Hai lỗi hay gặp:

- Dùng `input()` mà file có ký tự `\r` ở cuối dòng (file soạn trên Windows): ký tự này bị coi là một phần của câu. Hãy bỏ `\r` hoặc chỉ giữ chữ cái và chữ số.
- Quên đổi chữ hoa thành chữ thường, nên `Aba` bị kết luận sai.

Chỉ số trong giả mã bắt đầu từ 0.

## Giả mã

```pseudo
NHẬP câu S
T ← các ký tự của S khác dấu cách, đổi về chữ thường
i ← 0; j ← độ dài T - 1
TRONG KHI i < j LÀM
    NẾU T[i] ≠ T[j] THÌ XUẤT "NO" và DỪNG
    i ← i + 1; j ← j - 1
HẾT KHI
XUẤT "YES"
```

## Mở rộng

- Tìm số ký tự ít nhất cần chèn để câu trở thành đối xứng (quy hoạch động trên xâu).
