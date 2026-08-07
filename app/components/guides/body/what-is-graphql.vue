<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>GraphQL</strong> is a query language and server-side runtime for APIs, created at Facebook in
        2012 and open-sourced in 2015. Instead of a fixed set of endpoints that each return a fixed shape of
        data, a GraphQL API exposes one endpoint and lets the client describe exactly which fields it wants,
        across however many related types, in a single request.
      </p>
      <p>
        It's not a database and doesn't replace one. A GraphQL server's resolvers fetch data from whatever
        actually stores it, SQL, a document store, a REST API, another service, GraphQL just defines the
        contract for asking for it and the shape of what comes back.
      </p>
    </section>

    <section class="guide-section">
      <h2>The problem it solves: over-fetching and under-fetching</h2>
      <p>
        A REST endpoint like <code>/api/users/42</code> returns whatever shape the server decided on, so a
        mobile screen that only needs a name and an avatar URL still downloads the full user object
        (over-fetching), and a screen needing a user's posts and their comments needs multiple round trips or a
        bespoke endpoint built just for that screen (under-fetching).
      </p>
      <pre class="code-block"><code>query GetUserWithPosts($id: ID!) {
  user(id: $id) {
    name
    avatarUrl
    posts(first: 5) {
      title
      publishedAt
    }
  }
}</code></pre>
      <p>
        One request, exactly the fields asked for, however deep the nesting. The tradeoff moves complexity to
        the server: a naive resolver for <code>posts</code> that runs one query per user is the classic N+1
        problem, which is why production GraphQL servers lean on request-scoped batching (DataLoader and
        similar) to collapse those into a single query.
      </p>
    </section>

    <section class="guide-section">
      <h2>Queries, mutations, and subscriptions</h2>
      <table class="cheat-table">
        <thead><tr><th/><th>Purpose</th><th>Side effects</th></tr></thead>
        <tbody>
          <tr><td>Query</td><td>Read data</td><td>None expected</td></tr>
          <tr><td>Mutation</td><td>Create, update, delete</td><td>Yes, and the spec runs them sequentially per request</td></tr>
          <tr><td>Subscription</td><td>Real-time updates</td><td>Long-lived connection, typically WebSockets</td></tr>
        </tbody>
      </table>
      <p>
        Mutations running sequentially (not in parallel, unlike queries in the same request) matters when one
        mutation's result affects the next, GraphQL guarantees that ordering so you don't have to work around a race.
      </p>
    </section>

    <section class="guide-section">
      <h2>SDL: the schema, written by the server</h2>
      <p>
        The Schema Definition Language is how a GraphQL API declares its own shape, every type, field, and
        argument the server exposes:
      </p>
      <pre class="code-block"><code>type User {
  id: ID!
  name: String!
  posts(first: Int): [Post!]!
}

type Post {
  title: String!
  publishedAt: String
}</code></pre>
      <p>
        A trailing <code>!</code> marks a field non-nullable. SDL and queries share the same underlying grammar,
        which is why a single parser, <a href="https://github.com/graphql/graphql-js" target="_blank" rel="noopener">graphql-js</a>,
        the reference JavaScript implementation, handles both. The
        <NuxtLink to="/tools/graphql-formatter" class="guide-inline-link">GraphQL Formatter</NuxtLink> on this
        site is built on that same parser: paste a minified query from a network tab, or SDL from a schema file,
        and it re-prints either with consistent indentation.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
