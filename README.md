# K & L · 情侣小站

为 **ktllkyll0615.cn** 准备的情侣网站，纯静态页面（HTML + CSS + JS），无需后端，任何支持静态文件的服务器都能跑。

---

## 一、先改专属信息（3 分钟搞定）

打开 `main.js`，最顶上的 `CONFIG` 就是你们的专属配置：

| 配置项 | 说明 |
| --- | --- |
| `names.a / names.b` | 两个人的名字（支持中文/昵称） |
| `tagline` | 首屏的一句话 |
| `startDate` | ⚠️ **在一起（或结婚）日期**，目前是占位的 `2015-06-15`，请改成真实日期！ |
| `story` | 「我们的故事」时间线，逐条改日期和文案 |
| `gallery` | 照片墙的 9 张照片说明、emoji 和文案 |

改完保存、刷新页面即可生效。

## 二、放照片

把 9 张照片按名字放进**和 index.html 同一个文件夹**（GitHub 仓库根目录）：

```
photo-1.jpg
photo-2.jpg
……
photo-9.jpg
```

- 竖版、横版都可以，页面会自动裁剪成拍立得样式
- 放进一张自动显示一张，没放的位置会显示好看的渐变占位图
- 想换数量？改 `main.js` 里 `CONFIG.gallery` 的条目即可

## 三、留言板说明

留言保存在**访客自己的浏览器**（localStorage）里，不需要服务器、数据库，零成本零维护。同一人在同一浏览器里留言永久保留；换设备/浏览器则看不到彼此的留言。如果以后想要"云端同步的留言板"，需要加后端或接入 LeanCloud 之类的服务，随时可以升级。

## 四、部署上线（绑定 ktllkyll0615.cn）

### 方案 A：云服务器 + Nginx（推荐，国内访问快）

1. 购买任意轻量云服务器（阿里云/腾讯云均可）
2. 把整个文件夹上传到服务器，如 `/var/www/love`
3. Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name ktllkyll0615.cn www.ktllkyll0615.cn;
    root /var/www/love;
    index index.html;
}
```

4. 域名解析：到域名控制台添加 **A 记录**，`@` 和 `www` 指向服务器公网 IP
5. 建议 HTTPS（免费证书）：用 certbot 或云厂商免费证书

### 方案 B：对象存储静态托管（免运维）

阿里云 OSS / 腾讯云 COS 开启「静态网站托管」，上传全部文件，绑定自定义域名 + CDN，解析 CNAME 即可。

### 方案 C：GitHub Pages（⭐ 本项目已按此方案准备）

零成本、免备案。项目里已放好 `CNAME` 和 `.nojekyll` 两个文件，直接按下面步骤操作即可（全程网页点击，无需命令行）：

**第 1 步 · 创建仓库并上传**

1. 登录 [github.com](https://github.com) → 右上角 **+** → **New repository**
2. 仓库名随意（如 `love-site`），选 **Public**（免费账号开启 Pages 的要求）→ Create
3. 仓库页 → **Add file** → **Upload files** → 把本文件夹里的**全部文件**（index.html、css、js、images、CNAME、.nojekyll、README.md）拖进去 → Commit changes
   - 注意：`index.html` 必须位于仓库**根目录**，不要多套一层文件夹

**第 2 步 · 开启 Pages**

1. 仓库 → **Settings** → 左侧 **Pages**
2. Source 选 **Deploy from a branch**，Branch 选 **main**，目录 **/ (root)** → Save
3. 等 1~2 分钟，页面顶部出现 `https://kuntuyang84-ux.github.io/love-site/` 即上线成功

**第 3 步 · 绑定域名 ktllkyll0615.cn**

1. GitHub 仓库 → Settings → Pages → **Custom domain** 填入 `ktllkyll0615.cn` → Save
   - 项目里的 `CNAME` 文件内容就是它，不用改
2. 到你的**域名解析控制台**（在哪买的域名就去哪），添加解析记录：

| 记录类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | `@` | 185.199.108.153 |
| A | `@` | 185.199.109.153 |
| A | `@` | 185.199.110.153 |
| A | `@` | 185.199.111.153 |
| CNAME | `www` | `kuntuyang84-ux.github.io` |

3. 回到 GitHub Pages 设置页，等它显示「DNS check successful」
4. 勾选 **Enforce HTTPS**（证书自动签发，几分钟到一天内生效）

**第 4 步 · 以后更新内容**

仓库页 → Add file → Upload files 覆盖上传改过的文件即可，1 分钟内自动重新发布。

> 💡 小提醒：GitHub Pages 服务器在境外，国内访问偶尔偏慢。若日后不满意速度，可以平滑迁移到 Cloudflare Pages（同样免备案）或方案 A（需备案）。

### 方案 C2：Vercel / Cloudflare Pages（同类替代）

注册后导入 GitHub 仓库即可，绑定域名方式类似，国内连通性有时更好。

### ⚠️ 关于 .cn 域名备案

- 域名解析到**中国大陆**的服务器（方案 A/B），必须完成 **ICP 备案**（在服务器厂商的备案系统里办，个人备案约 1~2 周）
- 用**境外托管**（方案 C，或港澳台/海外服务器）则**不需要备案**，但国内访问速度会慢一些
- .cn 域名本身需要先在注册商处完成**实名认证**

## 五、目录结构

```
ktll-love-site/
├── index.html      # 页面结构
├── style.css       # 设计系统与全部样式
├── main.js         # ⭐ CONFIG 配置 + 全部交互
├── CNAME           # GitHub Pages 域名绑定
├── .nojekyll       # GitHub Pages 配置
├── photos-guide.txt
└── README.md       # 照片直接放根目录（photo-1.jpg ~ photo-9.jpg）
```

## 六、技术说明

- 纯原生 HTML/CSS/JS，零依赖、零构建，打开即用
- 字体：思源宋体 + 马善政楷体 + Cormorant Garamond（Google Fonts，加载失败自动回退系统楷体/宋体）
- 无障碍：键盘可导航、灯箱支持 Esc/方向键、尊重系统"减少动态效果"设置
- 已在桌面端（1440px）与移动端（375px）实测通过
