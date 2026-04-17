# Cloudflare Pages 배포 설정

이 프로젝트는 **정적 내보내기(static export)** 방식으로 Cloudflare Pages에 배포됩니다.

## Cloudflare Pages 대시보드 설정

프로젝트 `zoo` → Settings → Build & deployments 에서 아래 값으로 맞춰주세요.

| 항목 | 값 |
|---|---|
| **Framework preset** | `Next.js (Static HTML Export)` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Root directory (Advanced)** | `dog` |
| **Node version** (env variable `NODE_VERSION`) | `20` 또는 `22` |

> Framework preset을 `Next.js`(비정적)로 두면 Cloudflare는 Workers 빌드 어댑터를 시도합니다. 이 프로젝트는 전부 클라이언트 컴포넌트이므로 **Static HTML Export**로 두는 것이 가장 안정적입니다.

## 502 에러가 계속 날 때 체크리스트

- [ ] Framework preset이 `Next.js (Static HTML Export)`로 되어 있는지
- [ ] Build output directory가 `out`인지 (`.next`가 아님)
- [ ] Root directory가 `dog`인지 (모노레포 구조)
- [ ] Node 버전이 18 이상인지
- [ ] 대시보드에서 Retry deployment 누르거나, 새 커밋을 push해서 재빌드 유도

## 로컬에서 정적 빌드 결과 확인

```bash
cd dog
npm run build
npx serve out -p 4000   # http://localhost:4000 에서 확인
```
