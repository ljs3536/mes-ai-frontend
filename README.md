# MES AI Frontend

부품/설비 가공 공장 MES 화면 (Next.js 16, App Router).
데이터는 모두 [mes-ai-backend](https://github.com/ljs3536/mes-ai-backend)(FastAPI)에서 가져오며,
조회는 서버 컴포넌트, 등록/상태 변경은 서버 액션이 백엔드 API를 호출합니다.

## 화면

| 경로 | 기능 |
| --- | --- |
| `/` | 관리자 공장 현황 |
| `/materials` | 자재 직무. 입고 |
| `/work-orders` | 생산관리 직무. 작업지시 발행과 시작 전 취소 |
| `/shop-floor` | 작업자 직무. 배정된 설비에서 시작, 정지, 재개 |
| `/quality` | 품질 직무. 합격·불량 수량, 불량은 재가공 또는 폐기 |
| `/shipping` | 자재 직무. 생산 수량 출하 |
| `/employees` | 관리자. 사원 직무와 담당 설비 배정 |
| `/traceability` | 관리자. LOT 이력 |
| `/monitoring` | 관리자. 센서·AI |

## 로컬 실행

```bash
cp .env.example .env   # API_URL=http://localhost:8000
npm install
npm run dev
```

## 컨테이너

```bash
docker build -t factory-mes/frontend .
docker run -p 3000:3000 -e API_URL=http://<backend>:8000 factory-mes/frontend
```

`output: "standalone"` 빌드이며 `API_URL`은 런타임에 읽으므로 하나의 이미지를 환경별로 재사용할 수 있습니다.
