const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());

// 数据库初始化
const dbPath = path.join(__dirname, 'data', 'personweb.db');
const db = new Database(dbPath);

// 创建 contacts 表
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    delivery TEXT NOT NULL,
    problem TEXT NOT NULL,
    timeline TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    language TEXT DEFAULT 'zh',
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'unread'
  )
`);

console.log('✅ PersonWeb 数据库已初始化:', dbPath);

// 提交联系表单
app.post('/api/contact/submit', async (req, res) => {
  try {
    const { role, delivery, problem, timeline, contact, language = 'zh' } = req.body;

    if (!role || !delivery || !problem || !timeline || !contact) {
      return res.status(400).json({
        success: false,
        error: '所有字段均为必填项'
      });
    }

    const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    const stmt = db.prepare(`
      INSERT INTO contacts (id, role, delivery, problem, timeline, contact_info, language, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, role, delivery, problem, timeline, contact, language, ipAddress, userAgent);

    console.log(`📩 新联系表单提交: ${id} (${contact})`);

    res.json({
      success: true,
      message: '已收到您的消息，将在24-48小时内回复',
      id
    });
  } catch (error) {
    console.error('❌ 联系表单提交失败:', error);
    res.status(500).json({
      success: false,
      error: '提交失败，请稍后重试或直接发邮件到 hi@xiaotianaya.com'
    });
  }
});

// 获取所有联系表单（管理用）
app.get('/api/contact/list', async (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100').all();

    res.json({
      success: true,
      data: contacts,
      total: contacts.length
    });
  } catch (error) {
    console.error('❌ 获取联系列表失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 PersonWeb 后端服务已启动`);
  console.log(`📱 API: http://localhost:${PORT}`);
  console.log(`🔗 健康检查: http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 正在关闭服务...');
  db.close();
  process.exit(0);
});
