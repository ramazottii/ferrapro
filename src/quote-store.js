// Independent immutable keys prevent concurrent public requests from overwriting
// each other or the panel's shared state. Existing state records stay untouched.
const PREFIX = 'vitrin-quote:';

export async function storeQuote(env, fields) {
  const id = crypto.randomUUID();
  const record = { id, ...fields, created_at: new Date().toISOString() };
  await env.KV.put(PREFIX + id, JSON.stringify(record));
  return record;
}

export async function readQuotes(env, legacy = []) {
  const records = [...legacy];
  let cursor;
  do {
    const page = await env.KV.list({ prefix: PREFIX, ...(cursor ? { cursor } : {}) });
    // Bounded batches avoid a burst of hundreds of subrequests at once.
    for (let i = 0; i < page.keys.length; i += 20) {
      const batch = await Promise.all(page.keys.slice(i, i + 20).map(key => env.KV.get(key.name, 'json')));
      records.push(...batch.filter(Boolean));
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  return records.sort((a,b) => String(b.created_at).localeCompare(String(a.created_at)));
}
