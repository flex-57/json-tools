<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>XML</strong> (eXtensible Markup Language) is a text format for storing and transporting
        structured data. Unlike HTML, which defines a fixed set of tags, XML lets you define your own tags —
        hence "extensible". It was standardized by the W3C in 1998 and was the dominant data interchange
        format for web services and configuration before JSON rose to prominence.
      </p>
    </section>

    <section class="guide-section">
      <h2>Basic structure</h2>
      <p>An XML document has a simple, consistent structure:</p>
      <pre class="code-block" data-lang="xml"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">&#x3C;?</span><span style="color:#22863A;--shiki-dark:#FF79C6">xml</span><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#50FA7B;--shiki-dark-font-style:italic"> version</span><span style="color:#24292E;--shiki-dark:#F8F8F2">=</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#032F62;--shiki-dark:#F1FA8C">1.0</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#50FA7B;--shiki-dark-font-style:italic"> encoding</span><span style="color:#24292E;--shiki-dark:#F8F8F2">=</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#032F62;--shiki-dark:#F1FA8C">UTF-8</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">?></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">&#x3C;</span><span style="color:#22863A;--shiki-dark:#FF79C6">user</span><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#50FA7B;--shiki-dark-font-style:italic"> id</span><span style="color:#24292E;--shiki-dark:#F8F8F2">=</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#032F62;--shiki-dark:#F1FA8C">42</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  &#x3C;</span><span style="color:#22863A;--shiki-dark:#FF79C6">name</span><span style="color:#24292E;--shiki-dark:#F8F8F2">>Alice Martin&#x3C;/</span><span style="color:#22863A;--shiki-dark:#FF79C6">name</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  &#x3C;</span><span style="color:#22863A;--shiki-dark:#FF79C6">email</span><span style="color:#24292E;--shiki-dark:#F8F8F2">>alice@example.com&#x3C;/</span><span style="color:#22863A;--shiki-dark:#FF79C6">email</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  &#x3C;</span><span style="color:#22863A;--shiki-dark:#FF79C6">roles</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">    &#x3C;</span><span style="color:#22863A;--shiki-dark:#FF79C6">role</span><span style="color:#24292E;--shiki-dark:#F8F8F2">>admin&#x3C;/</span><span style="color:#22863A;--shiki-dark:#FF79C6">role</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">    &#x3C;</span><span style="color:#22863A;--shiki-dark:#FF79C6">role</span><span style="color:#24292E;--shiki-dark:#F8F8F2">>editor&#x3C;/</span><span style="color:#22863A;--shiki-dark:#FF79C6">role</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  &#x3C;/</span><span style="color:#22863A;--shiki-dark:#FF79C6">roles</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  &#x3C;</span><span style="color:#22863A;--shiki-dark:#FF79C6">active</span><span style="color:#24292E;--shiki-dark:#F8F8F2">>true&#x3C;/</span><span style="color:#22863A;--shiki-dark:#FF79C6">active</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">&#x3C;/</span><span style="color:#22863A;--shiki-dark:#FF79C6">user</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span></code></pre>
      <table class="cheat-table">
        <thead><tr><th>Concept</th><th>Description</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><strong>Declaration</strong></td><td>Optional opening line specifying XML version and encoding</td><td><code>&lt;?xml version="1.0"?&gt;</code></td></tr>
          <tr><td><strong>Element</strong></td><td>A named opening and closing tag pair — the basic building block</td><td><code>&lt;name&gt;Alice&lt;/name&gt;</code></td></tr>
          <tr><td><strong>Attribute</strong></td><td>Key-value pair inside an opening tag</td><td><code>&lt;user id="42"&gt;</code></td></tr>
          <tr><td><strong>Root element</strong></td><td>Every XML document must have exactly one root element</td><td><code>&lt;user&gt;...&lt;/user&gt;</code></td></tr>
          <tr><td><strong>Self-closing tag</strong></td><td>Empty element with no content</td><td><code>&lt;br /&gt;</code></td></tr>
          <tr><td><strong>CDATA section</strong></td><td>Raw text that should not be parsed as markup</td><td><code>&lt;![CDATA[&lt;b&gt;raw&lt;/b&gt;]]&gt;</code></td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Well-formed vs valid XML</h2>
      <p>
        These two terms are often confused:
      </p>
      <ul>
        <li>
          <strong>Well-formed</strong> — the document follows XML syntax rules: every tag is closed,
          attributes are quoted, there is exactly one root element, and special characters (<code>&lt; &gt; &amp; " '</code>)
          are escaped as entities (<code>&amp;lt; &amp;gt; &amp;amp; &amp;quot; &amp;apos;</code>).
          Any XML parser can read a well-formed document.
        </li>
        <li>
          <strong>Valid</strong> — the document conforms to a schema (DTD or XSD) that defines which
          elements and attributes are allowed and in what order. Validity requires a schema definition
          and a validating parser.
        </li>
      </ul>
      <p>Most applications only require well-formed XML. Schemas are used in enterprise integrations like SOAP.</p>
    </section>

    <section class="guide-section">
      <h2>XML vs JSON</h2>
      <table class="cheat-table">
        <thead><tr><th/><th>XML</th><th>JSON</th></tr></thead>
        <tbody>
          <tr><td>Syntax</td><td>Tag-based, verbose</td><td>Key-value, concise</td></tr>
          <tr><td>Comments</td><td>Yes — <code>&lt;!-- comment --&gt;</code></td><td>No</td></tr>
          <tr><td>Attributes</td><td>Yes — metadata on elements</td><td>No — everything is a value</td></tr>
          <tr><td>Data types</td><td>All text by default; types from schema</td><td>Native strings, numbers, booleans, null</td></tr>
          <tr><td>Arrays</td><td>Repeated sibling elements (no explicit array syntax)</td><td>First-class <code>[]</code> syntax</td></tr>
          <tr><td>Namespaces</td><td>Yes — for merging vocabularies</td><td>No</td></tr>
          <tr><td>Human readability</td><td>Moderate (verbose)</td><td>High (concise)</td></tr>
          <tr><td>Browser support</td><td>XPath, XSLT, DOM</td><td>Native <code>JSON.parse()</code></td></tr>
          <tr><td>Typical payload size</td><td>Larger (tag overhead)</td><td>Smaller</td></tr>
        </tbody>
      </table>
      <p>This site's <NuxtLink to="/tools/xml-to-json" class="guide-inline-link">XML ↔ JSON Converter</NuxtLink> switches between the two formats, handling attributes and repeated elements without manual cleanup.</p>
    </section>

    <section class="guide-section">
      <h2>Where XML is still used</h2>
      <p>
        Despite JSON dominating REST APIs, XML is still widely used in:
      </p>
      <ul>
        <li><strong>SOAP web services</strong> — enterprise systems, banking, ERP (SAP, Oracle) still rely on SOAP/XML heavily.</li>
        <li><strong>RSS and Atom feeds</strong> — blog and news syndication formats are XML-based.</li>
        <li><strong>SVG</strong> — scalable vector graphics are XML documents.</li>
        <li><strong>Android layouts</strong> — UI layouts in Android apps are defined in XML.</li>
        <li><strong>Build tools</strong> — Maven (<code>pom.xml</code>), Ant, and older Spring configs.</li>
        <li><strong>Microsoft Office</strong> — .docx, .xlsx, and .pptx files are ZIP archives of XML files.</li>
        <li><strong>XHTML</strong> — stricter HTML that follows XML rules.</li>
      </ul>
    </section>

    <section class="guide-section">
      <h2>Namespaces</h2>
      <p>
        When combining XML vocabularies from different sources, element names can clash.
        XML namespaces solve this by prefixing elements with a URI:
      </p>
      <pre class="code-block" data-lang="xml"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">&#x3C;</span><span style="color:#22863A;--shiki-dark:#FF79C6">root</span></span>
<span class="line"><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#50FA7B;--shiki-dark-font-style:italic">  xmlns</span><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#FF79C6;--shiki-dark-font-style:italic">:</span><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#50FA7B;--shiki-dark-font-style:italic">html</span><span style="color:#24292E;--shiki-dark:#F8F8F2">=</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#032F62;--shiki-dark:#F1FA8C">http://www.w3.org/1999/xhtml</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span></span>
<span class="line"><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#50FA7B;--shiki-dark-font-style:italic">  xmlns</span><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#FF79C6;--shiki-dark-font-style:italic">:</span><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#50FA7B;--shiki-dark-font-style:italic">dc</span><span style="color:#24292E;--shiki-dark:#F8F8F2">=</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#032F62;--shiki-dark:#F1FA8C">http://purl.org/dc/elements/1.1/</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  &#x3C;</span><span style="color:#22863A;--shiki-dark:#FF79C6">html:p</span><span style="color:#24292E;--shiki-dark:#F8F8F2">>A paragraph&#x3C;/</span><span style="color:#22863A;--shiki-dark:#FF79C6">html:p</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  &#x3C;</span><span style="color:#22863A;--shiki-dark:#FF79C6">dc:title</span><span style="color:#24292E;--shiki-dark:#F8F8F2">>A Dublin Core title&#x3C;/</span><span style="color:#22863A;--shiki-dark:#FF79C6">dc:title</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">&#x3C;/</span><span style="color:#22863A;--shiki-dark:#FF79C6">root</span><span style="color:#24292E;--shiki-dark:#F8F8F2">></span></span></code></pre>
      <p>
        Namespaces are common in enterprise XML (SOAP envelopes, XSLT stylesheets) but rarely needed
        in simple XML documents.
      </p>
      <p>
        For a side-by-side format comparison, see the <NuxtLink to="/guides/json-vs-yaml" class="guide-inline-link">JSON vs YAML guide</NuxtLink>
        — XML, JSON, and YAML all represent the same data in different ways.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 16px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
