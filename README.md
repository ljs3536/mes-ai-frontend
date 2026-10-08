# MES AI Frontend

부품/설비 가공 공장 MES 화면 (Next.js 16, App Router).
데이터는 모두 [mes-ai-backend](https://github.com/ljs3536/mes-ai-backend)(FastAPI)에서 가져오며,
조회는 서버 컴포넌트, 등록/상태 변경은 서버 액션이 백엔드 API를 호출합니다.

## 화면

| 경로 | 기능 |
| --- | --- |
| `/` | 공장 운영 현황 (LOT 단계별 수, 설비, 알림) |
| `/materials` | 자재 입고, `RAW-YYYYMMDD-NNN` LOT 발행 |
| `/work-orders` | 작업지시 발행, 작업자 선택 후 작업 시작 (WIP) |
| `/shop-floor` | Machine A/B 통신 상태·센서값·진행률 (2초 자동 갱신), 설비 정지·LOT HOLD, 점검 완료 |
| `/quality` | 가공완료 LOT 품질 판정 (합격 → 완제품, 불합격 → HOLD) |
| `/shipping` | 완제품 출하 |
| `/traceability` | LOT 이력 타임라인 |
| `/monitoring` | 2단계 센서·AI 연동 자리 |

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
