import type { ToolFaq } from '~/data/tool-faqs'

const BASE_URL = 'https://jsontools.space'

export function useToolSeo(title: string, description: string, faqs?: ToolFaq[]) {
  const route = useRoute()
  const slug = route.path.replace('/tools/', '')
  const image = `${BASE_URL}/og/${slug}.png`
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    twitterTitle: title,
    twitterDescription: description,
    ogImage: image,
    twitterImage: image,
  })

  if (faqs?.length) {
    useHead({
      script: [{
        key: 'schema-faq',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') },
          })),
        }),
      }],
    })
  }
}
