<template>
  <div class="page">
    <div class="faq-page-inner">
    <div class="page-header">
      <div>
        <h1 class="page-title">Frequently Asked Questions</h1>
        <p class="page-subtitle">Everything you need to know about JSON Tools.</p>
      </div>
    </div>

    <FaqAccordion :items="FAQS" />

    <div class="faq-cta">
      <p>Ready to get started?</p>
      <NuxtLink to="/" class="faq-cta-btn">Browse all tools →</NuxtLink>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const FAQS = [
  {
    q: 'What is JSON Tools?',
    a: [
      'JSON Tools is a free collection of 29 developer utilities for working with JSON, data formats, text, and security tokens. It includes tools like a JSON formatter, CSV/XML/YAML converters, JWT decoder, regex tester, hash generator, and more.',
      'The goal is simple: provide fast, reliable tools that developers can open and use immediately, without any friction.',
    ],
  },
  {
    q: 'Is JSON Tools free?',
    a: ['Yes, completely free. All tools are available without any cost, subscription, or premium tier. There are no rate limits or usage restrictions.'],
  },
  {
    q: 'Do I need to create an account?',
    a: ['No. There is no login, no signup, no email required. You can open any tool and start working instantly.'],
  },
  {
    q: 'Is my data safe? Does it leave my browser?',
    a: [
      'Your data never leaves your machine. Every tool runs entirely in your browser using client-side JavaScript, and nothing is sent to any server.',
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
      'JWT (JSON Web Token) is a compact, signed token used to securely transmit information between parties, most commonly for authentication. A JWT is made of three base64url-encoded parts: a header, a payload, and a signature.',
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
    a: ['JSON Tools supports conversions between JSON and the following formats: CSV, XML, YAML, and Excel (.xlsx). Each converter works in both directions.'],
  },
  {
    q: 'Does JSON Tools work offline?',
    a: ['Once the page is loaded, most tools work without an internet connection since all processing is done in your browser. However, the initial page load requires a network connection.'],
  },
  {
    q: 'What keyboard shortcuts does JSON Tools support?',
    a: [
      'Most conversion and formatting tools support Ctrl+Enter (Cmd+Enter on Mac) to trigger the primary action, Format or Convert, without reaching for the mouse.',
      'Supported tools: JSON Formatter, CSV/XML/YAML ↔ JSON converters, UUID Generator, and Password Generator (refresh). The shortcut hint is visible next to the primary button on each supported tool.',
    ],
  },
]

useSeoMeta({
  title: 'FAQ: Is JSON Tools Free, Safe & Does It Work Offline?',
  description: 'Answers to common questions about JSON Tools: is it free, is my data safe, what tools are available, and more.',
  ogTitle: 'FAQ: Is JSON Tools Free, Safe & Does It Work Offline?',
  ogDescription: 'Answers to common questions about JSON Tools: is it free, is my data safe, what tools are available, and more.',
  twitterTitle: 'FAQ: Is JSON Tools Free, Safe & Does It Work Offline?',
  twitterDescription: 'Answers to common questions about JSON Tools: is it free, is my data safe, what tools are available, and more.',
  ogImage: 'https://jsontools.space/og/faq.png',
  twitterImage: 'https://jsontools.space/og/faq.png',
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
        acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') },
      })),
    }),
  }],
})
</script>

<style scoped>
.faq-page-inner { max-width: 760px; margin: 0 auto; width: 100%; }

.faq-cta {
  margin-top: 16px;
  padding-top: 32px;
  border-top: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.faq-cta p { font-family: var(--font-body); font-size: 14px; color: var(--c-t3); }

.faq-cta-btn {
  display: inline-block;
  padding: 10px 20px;
  background: var(--c-accent);
  color: var(--c-accent-ink);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.15s;
}

.faq-cta-btn:hover { opacity: 0.85; }
</style>
