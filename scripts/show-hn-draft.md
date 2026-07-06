# Show HN draft — JSON Tools

## Titre (champ "Title" du formulaire de soumission)

Show HN: I built a JSON toolbox that runs entirely in your browser (29 tools, no signup)

Variante plus courte si besoin (limite HN ~80 caractères pour rester bien affiché) :
Show HN: A JSON/dev toolbox that runs entirely in your browser, no signup

## URL du champ "url"

https://jsontools.space

## Premier commentaire (à poster juste après la soumission, convention HN pour les Show HN)

Hi HN,

I built JSON Tools, a set of 29 small utilities (JSON formatter, diff, tree
viewer, schema generator, JWT decoder/generator, CSV/XML/YAML/Excel
converters, regex tester, SQL formatter, and a few others) that all run
client-side in the browser. Nothing you paste gets sent to a server: it's
static (Nuxt 4, SSG, deployed on Vercel), so there's no backend to send data
to in the first place.

I built it because I kept bouncing between five different single-purpose
sites for these small daily tasks, most of them ad-heavy or asking for a
signup for something that should take ten seconds. I wanted one place with
no account, no rate limit, and no "sign up to continue."

A few implementation details that might interest this crowd:
- CSV/Excel parsing runs in a Web Worker (SheetJS has known CVEs, so it's
  sandboxed there rather than on the main thread)
- CSS minification uses lightningcss compiled to WASM, running in-browser
- The JSON Tree Viewer has a graph mode built with vis-network for visualizing
  deeply nested structures

Happy to answer questions about the stack or take feedback, including
critical feedback: this is a side project I've been building solo and I'm
sure there's plenty to improve.

## Notes pour le timing

- Meilleur créneau : mardi-jeudi, tôt le matin US East Coast (autour de
  9h-11h ET, donc ~14h-16h heure française) — c'est quand le trafic HN est
  le plus dense sans être noyé par la vague de posts asiatiques/européens
  de la nuit.
- Poster le premier commentaire (contexte) dans les minutes qui suivent la
  soumission, pas des heures après.
- Ne pas répondre de manière défensive aux critiques techniques : HN valorise
  l'auto-dérision et l'honnêteté sur les limites plus que la posture
  "tout va bien".

## Statut compte (vérifié 2026-07-07)

Compte `flex57` créé le 2026-06-18, karma = 1 (quasi aucune activité
organique). Décision : construire un peu d'activité réelle (commentaires,
upvotes sur des threads dev tools qui intéressent vraiment) avant de
soumettre, plutôt que poster depuis un compte à karma nul qui ressemble à
un compte spam à sens unique.
