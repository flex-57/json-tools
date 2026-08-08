<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> XML</h1>
        <p class="page-subtitle">Convert a JSON object to XML. Paste or drop a .json file.</p>
      </div>
      <ToolSwitch from-path="/tools/xml-to-json" to-path="/tools/json-to-xml" from-label="XML → JSON" to-label="JSON → XML" />
    </div>

    <Transition name="fade">
      <ErrorBanner
        v-if="error"
        :message="errorTip || error"
        :line="errorLine"
        :column="errorColumn"
        @jump="errorLine && inputEditorRef?.scrollToLine(errorLine)"
      />
    </Transition>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging, 'pane--invalid': error }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">JSON Input</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .json file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor ref="inputEditorRef" v-model="input" :error-line="errorLine" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">XML Output</span>
          <div class="card-actions">
            <button class="btn-xs" :disabled="!output" @click="download">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <Transition name="reveal" mode="out-in">
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see XML output' : 'Paste JSON to see XML output' }}</p>
            <div v-else key="output" class="pane-body-editor-wrap">
              <ClientOnly>
                <JsonEditor v-model="output" :readonly="true" lang="xml" />
                <template #fallback><EditorSkeleton /></template>
              </ClientOnly>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <StatusBar>
      <span>
        <span class="led" :class="output && !error ? 'valid' : 'error'"/>
        {{ output && !error ? 'Converted' : (error ? `Invalid${errorLine ? ` · Line ${errorLine}, Column ${errorColumn}` : ''}` : 'Waiting for input') }}
      </span>
      <span>json-to-xml</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonToXml } from '~/composables/useXmlJson'
import JsonEditor from '~/components/JsonEditor.vue'
useToolSeo(
  'JSON to XML Converter: Generate Valid XML from JSON Online',
  'Convert JSON to valid XML instantly in your browser. Object keys become elements, and @-prefixed keys become attributes. Free, no data sent to servers.',
)
const { input, output, error, errorTip, errorLine, errorColumn, copied, copy, download, clear } = useJsonToXml()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

const seoCards = [
  {
    title: 'Why generate XML from JSON',
    text: [
      'Enterprise service buses, SOAP APIs, SAP integrations, and legacy B2B platforms often require XML payloads. If your application stores data as JSON but needs to talk to one of these systems, generating XML by hand is error-prone.',
      'Paste your JSON object, get valid XML back, and use it directly in your SOAP envelope or configuration file.',
    ],
  },
  {
    title: 'How JSON keys become XML elements',
    text: 'One constraint: XML element names cannot start with a number or contain spaces, so keep your JSON keys valid XML identifiers to get clean output.',
    table: [
      { label: 'Key', value: 'Becomes the XML element name' },
      { label: 'String / number', value: 'Becomes text content' },
      { label: 'Array', value: 'Repeated sibling elements with the same tag' },
      { label: 'Nested object', value: 'Nested elements' },
    ],
  },
  {
    title: 'Integration and config use cases',
    text: [
      'Developers use this to prototype SOAP request bodies before building a client library. Teams migrating data between systems generate XML configuration files from JSON seed data.',
      'QA engineers create XML test fixtures from JSON responses captured in staging. The download button lets you save the output directly as a .xml file.',
    ],
  },
]
const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}
</script>
