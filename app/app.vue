<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const BASE_URL = 'https://jsontools.space'

useHead({
  script: [
    {
      key: 'schema-organization',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'JSON Tools',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo-mark.svg`,
        },
      }),
    },
    {
      key: 'schema-website',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'JSON Tools',
        url: BASE_URL,
      }),
    },
  ],
})
</script>
