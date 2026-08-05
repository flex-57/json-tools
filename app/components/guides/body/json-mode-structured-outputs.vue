<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        By default, an LLM is a free-text generator: nothing stops it from wrapping a JSON response in a
        markdown code fence, adding a sentence of commentary before it, or drifting from the shape you asked
        for. <strong>JSON mode</strong> and <strong>structured outputs</strong> are API-level features that
        remove that uncertainty, with two different strength levels behind those names.
      </p>
    </section>

    <section class="guide-section">
      <h2>Two tiers, not one feature</h2>
      <table class="cheat-table">
        <thead><tr><th/><th>JSON mode</th><th>Structured outputs</th></tr></thead>
        <tbody>
          <tr><td>Guarantees</td><td>Syntactically valid JSON</td><td>Valid JSON matching your exact schema</td></tr>
          <tr><td>How it's enforced</td><td>Model is instructed to emit JSON</td><td>Constrained at the token-sampling layer: the decoder cannot emit a token that would violate the schema</td></tr>
          <tr><td>Shape control</td><td>None — any valid JSON passes</td><td>Full — required fields, types, enums, nesting all enforced</td></tr>
          <tr><td>Status (2026)</td><td>Legacy on most providers</td><td>The production default for extraction and agent workflows</td></tr>
        </tbody>
      </table>
      <p>
        The practical difference is large. In OpenAI's own evaluations, schema-constrained structured outputs
        reach 100% schema compliance, function calling reaches roughly 86%, and plain JSON mode with no schema
        trails both. If you are parsing the result in code rather than just displaying it to a person,
        the constrained option is worth the extra setup.
      </p>
    </section>

    <section class="guide-section">
      <h2>How each major provider implements it</h2>
      <table class="cheat-table">
        <thead><tr><th>Provider</th><th>Field / mechanism</th><th>Schema dialect</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>OpenAI</strong></td>
            <td><code>response_format: type=json_schema, strict=true</code></td>
            <td>Standard JSON Schema</td>
          </tr>
          <tr>
            <td><strong>Anthropic Claude</strong></td>
            <td>Native <code>output_format</code> with <code>json_schema</code>, or a forced tool call (<code>tool_choice</code> naming a specific tool)</td>
            <td>Standard JSON Schema</td>
          </tr>
          <tr>
            <td><strong>Google Gemini</strong></td>
            <td><code>responseMimeType: "application/json"</code> plus <code>responseSchema</code></td>
            <td>OpenAPI-subset schema historically; a separate <code>responseJsonSchema</code> field accepts standard JSON Schema</td>
          </tr>
        </tbody>
      </table>
      <p>
        Gemini also has a provider-specific option, <code>propertyOrdering</code>, that fixes the order fields
        are emitted in. Field order does not usually matter for parsing JSON, but it can measurably affect
        answer quality, since the model reasons about earlier fields before generating later ones.
      </p>
      <p>
        Field and parameter names shift as providers ship new API versions. Treat the table above as a starting
        point, and confirm the exact field name against the provider's own current documentation before
        shipping.
      </p>
    </section>

    <section class="guide-section">
      <h2>Building and checking the schema</h2>
      <p>
        Write the schema by hand for anything simple, or generate a starting point from a real example response
        using this site's <NuxtLink to="/tools/json-schema" class="guide-inline-link">JSON Schema Generator</NuxtLink>:
        paste a JSON object shaped the way you want the model's output to look, and it infers the types,
        required fields, and structure for you to refine.
      </p>
      <p>
        Once a model actually returns something, validate and inspect it with the
        <NuxtLink to="/tools/json-formatter" class="guide-inline-link">JSON Formatter</NuxtLink> rather than
        assuming the schema constraint alone caught every problem: it still helps to see the real output,
        especially while iterating on a schema or debugging a refusal case.
      </p>
    </section>

    <section class="guide-section">
      <h2>What structured outputs do not solve</h2>
      <p>
        A schema constraint guarantees shape, not correctness. The model can still put a wrong but
        correctly-typed value into a field, since nothing about JSON Schema validation touches factual
        accuracy. Keep validating and spot-checking values the same way you would for any other model output.
      </p>
      <p>
        Refusals are the other case worth handling explicitly: a model can decline to produce the content at
        all (a safety refusal, or a request outside what it will do), and that response usually arrives in a
        different field than the structured result would. Code that only checks "did this parse as JSON" will
        treat a refusal as a mysterious failure instead of the distinct, expected case it actually is.
      </p>
    </section>

  </div>
</template>
