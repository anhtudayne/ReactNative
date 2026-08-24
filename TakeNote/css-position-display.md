# CSS — `position` và `display`

## 1. `position`

`position` quyết định **cách một phần tử được định vị trong trang**.

| Giá trị | Trong flow? | `top/right/bottom/left` | Mốc định vị | Đặc điểm |
|---|---|---|---|---|
| `static` | ✅ | ❌ | Flow bình thường | Mặc định |
| `relative` | ✅ | ✅ | Vị trí ban đầu của chính nó | Dịch chuyển nhưng vẫn giữ chỗ cũ |
| `absolute` | ❌ | ✅ | Ancestor gần nhất có `position` khác `static` | Thoát khỏi flow |
| `fixed` | ❌ | ✅ | Viewport | Cố định theo màn hình khi scroll |
| `sticky` | ✅* | ✅ | Vùng scroll/viewport | Bình thường ban đầu, đến ngưỡng thì “dính” |

> `flow` là cách HTML tự sắp xếp các phần tử theo bố cục thông thường.

### `static`

Giá trị mặc định. Phần tử nằm đúng vị trí do flow quyết định.

```css
.box {
  position: static;
}
```

- `top`, `right`, `bottom`, `left` không có tác dụng.

### `relative`

Phần tử vẫn giữ vị trí trong flow nhưng có thể dịch chuyển tương đối so với vị trí ban đầu.

```css
.box {
  position: relative;
  top: 20px;
  left: 10px;
}
```

Điểm quan trọng: `relative` thường được dùng làm **mốc cho phần tử `absolute` bên trong**.

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 0;
  right: 0;
}
```

### `absolute`

Phần tử thoát khỏi flow và được định vị theo ancestor gần nhất có `position` khác `static`. Nếu không có, thường định vị theo containing block ban đầu.

```css
.child {
  position: absolute;
  top: 10px;
  right: 10px;
}
```

Thường dùng cho:
- Badge trên card
- Icon trong ô input
- Phần tử nằm tại góc của một container

### `fixed`

Phần tử thoát khỏi flow và được cố định theo viewport.

```css
.chat-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
```

Khi cuộn trang, phần tử vẫn giữ vị trí trên màn hình.

Thường dùng cho:
- Floating button
- Nút Chat
- Nút Back to top

### `sticky`

Phần tử ban đầu hoạt động như phần tử bình thường trong flow. Khi cuộn đến ngưỡng được đặt bởi `top/right/bottom/left`, nó sẽ dính lại.

```css
.navbar {
  position: sticky;
  top: 0;
}
```

Thường dùng cho:
- Thanh điều hướng
- Header của bảng
- Sidebar

### Cách nhớ `position`

```text
static   → đứng bình thường
relative → dịch chuyển nhưng vẫn giữ chỗ
absolute → thoát flow, bám theo ancestor
fixed    → bám theo màn hình
sticky   → bình thường → scroll đến ngưỡng → dính
```

---

## 2. `display`

`display` quyết định **cách một phần tử được hiển thị và cách các phần tử con được bố trí**.

| Giá trị | Ý nghĩa chính | Điểm cần nhớ |
|---|---|---|
| `block` | Chiếm một dòng riêng | Thường chiếm toàn bộ chiều rộng khả dụng |
| `inline` | Nằm cùng dòng | Phù hợp với nội dung trong dòng |
| `flex` | Layout 1 chiều | Sắp xếp con theo row/column |
| `grid` | Layout 2 chiều | Sắp xếp con theo hàng và cột |
| `none` | Ẩn phần tử | Không chiếm không gian trong layout |

### `display: block`

Phần tử bắt đầu trên dòng mới và thường chiếm toàn bộ chiều rộng khả dụng.

```css
.box {
  display: block;
}
```

Ví dụ mặc định thường gặp: `div`, `p`, `h1`.

```text
A
B
C
```

### `display: inline`

Phần tử nằm cùng dòng với nội dung/phần tử khác.

```css
.text {
  display: inline;
}
```

```text
A B C
```

`width` và `height` không hoạt động theo cách thông thường như với block-level element.

Ví dụ thường gặp: `span`, `a`.

### `display: flex`

Biến phần tử thành **flex container**; các phần tử con trực tiếp trở thành flex items.

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
```

Mặc định, các item được sắp xếp theo chiều ngang (`row`). Có thể đổi sang dọc bằng:

```css
flex-direction: column;
```

Dùng rất nhiều để:
- Căn giữa
- Tạo navbar
- Sắp xếp button/card
- Tạo layout theo một chiều

### `display: grid`

Biến phần tử thành **grid container**, phù hợp với layout hàng + cột.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
```

Ví dụ:

```text
A   B   C
D   E   F
G   H   I
```

Dùng tốt cho:
- Layout trang
- Gallery
- Dashboard
- Card grid

### `display: none`

Ẩn hoàn toàn phần tử khỏi layout.

```css
.box {
  display: none;
}
```

Phần tử không hiển thị và **không chiếm không gian**.

> Khác `visibility: hidden`: phần tử bị ẩn nhưng vẫn giữ vị trí trong layout.

---

## 3. `flex` vs `grid`

| | Flex | Grid |
|---|---|---|
| Tư duy chính | 1 chiều | 2 chiều |
| Phù hợp | Row hoặc Column | Row + Column |
| Ví dụ | Navbar, button group | Dashboard, gallery |

```text
Flex:
A → B → C → D

Grid:
A   B   C
D   E   F
G   H   I
```

> Đây là cách phân biệt ban đầu dễ nhớ; Flex vẫn có thể `wrap`, còn Grid cũng có thể dùng cho layout đơn giản.

---

## 4. `position` và `display` khác nhau thế nào?

Đây là hai khái niệm khác nhau:

- **`position`** → quyết định **phần tử nằm ở đâu và được định vị thế nào**.
- **`display`** → quyết định **phần tử được hiển thị/bố trí theo kiểu nào và cách các phần tử con được sắp xếp**.

Ví dụ:

```css
.card {
  position: relative;
  display: flex;
}
```

Ở đây:
- `position: relative` → `.card` làm mốc để định vị các phần tử `absolute` bên trong.
- `display: flex` → các phần tử con trực tiếp của `.card` được bố trí bằng Flexbox.
