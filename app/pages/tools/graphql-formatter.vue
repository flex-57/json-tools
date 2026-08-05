<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">GraphQL <span class="title-amp">Formatter</span></h1>
        <p class="page-subtitle">Format GraphQL queries, mutations, fragments and schema definitions instantly.</p>
      </div>
    </div>

    <ErrorBanner v-if="error" :message="errorMessage" />

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging, 'pane--invalid': error }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">Raw GraphQL</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .graphql file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <textarea v-model="input" class="pane-textarea" placeholder="query GetUser($id: ID!) { user(id: $id) { name email } }" spellcheck="false" />
        </div>
      </div>

      <div class="midcol">
        <span class="mid-arrow" :class="{ spinner: loading }">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">Formatted GraphQL</span>
          <div class="card-actions">
            <button class="btn-xs" :disabled="!output" @click="download">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <template v-if="!output">{{ input.trim() ? 'Fix the error in your input to see formatted output' : 'Paste a GraphQL query, mutation, fragment or schema to see formatted output' }}</template>
          <textarea v-else :value="output" class="pane-textarea" readonly spellcheck="false" />
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useGraphqlFormatter } from '~/composables/useGraphqlFormatter'

useToolSeo(
  'GraphQL Formatter: Beautify Queries, Mutations & Schemas',
  'Format GraphQL queries, mutations, fragments, and SDL type definitions instantly in your browser. Uses the reference graphql-js printer. Free, no data sent to servers.',
)

const { input, output, error, errorLine, errorColumn, loading, copied, copy, download, clear } = useGraphqlFormatter()
useUrlInput(input)

const errorMessage = computed(() => error.value ? `${error.value}${errorLine.value ? ` (line ${errorLine.value}, column ${errorColumn.value})` : ''}` : '')

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const seoCards = [
  {
    title: 'Why format GraphQL?',
    text: 'A GraphQL query minified into one line by a client library or browser devtools network tab is hard to read, especially with nested selections and fragments. This formatter parses the document into an AST with the reference graphql-js parser and re-prints it with consistent 2-space indentation, so any nesting depth stays readable.',
  },
  {
    title: 'One formatter, every document type',
    text: 'GraphQL uses the same syntax family for operations and schemas, so a single parse-and-print pass handles all of them: queries, mutations, subscriptions, fragments, and SDL type definitions (type, input, enum, interface).',
    table: [
      { label: 'Operations', value: 'query, mutation, subscription — with variables and arguments' },
      { label: 'Fragments', value: 'fragment ... on Type { } and ...spread usage' },
      { label: 'SDL', value: 'type, input, enum, interface, union definitions' },
    ],
  },
  {
    title: 'Common use cases',
    text: [
      'Paste a minified query copied from a network tab or a GraphQL Playground/Apollo Studio history entry to make it readable before pasting it into a PR description or documentation.',
      'Backend developers use it to clean up SDL pasted from a schema-first API definition. Everything runs locally, so it is safe to paste queries containing internal field or type names.',
    ],
  },
]
</script>
