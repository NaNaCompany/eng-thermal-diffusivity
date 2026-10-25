# 열확산계수 계산기

열전도율과 체적 열용량으로 열확산계수 계산

- Plan ID: E074
- App: https://nanalab.kr/eng-thermal-diffusivity/
- Repository: https://github.com/NaNaCompany/eng-thermal-diffusivity
- Formula: `α = k/(ρc_p)`
- Output: 열확산계수 α

## Model

k,ρ,c_p>0. 같은 상태의 등방성 매질 물성을 쓴다. 상변화·온도 의존 물성·다층체 유효값 자동 산정은 제외한다.

Inputs are normalized to SI. Only one scalar is returned. Model conditions, finite numbers, physical boundaries, overflow and underflow are checked. External solver APIs and property databases are not used.

## Verification

Run `node --test tests/*.test.mjs` with Node.js 22 or later. Independent 70-digit Decimal example result: `1.42857142857143e-07`. Source and license notices are in [SOURCES.md](SOURCES.md) and [LICENSE](LICENSE).

## Hosting

GitHub Pages uses `main` and `/`, with the NaNaCompany domain inherited. Google GTM, GA4, AdSense, Cloudflare analytics and the gray More Apps link are included. All code, descriptions and graphics are original.

## Static languages

Korean (existing root), English (`en/`), Spanish (`es/`), Simplified Chinese (`zh/`), Japanese (`ja/`) and German (`de/`). Each page has its own canonical URL, reciprocal hreflang, localized metadata, interface, validation messages and preview image. The language links work without JavaScript. Calculation code is shared and no runtime translation API is used.

Edit `localization/*.json` for text, `src/template.html` for the shared page, and run `python scripts/build-locales.py`. Run `python scripts/build-locales.py --check` and `npm test` before publishing. Decimal commas are accepted in Spanish and German; thousands separators are not supported.
