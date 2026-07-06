// Single source of truth for the OG image generators (generate-og.cjs,
// generate-og-flagship.cjs). Static assets (favicon.svg, logo-mark.svg,
// manifest.json, app/components/LogoMark.vue) can't import this — they're
// served as literal files — so those still need their hex values updated by
// hand on a rebrand. This only removes the duplication between the two
// script-rendered OG templates.
module.exports = {
  bg: '#0A0912',
  accent: '#FF3D8F',
  valid: '#C6FF3D',
  border: '#26213D',
  ink: '#EFE9F5',
  logoMarkSvg: '<rect x="1" y="1" width="38" height="38" rx="9" fill="#0A0912" stroke="#26213D" stroke-width="1.5"/><circle cx="20" cy="20" r="6.5" fill="#FF3D8F"/><circle cx="20" cy="20" r="10.5" stroke="#FF3D8F" stroke-width="1.2" opacity="0.35" fill="none"/>',
}
