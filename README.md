# openletter

세 개의 앱으로 구성된 모노 저장소입니다.

| 폴더 | 스택 | 기본 포트 |
|---|---|---|
| `frontend/` | React + Vite + TypeScript | `5173` |
| `admin/` | React + Vite + TypeScript | `5173` (frontend와 동시에 띄울 경우 자동으로 다음 포트) |
| `backend/` | Go (`net/http`) | `8080` |

## 사전 요구 사항

- **Node.js** 20 이상 (`node --version`)
- **npm** 10 이상 (`npm --version`)
- **Go** 1.26 이상 (`go version`)

설치되어 있지 않다면:

```bash
# macOS (Homebrew)
brew install node go
```

## 최초 1회 설정

저장소를 클론한 뒤 각 앱의 의존성을 설치합니다.

```bash
git clone https://github.com/hierolabs/openletter.git
cd openletter

# frontend
cd frontend && npm install && cd ..

# admin
cd admin && npm install && cd ..

# backend (go.mod에 의존성이 추가되면 자동 다운로드됨)
cd backend && go mod tidy && cd ..
```

## 실행

각 앱은 별도의 터미널에서 실행합니다.

### Backend (Go)

```bash
cd backend
go run .
```

→ `http://localhost:8080/health` 에서 `ok` 응답 확인

### Frontend (Vite)

```bash
cd frontend
npm run dev
```

→ `http://localhost:5173`

### Admin (Vite)

```bash
cd admin
npm run dev
```

→ `http://localhost:5173` (frontend와 같이 켜면 Vite가 자동으로 다음 포트 사용, 예: `5174`)

## 빌드

```bash
# 프론트엔드 정적 빌드 → dist/
cd frontend && npm run build
cd admin && npm run build

# Go 바이너리 → backend/backend
cd backend && go build .
```
