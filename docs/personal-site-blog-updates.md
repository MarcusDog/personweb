# Journal 内容工作流

## 日常发布

访问 `/studio`，登录后即可：

1. 新建文章；
2. 分别填写中文与英文标题、摘要、分类和正文；
3. 添加标签、上传图片；
4. 使用“结构化排版”把普通段落整理成 Markdown 层级；
5. 在右侧实时预览；
6. 保存草稿或直接发布。

发布后的内容会立即出现在 Journal、首页最近文章和对应文章详情页中，不需要重新构建前端。

## 静态内容与容灾

仓库中的 `src/content/journal/*.md` 是初始内容与公开站点的离线回退。当 SQLite 数据库为空时，服务会自动导入这些 Markdown 文件。日常更新应通过 `/studio` 完成，不需要再手工创建文件。

## 数据位置

- SQLite：`server/data/personweb.db`
- 首次生成的本地管理员密码：`server/data/admin-secret.txt`
- 后台上传图片：`public/uploads/`

部署时请持久化这些目录，并定期备份数据库与上传图片。
