# 열확산계수 계산기 — 업데이트 기록

## 2026-10-25 최초 공개

- 도구 ID: E074.
- 계산 모델: `α = k/(ρc_p)`.
- 한국어·영어·스페인어·중국어 간체·일본어·독일어 정적 페이지를 제작했다.
- 원본 코드·설명·예제·SVG 아이콘·PNG 이미지는 직접 작성했다. 참고문헌의 본문·그림·표·코드와 폰트 파일을 포함하지 않았다. 자체 제작물은 MIT, 참고문헌은 원저작자의 이용 조건을 따른다. 상세 출처는 `SOURCES.md`에 있다.
- 단위 변환, 입력 검증, 모델 범위, 수치 표현 한계, 독립 70자리 Decimal 기준값을 검증했다. 해당 저장소의 자동 테스트 20개와 생성물 일치 검사를 통과했다.
- 실제 브라우저에서 6개 언어 × 320px·1280px = 12건의 계산·잘못된 입력·번역·화면 넘침·More Apps 링크 검사를 통과했다.
- 신규 50종 전체 결과: 자동 테스트 1,000개, 브라우저 검사 600건 통과. 커밋 후 GitHub CI·Pages의 동일 커밋과 공개 파일은 별도 배포 기록에서 확인한다.
- Google GTM·GA4·AdSense·Cloudflare 공개 분석 코드와 우측 하단 회색 More Apps 링크를 적용했다. 코드 존재 확인은 수집 실적 검증과 구분한다.

## 공개 페이지와 사이트맵

- ko: https://nanalab.kr/eng-thermal-diffusivity/
- en: https://nanalab.kr/eng-thermal-diffusivity/en/
- es: https://nanalab.kr/eng-thermal-diffusivity/es/
- zh: https://nanalab.kr/eng-thermal-diffusivity/zh/
- ja: https://nanalab.kr/eng-thermal-diffusivity/ja/
- de: https://nanalab.kr/eng-thermal-diffusivity/de/

- 사이트맵: https://nanalab.kr/eng-thermal-diffusivity/sitemap.xml
- 6개 URL, 상호 hreflang, x-default와 각 페이지의 canonical을 포함한다.
- 본사이트 앱 목록에 추가할 대표 주소는 한국어 루트 1개다. 언어별 페이지는 사이트맵용이며 카드 중복을 만들지 않는다.
- 본사이트 카드·루트 사이트맵 연결은 작업 폴더 `UpdateQue.md`의 후속 반영 대상으로 기록한다.
