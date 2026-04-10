# Design System

## Visual Thesis

首页像一张黑金克制的品牌海报，内页像一本浅色出版物。高级感来自比例、留白、材质与排版，而不是装饰数量。

## Design Tokens

### Color

- `--home-bg`: `#090806`
- `--home-bg-deep`: `#14100d`
- `--home-text`: `#f4ede0`
- `--home-soft`: `rgba(244, 237, 224, 0.76)`
- `--page-bg`: `#f6f1e8`
- `--page-bg-deep`: `#eee6d8`
- `--surface-strong`: `rgba(255, 252, 246, 0.76)`
- `--surface-soft`: `rgba(255, 252, 246, 0.42)`
- `--surface-muted`: `rgba(222, 214, 199, 0.2)`
- `--text-strong`: `#171411`
- `--text-soft`: `rgba(23, 20, 17, 0.8)`
- `--text-muted`: `rgba(23, 20, 17, 0.58)`
- `--accent-soft`: `rgba(194, 155, 92, 0.3)`
- `--accent-strong`: `#8c6633`
- `--accent-wash`: `rgba(201, 164, 108, 0.12)`
- `--border-subtle`: `rgba(39, 30, 20, 0.12)`
- `--border-strong`: `rgba(198, 167, 115, 0.32)`

### Typography

- `--font-display`: `Cormorant Garamond`, `Noto Serif SC`, serif
- `--font-body`: `Noto Serif SC`, `Songti SC`, `Source Han Serif SC`, serif
- `--font-ui`: `Manrope`, sans-serif

### Spacing

- 首页大段间距：`5rem` 到 `6rem`
- 内页段间距：`3rem` 到 `4rem`
- 面板内边距：`1.5rem` 到 `2rem`
- 阅读段落节奏：`1.2rem` 块间距

### Radius

- 主面板：`1.75rem`
- 胶囊按钮：`999px`

### Shadow

- `--shadow-soft`: `0 26px 80px rgba(18, 14, 10, 0.08)`

### Border

- 默认分隔：`1px solid var(--border-subtle)`
- 首页深色面板：低对比暖金边

### Motion

- hover: `240ms`
- entrance: `0.8s` 左右
- ambient: `18s` 呼吸级循环

## Theme Rules

- 首页使用深色品牌主题，允许金属高光、低频流动与更强的大字层级。
- 内页切回浅色纸张主题，去掉强光感，只保留结构边缘与阅读秩序。
- 金色只作为焦点与结构强调，不用于大面积铺色。

