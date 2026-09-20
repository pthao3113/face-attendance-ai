# Face Attendance AI 🚀

Hệ thống điểm danh bằng khuôn mặt và kiểm tra thực thể (liveness detection) theo thời gian thực với hiệu năng cao, được phát triển trên nền tảng Computer Vision, FastAPI và React với TypeScript.

---

## 📌 Tổng Quan Dự Án

**Face Attendance AI** là một giải pháp điểm danh tự động toàn diện dành cho doanh nghiệp và tổ chức. Hệ thống xử lý trực tiếp luồng video từ webcam hoặc camera IP, thực hiện nhận diện khuôn mặt, trích xuất đặc trưng vector, so khớp danh tính nhân viên và xác thực thực thể (anti-spoofing) để phòng chống các hình thức gian lận bằng ảnh chụp hoặc video phát lại.

---

## 🏗️ Kiến Trúc Hệ Thống

Dự án được thiết kế theo mô hình Monorepo chia làm 3 module độc lập:

```
[ Frontend: React + TS + Vite ] ──(HTTP/REST)──> [ Backend: FastAPI Server ] ──(Pipeline)──> [ AI Core: OpenCV/MediaPipe ]
```

1. **`ai/` (AI Core)**: Đảm nhận nghiên cứu Computer Vision và thử nghiệm pipeline. Chứa các Jupyter Notebooks, script trích xuất đặc trưng, wrapper nhận diện khuôn mặt, tạo vector embedding và thuật toán so khớp (Cosine similarity / Euclidean distance).
2. **`backend/` (FastAPI API Server)**: API Gateway phục vụ các yêu cầu xác thực thời gian thực, lưu trữ nhật ký điểm danh, cấu hình CORS middleware và điều phối luồng xử lý AI.
3. **`frontend/` (React Client)**: Ứng dụng Single Page (SPA) hiện đại viết bằng React, TypeScript và Vite. Cung cấp giao diện xem camera trực tiếp, hiển thị trạng thái kết nối tới backend và bảng điều khiển trực quan.

---

## 🛠️ Công Nghệ Sử Dụng

- **Computer Vision & AI**: Python 3.10+, OpenCV (`opencv-python-headless`), MediaPipe / ArcFace, Scikit-learn, NumPy.
- **Backend API**: FastAPI, Uvicorn (ASGI server), Pydantic v2, Python-Multipart.
- **Frontend SPA**: React 18, TypeScript, Vite, CSS3 (Thiết kế giao diện Dark Mode Glassmorphism).

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
face-attendance-ai/
├── ai/
│   ├── data/
│   │   ├── embeddings/          # Nơi lưu trữ vector đặc trưng (.pkl, .faiss)
│   │   └── known_faces/         # Ảnh mẫu đăng ký của nhân viên
│   ├── notebooks/               # Jupyter Notebooks thử nghiệm thuật toán
│   ├── scripts/
│   │   └── extract_embeddings.py# Script CLI trích xuất vector đặc trưng tự động
│   ├── src/
│   │   ├── __init__.py
│   │   ├── detector.py          # Wrapper nhận diện khuôn mặt (OpenCV / MediaPipe)
│   │   └── matcher.py           # Engine so khớp vector đặc trưng (Cosine / Euclidean)
│   └── requirements-ai.txt      # Thư viện phụ thuộc cho module AI
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   └── attendance.py # Các API endpoints điểm danh
│   │   │       └── router.py         # Router tổng API v1
│   │   ├── core/
│   │   │   └── config.py        # Cấu hình hệ thống & biến môi trường
│   │   └── main.py              # Entrypoint ứng dụng FastAPI & healthcheck
│   └── requirements.txt         # Thư viện phụ thuộc cho Backend server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── CameraFeed.tsx   # Component hiển thị luồng Camera & overlay
│   │   ├── App.tsx              # Component giao diện chính
│   │   ├── main.tsx             # Entrypoint React
│   │   └── index.css            # Style toàn cục & theme Glassmorphism
│   ├── package.json             # Cấu hình Node dependencies & scripts Vite
│   ├── tsconfig.json            # Cấu hình TypeScript
│   └── vite.config.ts           # Cấu hình Vite
│
├── .gitignore
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

Thực hiện theo các bước sau để thiết lập môi trường và chạy ứng dụng trên máy cục bộ.

### Yêu Cầu Hệ Thống

- **Python**: `3.10` trở lên
- **Node.js**: `v18.0.0` trở lên
- **npm**: `v9.0.0` trở lên

---

### 1. Thiết Lập Backend & AI Core

1. **Di chuyển vào thư mục backend**:
   ```bash
   cd backend
   ```

2. **Tạo và kích hoạt môi trường ảo Python (Virtual Environment)**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Trên macOS/Linux
   # Hoặc `venv\Scripts\activate` trên Windows
   ```

3. **Cài đặt các thư viện cần thiết**:
   ```bash
   # Cài đặt thư viện cho Backend
   pip install -r requirements.txt

   # Cài đặt thư viện cho AI Pipeline (chạy từ thư mục gốc của dự án)
   pip install -r ../ai/requirements-ai.txt
   ```

4. **Khởi chạy Backend Server (FastAPI)**:
   ```bash
   uvicorn app.main:app --reload
   ```
   Backend API sẽ hoạt động tại `http://localhost:8000` (Tài liệu API tương tác Swagger tại `http://localhost:8000/docs`).

---

### 2. Thiết Lập Frontend

1. **Di chuyển vào thư mục frontend**:
   ```bash
   cd frontend
   ```

2. **Cài đặt các gói phụ thuộc Node**:
   ```bash
   npm install
   ```

3. **Khởi chạy Vite Development Server**:
   ```bash
   npm run dev
   ```
   Ứng dụng Frontend sẽ hoạt động tại `http://localhost:5173`.

---

## 🧪 Kiểm Tra Kết Nối & Healthcheck

- Truy cập ứng dụng tại trình duyệt: `http://localhost:5173`.
- Giao diện Dashboard sẽ gửi yêu cầu `GET http://localhost:8000/` và hiển thị badge **"System Healthy"** khi kết nối thành công.
- Xem tài liệu tương tác API Swagger tại `http://localhost:8000/docs`.

---

## 📜 Giấy Phép (License)

Dự án được phát hành theo giấy phép MIT License.
