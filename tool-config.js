export const tool={
  "id": "E074",
  "slug": "eng-thermal-diffusivity",
  "title": "열확산계수 계산기",
  "title_en": "Thermal Diffusivity Calculator",
  "category": "열",
  "category_en": "Heat transfer",
  "fields": [
    {
      "key": "k",
      "label": "열전도율 k",
      "label_en": "Thermal conductivity k",
      "dimension": "conductivity",
      "example": 0.6,
      "constraint": "positive",
      "display_unit": "WmK",
      "display_value": "0.6"
    },
    {
      "key": "rho",
      "label": "밀도 ρ",
      "label_en": "Density ρ",
      "dimension": "density",
      "example": 1000,
      "constraint": "positive",
      "display_unit": "kgm3",
      "display_value": "1000"
    },
    {
      "key": "cp",
      "label": "비열 c_p",
      "label_en": "Specific heat c_p",
      "dimension": "specificHeat",
      "example": 4200,
      "constraint": "positive",
      "display_unit": "JkgK",
      "display_value": "4200"
    }
  ],
  "result_label": "열확산계수 α",
  "result_label_en": "Thermal diffusivity α",
  "result_dimension": "kinematic",
  "formula": "α = k/(ρc_p)",
  "purpose": "열전도율과 체적 열용량으로 열확산계수 계산",
  "purpose_en": "Calculate thermal diffusivity from conductivity and volumetric heat capacity.",
  "assumptions": "k,ρ,c_p>0. 같은 상태의 등방성 매질 물성을 쓴다. 상변화·온도 의존 물성·다층체 유효값 자동 산정은 제외한다.",
  "assumptions_en": "Required: k,ρ,c_p>0 for the same isotropic medium state. Phase change, temperature-dependent integration and automatic multilayer homogenization are excluded.",
  "sources": [
    {
      "label": "MIT OCW · 3.185 · Thermal Diffusion Equation",
      "url": "https://ocw.mit.edu/courses/3-185-transport-phenomena-in-materials-engineering-fall-2003/927ddb6b3dfc423de5570a0070614129_handout_htrans.pdf"
    }
  ],
  "condition": "",
  "condition_en": "",
  "site": "https://nanalab.kr/eng-thermal-diffusivity/",
  "repository": "https://github.com/NaNaCompany/eng-thermal-diffusivity",
  "output_unit": "m2s"
};
