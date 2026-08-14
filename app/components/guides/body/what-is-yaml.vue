<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>YAML</strong> (YAML Ain't Markup Language — yes, a recursive acronym) is a human-friendly
        data serialization format. Where JSON uses braces and brackets, YAML uses indentation and
        minimal punctuation, making it easier to read and write by hand. It is the format of choice
        for configuration files: Docker Compose, Kubernetes manifests, GitHub Actions, and Ansible
        playbooks are all YAML.
      </p>
    </section>

    <section class="guide-section">
      <h2>YAML vs JSON at a glance</h2>
      <p>The same data in both formats:</p>
      <div class="two-col">
        <div>
          <p class="col-label">YAML</p>
          <pre class="code-block" data-lang="yaml"><code class="shiki-code"><span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">name</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> Alice Martin</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">age</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 28</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">active</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> true</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">roles</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#FF79C6">  -</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> admin</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#FF79C6">  -</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> editor</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">address</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  city</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> Paris</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  country</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> France</span></span></code></pre>
        </div>
        <div>
          <p class="col-label">JSON</p>
          <pre class="code-block" data-lang="json"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">{</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">name</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Alice Martin</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">age</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 28</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">active</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> true</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">roles</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> [</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#032F62;--shiki-dark:#F1FA8C">admin</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#032F62;--shiki-dark:#F1FA8C">editor</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">],</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">address</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> {</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">city</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Paris</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">country</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">France</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  }</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">}</span></span></code></pre>
        </div>
      </div>
      <p>
        YAML is a superset of JSON — every valid JSON document is also valid YAML.
        Conversely, YAML supports features JSON does not: comments, multi-line strings, anchors, and aliases.
      </p>
      <p>This site's <NuxtLink to="/tools/yaml-to-json" class="guide-inline-link">YAML ↔ JSON Converter</NuxtLink> turns the block on the left into the block on the right, or back again, instantly.</p>
    </section>

    <section class="guide-section">
      <h2>YAML syntax essentials</h2>
      <h3>Scalars</h3>
      <pre class="code-block" data-lang="yaml"><code class="shiki-code"><span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">string_bare</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> hello world</span><span style="color:#6A737D;--shiki-dark:#6272A4">          # no quotes needed for simple strings</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">string_quoted</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">must quote: this</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#6A737D;--shiki-dark:#6272A4"> # quotes needed when value contains : or #</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">number</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 42</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">float</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 3.14</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">boolean_true</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> true</span><span style="color:#6A737D;--shiki-dark:#6272A4">                # also: yes, on, True, TRUE (be careful!)</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">boolean_false</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> false</span><span style="color:#6A737D;--shiki-dark:#6272A4">              # also: no, off, False, FALSE</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">null_value</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> null</span><span style="color:#6A737D;--shiki-dark:#6272A4">                  # also: ~</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">date</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#FFB86C"> 2026-01-15</span><span style="color:#6A737D;--shiki-dark:#6272A4">                  # bare dates are parsed as dates, not strings</span></span></code></pre>

      <h3>Sequences (lists)</h3>
      <pre class="code-block" data-lang="yaml"><code class="shiki-code"><span class="line"><span style="color:#6A737D;--shiki-dark:#6272A4"># Block style (most common in config files)</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">fruits</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#FF79C6">  -</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> apple</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#FF79C6">  -</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> banana</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#FF79C6">  -</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> cherry</span></span>
<span class="line"/>
<span class="line"><span style="color:#6A737D;--shiki-dark:#6272A4"># Flow style (looks like JSON)</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">fruits</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> [</span><span style="color:#032F62;--shiki-dark:#F1FA8C">apple</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#032F62;--shiki-dark:#F1FA8C">banana</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#032F62;--shiki-dark:#F1FA8C">cherry</span><span style="color:#24292E;--shiki-dark:#F8F8F2">]</span></span></code></pre>

      <h3>Mappings (objects)</h3>
      <pre class="code-block" data-lang="yaml"><code class="shiki-code"><span class="line"><span style="color:#6A737D;--shiki-dark:#6272A4"># Block style</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">server</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  host</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> localhost</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  port</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 8080</span></span>
<span class="line"/>
<span class="line"><span style="color:#6A737D;--shiki-dark:#6272A4"># Flow style</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">server</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> { </span><span style="color:#22863A;--shiki-dark:#8BE9FD">host</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> localhost</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#22863A;--shiki-dark:#8BE9FD">port</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 8080</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> }</span></span></code></pre>

      <h3>Multi-line strings</h3>
      <pre class="code-block" data-lang="yaml"><code class="shiki-code"><span class="line"><span style="color:#6A737D;--shiki-dark:#6272A4"># Literal block (|) — preserves newlines</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">message</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#D73A49;--shiki-dark:#FF79C6"> |</span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  Line one.</span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  Line two.</span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  Line three.</span></span>
<span class="line"/>
<span class="line"><span style="color:#6A737D;--shiki-dark:#6272A4"># Folded block (>) — newlines become spaces, blank lines become newlines</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">description</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#D73A49;--shiki-dark:#FF79C6"> ></span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  This long sentence is split across</span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  multiple lines for readability but</span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  will be joined into one line.</span></span></code></pre>

      <h3>Comments</h3>
      <pre class="code-block" data-lang="yaml"><code class="shiki-code"><span class="line"><span style="color:#6A737D;--shiki-dark:#6272A4"># This is a comment — JSON does not support comments, YAML does</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">port</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 8080</span><span style="color:#6A737D;--shiki-dark:#6272A4">  # inline comment</span></span></code></pre>
    </section>

    <section class="guide-section">
      <h2>Anchors and aliases</h2>
      <p>
        YAML lets you define a value once and reuse it, which is useful in large config files:
      </p>
      <pre class="code-block" data-lang="yaml"><code class="shiki-code"><span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">defaults</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#D73A49;--shiki-dark:#FF79C6"> &#x26;</span><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#8BE9FD;--shiki-dark-font-style:italic">defaults</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  timeout</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 30</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  retries</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 3</span></span>
<span class="line"/>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">production</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#BD93F9">  &#x3C;&#x3C;</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#D73A49;--shiki-dark:#FF79C6"> *</span><span style="color:#24292E;--shiki-light-font-style:inherit;--shiki-light-text-decoration:inherit;--shiki-dark:#50FA7B;--shiki-dark-font-style:italic;--shiki-dark-text-decoration:underline">defaults</span><span style="color:#6A737D;--shiki-dark:#6272A4">   # merge anchor — inherits timeout and retries</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  host</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> prod.example.com</span></span>
<span class="line"/>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">staging</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#BD93F9">  &#x3C;&#x3C;</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#D73A49;--shiki-dark:#FF79C6"> *</span><span style="color:#24292E;--shiki-light-font-style:inherit;--shiki-light-text-decoration:inherit;--shiki-dark:#50FA7B;--shiki-dark-font-style:italic;--shiki-dark-text-decoration:underline">defaults</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  host</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> staging.example.com</span></span></code></pre>
    </section>

    <section class="guide-section">
      <h2>Common YAML gotchas</h2>
      <h3>The Norway problem</h3>
      <p>
        In YAML 1.1 (used by many parsers), country codes like <code>NO</code>, <code>yes</code>, <code>on</code>,
        and <code>off</code> are parsed as booleans. Norway's ISO code <code>NO</code> silently becomes
        <code>false</code>, which breaks country lists. Always quote these values:
      </p>
      <pre class="code-block" data-lang="yaml"><code class="shiki-code"><span class="line"><span style="color:#6A737D;--shiki-dark:#6272A4"># Wrong — NO becomes false in YAML 1.1</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">countries</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> [</span><span style="color:#032F62;--shiki-dark:#F1FA8C">GB</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#032F62;--shiki-dark:#F1FA8C">FR</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#005CC5;--shiki-dark:#BD93F9">NO</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#032F62;--shiki-dark:#F1FA8C">DE</span><span style="color:#24292E;--shiki-dark:#F8F8F2">]</span></span>
<span class="line"/>
<span class="line"><span style="color:#6A737D;--shiki-dark:#6272A4"># Correct — quote the ambiguous value</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">countries</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> [</span><span style="color:#032F62;--shiki-dark:#F1FA8C">GB</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#032F62;--shiki-dark:#F1FA8C">FR</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#032F62;--shiki-dark:#F1FA8C">NO</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#032F62;--shiki-dark:#F1FA8C">DE</span><span style="color:#24292E;--shiki-dark:#F8F8F2">]</span></span></code></pre>
      <p>YAML 1.2 (the current standard) fixes this — only <code>true</code> and <code>false</code> are booleans.</p>

      <h3>Tabs are forbidden</h3>
      <p>
        YAML uses only spaces for indentation — never tabs. A tab character anywhere in the indentation
        is a syntax error. Most editors can be configured to insert spaces when you press Tab in YAML files.
      </p>

      <h3>Implicit type coercion</h3>
      <p>
        YAML parsers infer types from bare values. <code>1.0</code> becomes a float, <code>0x1A</code>
        becomes an integer (26), <code>1_000</code> becomes 1000, and ISO dates become date objects.
        Quote values you want treated as strings:
      </p>
      <pre class="code-block" data-lang="yaml"><code class="shiki-code"><span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">version</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">1.0</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#6A737D;--shiki-dark:#6272A4">     # string, not float</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">zip</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">01234</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#6A737D;--shiki-dark:#6272A4">       # string, not integer (leading zero stripped otherwise)</span></span></code></pre>
    </section>

    <section class="guide-section">
      <h2>When to use YAML</h2>
      <ul>
        <li><strong>Configuration files</strong> — Docker Compose, Kubernetes, GitHub Actions, Helm charts, Ansible.</li>
        <li><strong>Human-edited files</strong> — when humans write and maintain the file and comments are valuable.</li>
        <li><strong>CI/CD pipelines</strong> — virtually every CI platform (GitHub Actions, GitLab CI, CircleCI) uses YAML.</li>
      </ul>
      <p>
        For machine-generated data or API responses, JSON is usually better — it is simpler, has fewer
        gotchas, and is natively supported by every language. See the
        <NuxtLink to="/guides/json-vs-yaml" class="guide-inline-link">JSON vs YAML comparison guide</NuxtLink>
        for a full breakdown of when to choose each.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
.col-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--c-t4); margin-bottom: 6px; }
@media (max-width: 640px) { .two-col { grid-template-columns: 1fr; } }
</style>
