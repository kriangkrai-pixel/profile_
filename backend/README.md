# Profile Backend API (NestJS)

Backend API สำหรับระบบจัดการโปรไฟล์ ใช้ NestJS และ Prisma ORM

## การติดตั้ง

```bash
# ติดตั้ง dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# รัน migrations
npm run prisma:migrate

# เพิ่มข้อมูลเริ่มต้น (ถ้ามี)
npm run prisma:seed
```

## การรัน

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### ใช้ Docker
```bash
docker-compose up -d
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/logout` - ออกจากระบบ

### Profile
- `GET /api/profile` - ดึงข้อมูลโปรไฟล์
- `PUT /api/profile` - อัปเดตโปรไฟล์

### Education
- `PUT /api/profile/education` - อัปเดตการศึกษา

### Experience
- `GET /api/profile/experience` - ดึงข้อมูลประสบการณ์
- `POST /api/profile/experience` - เพิ่มประสบการณ์
- `PUT /api/profile/experience` - อัปเดตประสบการณ์ทั้งหมด
- `DELETE /api/profile/experience?id={id}` - ลบประสบการณ์

### Skills
- `PUT /api/profile/skills` - อัปเดตทักษะ

### Portfolio
- `POST /api/profile/portfolio` - เพิ่มผลงาน
- `PUT /api/profile/portfolio` - อัปเดตผลงานทั้งหมด
- `DELETE /api/profile/portfolio?id={id}` - ลบผลงาน

### Contact
- `GET /api/contact` - ดึงข้อความทั้งหมด
- `POST /api/contact` - ส่งข้อความ
- `PUT /api/contact` - อัปเดตสถานะข้อความ
- `DELETE /api/contact?id={id}` - ลบข้อความ

### Layout
- `GET /api/layout` - ดึง layout ที่ active
- `PUT /api/layout` - อัปเดต layout
- `POST /api/layout` - สร้าง layout ใหม่

### Widgets
- `GET /api/widgets?layoutId={id}` - ดึง widgets ของ layout
- `POST /api/widgets` - สร้าง widget ใหม่
- `PUT /api/widgets` - อัปเดต widget
- `DELETE /api/widgets?id={id}` - ลบ widget

### Settings
- `GET /api/settings` - ดึงการตั้งค่า
- `PUT /api/settings` - อัปเดตการตั้งค่า

### Upload
- `POST /api/upload` - อัปโหลดรูปภาพ

### Edit History
- `GET /api/admin/edit-history` - ดึงประวัติการแก้ไข
- `POST /api/admin/edit-history` - บันทึกประวัติการแก้ไข

## Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ backend:

```env
DATABASE_URL="mysql://root:password@localhost:3306/profile_db"
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## โครงสร้างโปรเจกต์

```
backend/
├── src/
│   ├── auth/              # Authentication module
│   ├── profile/           # Profile management
│   ├── contact/           # Contact messages
│   ├── layout/            # Layout management
│   ├── widgets/           # Widgets management
│   ├── settings/          # Site settings
│   ├── upload/            # File upload
│   ├── edit-history/      # Edit history tracking
│   ├── prisma/            # Prisma service
│   ├── app.module.ts      # Main application module
│   └── main.ts            # Application entry point
├── prisma/
│   └── schema.prisma      # Database schema
├── Dockerfile
├── docker-compose.yml
└── package.json
```

