const BASE_URL = 'https://jsontools.space'

export function useToolSeo(title: string, description: string) {
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
}
