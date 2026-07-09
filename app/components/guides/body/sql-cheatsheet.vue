<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        A quick reference for SQL query syntax: clause order, joins, common functions, and where MySQL,
        PostgreSQL, SQLite, and T-SQL disagree. Paste any query into the
        <NuxtLink to="/tools/sql-formatter" class="guide-inline-link">SQL Formatter</NuxtLink>
        to have it beautified for the dialect you pick.
      </p>
    </section>

    <section class="guide-section">
      <h2>Clause order: written vs executed</h2>
      <p>
        SQL is written in one order but evaluated in a different one — this is the single most common source
        of confusion for anyone new to the language, including why a column alias defined in <code>SELECT</code>
        cannot be used in that same query's <code>WHERE</code> clause.
      </p>
      <table class="cheat-table">
        <thead><tr><th>Written order</th><th>Logical execution order</th></tr></thead>
        <tbody>
          <tr><td>1. <code>SELECT</code></td><td>4. <code>SELECT</code></td></tr>
          <tr><td>2. <code>FROM</code></td><td>1. <code>FROM</code></td></tr>
          <tr><td>3. <code>WHERE</code></td><td>2. <code>WHERE</code></td></tr>
          <tr><td>4. <code>GROUP BY</code></td><td>3. <code>GROUP BY</code> / <code>HAVING</code></td></tr>
          <tr><td>5. <code>HAVING</code></td><td>5. <code>ORDER BY</code></td></tr>
          <tr><td>6. <code>ORDER BY</code></td><td>6. <code>LIMIT</code> / <code>OFFSET</code></td></tr>
          <tr><td>7. <code>LIMIT</code></td><td>—</td></tr>
        </tbody>
      </table>
      <p>
        Because <code>FROM</code> and <code>WHERE</code> run before <code>SELECT</code> even exists, a
        <code>WHERE</code> clause cannot reference a column alias created in <code>SELECT</code> — that alias
        does not exist yet at the point <code>WHERE</code> is evaluated. <code>ORDER BY</code>, which runs
        last, can reference <code>SELECT</code> aliases without issue.
      </p>
    </section>

    <section class="guide-section">
      <h2>Joins</h2>
      <table class="cheat-table">
        <thead><tr><th>Join</th><th>Returns</th></tr></thead>
        <tbody>
          <tr><td><code>INNER JOIN</code></td><td>Only rows with a match in both tables</td></tr>
          <tr><td><code>LEFT JOIN</code></td><td>All rows from the left table, matched rows from the right, <code>NULL</code> where no match</td></tr>
          <tr><td><code>RIGHT JOIN</code></td><td>All rows from the right table, matched rows from the left, <code>NULL</code> where no match</td></tr>
          <tr><td><code>FULL OUTER JOIN</code></td><td>All rows from both tables, <code>NULL</code> on whichever side has no match</td></tr>
          <tr><td><code>CROSS JOIN</code></td><td>Every row from the left paired with every row from the right (cartesian product)</td></tr>
        </tbody>
      </table>
      <p class="footnote">SQLite and MySQL (before 8.0.14) do not support <code>FULL OUTER JOIN</code> directly — it is commonly emulated with a <code>LEFT JOIN</code> and a <code>RIGHT JOIN</code> combined with <code>UNION</code>.</p>
    </section>

    <section class="guide-section">
      <h2>Filtering</h2>
      <table class="cheat-table">
        <thead><tr><th>Operator</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>=</code>, <code>&lt;&gt;</code> / <code>!=</code></td><td>Equal, not equal</td></tr>
          <tr><td><code>BETWEEN a AND b</code></td><td>Inclusive range</td></tr>
          <tr><td><code>IN (a, b, c)</code></td><td>Matches any value in the list</td></tr>
          <tr><td><code>LIKE '%abc%'</code></td><td>Pattern match — <code>%</code> any sequence, <code>_</code> any single character</td></tr>
          <tr><td><code>IS NULL</code> / <code>IS NOT NULL</code></td><td>NULL check — never use <code>= NULL</code>, it never matches</td></tr>
        </tbody>
      </table>
      <p>
        <code>NULL</code> is not a value that can be compared with <code>=</code>: it represents "unknown,"
        and any comparison against unknown is itself unknown, not true. <code>WHERE col = NULL</code> silently
        matches zero rows instead of raising an error.
      </p>
    </section>

    <section class="guide-section">
      <h2>Aggregates and GROUP BY</h2>
      <table class="cheat-table">
        <thead><tr><th>Function</th><th>Returns</th></tr></thead>
        <tbody>
          <tr><td><code>COUNT(*)</code></td><td>Number of rows</td></tr>
          <tr><td><code>SUM(col)</code></td><td>Sum of a numeric column</td></tr>
          <tr><td><code>AVG(col)</code></td><td>Average of a numeric column</td></tr>
          <tr><td><code>MIN(col)</code> / <code>MAX(col)</code></td><td>Smallest / largest value</td></tr>
        </tbody>
      </table>
      <p>
        Every non-aggregated column in <code>SELECT</code> must appear in <code>GROUP BY</code>. Filter on an
        aggregate with <code>HAVING</code>, not <code>WHERE</code> — <code>WHERE</code> runs before grouping
        happens, so it cannot see the aggregated result yet.
      </p>
    </section>

    <section class="guide-section">
      <h2>Dialect differences</h2>
      <table class="cheat-table">
        <thead><tr><th>Feature</th><th>MySQL</th><th>PostgreSQL</th><th>SQLite</th><th>T-SQL</th></tr></thead>
        <tbody>
          <tr><td>Limit rows</td><td><code>LIMIT n</code></td><td><code>LIMIT n</code></td><td><code>LIMIT n</code></td><td><code>TOP n</code></td></tr>
          <tr><td>Quote identifiers</td><td><code>`name`</code></td><td><code>"name"</code></td><td><code>"name"</code></td><td><code>[name]</code></td></tr>
          <tr><td>String concat</td><td><code>CONCAT(a,b)</code></td><td><code>a || b</code></td><td><code>a || b</code></td><td><code>a + b</code></td></tr>
          <tr><td>Auto-increment PK</td><td><code>AUTO_INCREMENT</code></td><td><code>SERIAL</code> / <code>GENERATED ALWAYS AS IDENTITY</code></td><td><code>AUTOINCREMENT</code></td><td><code>IDENTITY(1,1)</code></td></tr>
        </tbody>
      </table>
      <p>
        Standard SQL (ISO/ANSI) uses <code>FETCH FIRST n ROWS ONLY</code> for row limiting, which
        <code>LIMIT</code> and <code>TOP</code> both predate as vendor extensions — PostgreSQL and modern SQL
        Server both support the standard form too, alongside their own.
      </p>
    </section>

  </div>
</template>

<style scoped>
.footnote { font-size: 12px; color: var(--c-t4); line-height: 1.6; }
</style>
