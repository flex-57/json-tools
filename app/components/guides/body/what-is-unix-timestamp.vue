<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        A <strong>Unix timestamp</strong> (also called epoch time or POSIX time) counts the number of seconds
        that have elapsed since <strong>January 1, 1970, 00:00:00 UTC</strong> — the Unix epoch. The moment
        this guide was published is a single integer, not a string that needs parsing, and that integer means
        the same thing everywhere on Earth regardless of local timezone.
      </p>
      <p>
        That property — one number, no timezone, no locale, no ambiguous date format — is why it is the
        default way computers store and exchange points in time internally, even though humans never read it directly.
      </p>
    </section>

    <section class="guide-section">
      <h2>Reading a timestamp</h2>
      <pre class="code-block"><code>1751932800  →  2025-07-08T00:00:00Z</code></pre>
      <p>
        To go from the integer to a date by hand: divide by 86,400 (seconds in a day) to get days since the
        epoch, then count forward from January 1, 1970. In practice nobody does this by hand — every language's
        standard library converts in one call, and this site's
        <NuxtLink to="/tools/unix-timestamp" class="guide-inline-link">Unix Timestamp Converter</NuxtLink>
        does it instantly in both directions.
      </p>
    </section>

    <section class="guide-section">
      <h2>Seconds vs milliseconds</h2>
      <p>
        The one recurring source of confusion: some systems use seconds, others use milliseconds, and a
        timestamp is just a number with no built-in unit label.
      </p>
      <table class="cheat-table">
        <thead><tr><th>Language / API</th><th>Unit</th><th>Example call</th></tr></thead>
        <tbody>
          <tr><td>Unix <code>date +%s</code>, most databases</td><td>Seconds</td><td><code>date +%s</code></td></tr>
          <tr><td>JavaScript</td><td>Milliseconds</td><td><code>Date.now()</code></td></tr>
          <tr><td>Python</td><td>Seconds (float)</td><td><code>time.time()</code></td></tr>
          <tr><td>JWT <code>iat</code> / <code>exp</code> claims</td><td>Seconds</td><td><code>Math.floor(Date.now() / 1000)</code></td></tr>
        </tbody>
      </table>
      <p>
        A quick way to tell which one you have without checking docs: a real near-term date in
        <strong>seconds</strong> is a 10-digit number (under 10,000,000,000, which corresponds to the year
        2286). The same moment in <strong>milliseconds</strong> is a 13-digit number, three orders of
        magnitude larger. If the number is 13 digits long, divide by 1000 before treating it as seconds.
      </p>
    </section>

    <section class="guide-section">
      <h2>Common gotchas</h2>
      <h3>Passing seconds where milliseconds are expected</h3>
      <p>
        JavaScript's <code>Date</code> constructor takes milliseconds. <code>new Date(1751932800)</code> does
        not produce July 2025 — it produces a date about 20 days after the epoch, in January 1970, because the
        engine reads the value as milliseconds, not seconds:
      </p>
      <pre class="code-block" data-lang="js"><code class="shiki-code"><span class="line"><span style="color:#D73A49;--shiki-light-font-weight:inherit;--shiki-dark:#FF79C6;--shiki-dark-font-weight:bold">new</span><span style="color:#6F42C1;--shiki-dark:#50FA7B"> Date</span><span style="color:#24292E;--shiki-dark:#F8F8F2">(</span><span style="color:#005CC5;--shiki-dark:#BD93F9">1751932800</span><span style="color:#24292E;--shiki-dark:#F8F8F2">)         </span><span style="color:#6A737D;--shiki-dark:#6272A4">// ✗ Wed Jan 21 1970 — treated as ms</span></span>
<span class="line"><span style="color:#D73A49;--shiki-light-font-weight:inherit;--shiki-dark:#FF79C6;--shiki-dark-font-weight:bold">new</span><span style="color:#6F42C1;--shiki-dark:#50FA7B"> Date</span><span style="color:#24292E;--shiki-dark:#F8F8F2">(</span><span style="color:#005CC5;--shiki-dark:#BD93F9">1751932800</span><span style="color:#D73A49;--shiki-dark:#FF79C6"> *</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 1000</span><span style="color:#24292E;--shiki-dark:#F8F8F2">)  </span><span style="color:#6A737D;--shiki-dark:#6272A4">// ✓ Tue Jul 08 2025 — converted to ms first</span></span></code></pre>
      <h3>The Year 2038 problem</h3>
      <p>
        Systems that store a Unix timestamp as a signed 32-bit integer run out of room at
        2,147,483,647 seconds — <strong>January 19, 2038, 03:14:07 UTC</strong>. One second later, the value
        overflows and wraps to a large negative number, which most software interprets as December 1901.
        Modern systems use 64-bit integers, which do not run out until roughly 292 billion years from now, but
        older embedded systems and file formats are still exposed.
      </p>
      <h3>Leap seconds are not counted</h3>
      <p>
        Unix time defines every day as exactly 86,400 seconds, full stop. When the International Earth
        Rotation Service inserts a leap second into UTC to keep clocks aligned with Earth's rotation, Unix
        time does not gain a corresponding second — the discrepancy is absorbed differently depending on the
        system (repeating or "smearing" the extra second). For everyday application logic this rarely matters;
        it matters a great deal for systems that need sub-second precision across a leap-second boundary.
      </p>
    </section>

    <section class="guide-section">
      <h2>Why not just store a formatted date string?</h2>
      <p>
        A string like <code>07/08/2025</code> is ambiguous (US month-first vs the rest-of-world day-first
        convention), locale-dependent, and awkward to do arithmetic on. A Unix timestamp is a plain integer:
        comparing two events, computing a duration, or sorting a list of events by time is regular number
        arithmetic, no date-parsing library required. Formatting to a human-readable string is treated as a
        display concern, done at the last possible moment, in the viewer's own timezone.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
