<template>
  <div class="faq-page">
    <section class="faq-hero">
      <h1 class="faq-title">Frequently Asked Questions</h1>
      <p class="faq-sub">Everything you need to know about JSON Tools.</p>
    </section>

    <div class="faq-list">
      <div
        v-for="(item, i) in FAQS"
        :key="i"
        class="faq-item"
        :class="{ 'faq-item--open': openIndex === i }"
      >
        <button class="faq-q" @click="toggle(i)">
          {{ item.q }}
          <svg class="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div v-if="openIndex === i" class="faq-a">
          <p v-for="(para, j) in item.a" :key="j">{{ para }}</p>
        </div>
      </div>
    </div>

    <div class="faq-cta">
      <p>Ready to get started?</p>
      <NuxtLink to="/" class="faq-cta-btn">Browse all tools →</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const FAQS = [
  {
    q: 'What is JSON Tools?',
    a: [
      'JSON Tools is a free collection of 28+ developer utilities for working with JSON, data formats, text, and security tokens. It includes tools like a JSON formatter, CSV/XML/YAML converters, JWT decoder, regex tester, hash generator, and more.',
      'The goal is simple: provide fast, reliable tools that developers can open and use immediately, without any friction.',
    ],
  },
  {
    q: 'Is JSON Tools free?',
    a: [
      'Yes, completely free. All tools are available without any cost, subscription, or premium tier. There are no rate limits or usage restrictions.',
    ],
  },
  {
    q: 'Do I need to create an account?',
    a: [
      'No. There is no login, no signup, no email required. You can open any tool and start working instantly.',
    ],
  },
  {
    q: 'Is my data safe? Does it leave my browser?',
    a: [
      'Your data never leaves your machine. Every tool runs entirely in your browser using client-side JavaScript — nothing is sent to any server.',
      'This means you can safely use JSON Tools with sensitive data, API keys, JWT tokens, or confidential JSON payloads.',
    ],
  },
  {
    q: 'What is JSON and why do I need a formatter?',
    a: [
      'JSON (JavaScript Object Notation) is a lightweight text format for storing and exchanging data. It is the most common format used in APIs and web applications.',
      'A JSON formatter takes raw, compact JSON and formats it with proper indentation and line breaks, making it easy to read and debug. It also validates that the JSON is syntactically correct.',
    ],
  },
  {
    q: 'What is a JWT token?',
    a: [
      'JWT (JSON Web Token) is a compact, signed token used to securely transmit information between parties — most commonly for authentication. A JWT is made of three base64url-encoded parts: a header, a payload, and a signature.',
      'The JWT Decoder tool lets you inspect the header and payload of any JWT instantly. The JWT Generator lets you create signed tokens using HS256, HS384, or HS512.',
    ],
  },
  {
    q: 'What is Base64 encoding?',
    a: [
      'Base64 is an encoding scheme that converts binary data into a text string using 64 printable ASCII characters. It is commonly used to embed images in HTML/CSS, encode email attachments, or pass binary data through text-only channels.',
      'The Base64 tool on JSON Tools supports both encoding and decoding, with UTF-8 handling.',
    ],
  },
  {
    q: 'What is a cron expression?',
    a: [
      'A cron expression is a string of five (or six) fields that defines a schedule for recurring tasks on Unix-based systems. For example, "0 9 * * 1-5" means "every weekday at 9:00 AM".',
      'The Cron Parser tool translates any cron expression into plain English and shows the next scheduled run times.',
    ],
  },
  {
    q: 'Which data formats can I convert?',
    a: [
      'JSON Tools supports conversions between JSON and the following formats: CSV, XML, YAML, and Excel (.xlsx). Each converter works in both directions.',
    ],
  },
  {
    q: 'Does JSON Tools work offline?',
    a: [
      'Once the page is loaded, most tools work without an internet connection since all processing is done in your browser. However, the initial page load requires a network connection.',
    ],
  },
]

const openIndex = ref<number | null>(0)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

useSeoMeta({
  title: 'FAQ — JSON Tools',
  description: 'Answers to common questions about JSON Tools: is it free, is my data safe, what tools are available, and more.',
  ogTitle: 'FAQ — JSON Tools',
  ogDescription: 'Answers to common questions about JSON Tools: is it free, is my data safe, what tools are available, and more.',
  twitterTitle: 'FAQ — JSON Tools',
  twitterDescription: 'Answers to common questions about JSON Tools: is it free, is my data safe, what tools are available, and more.',
})

useHead({
  script: [{
    key: 'schema-faq',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a.join(' '),
        },
      })),
    }),
  }],
})
</script>

<style scoped>
.faq-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 24px 64px;
}

.faq-hero {
  text-align: center;
  padding: 56px 0 48px;
}

.faq-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.03em;
  margin-bottom: 12px;
}

.faq-sub {
  font-size: 16px;
  color: var(--c-t3);
}

/* ── FAQ list ──────────────────────────────────────── */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
}

.faq-item {
  border-bottom: 1px solid var(--c-border);
}

.faq-item:last-child { border-bottom: none; }

.faq-q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--c-t1);
  transition: background 0.15s, color 0.15s;
}

.faq-q:hover { background: rgba(249, 115, 22, 0.04); }

.faq-item--open .faq-q { color: #F97316; }

.faq-chevron {
  flex-shrink: 0;
  color: var(--c-t4);
  transition: transform 0.2s ease;
}

.faq-item--open .faq-chevron { transform: rotate(180deg); }

.faq-a {
  padding: 0 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-a p {
  font-size: 13.5px;
  color: var(--c-t3);
  line-height: 1.7;
}

/* ── CTA ───────────────────────────────────────────── */
.faq-cta {
  margin-top: 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.faq-cta p {
  font-size: 15px;
  color: var(--c-t3);
}

.faq-cta-btn {
  display: inline-block;
  padding: 10px 22px;
  background: #F97316;
  color: #fff;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s;
}

.faq-cta-btn:hover { background: #EA6C10; }

@media (max-width: 768px) {
  .faq-page { padding: 0 16px 48px; }
  .faq-hero { padding: 36px 0 32px; }
  .faq-q { font-size: 13.5px; padding: 16px; }
  .faq-a { padding: 0 16px 16px; }
}
</style>
