export type BrevoContactResult = {
  ok: boolean;
  status?: number;
  skipped?: boolean;
  error?: string;
};

/**
 * Best-effort Brevo contact upsert. Never throws — callers keep DB as source of truth.
 */
export async function addBrevoContact(
  email: string,
  opts?: { listId?: number; source?: string },
): Promise<BrevoContactResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    console.warn('[brevo] BREVO_API_KEY missing — skipping remote sync');
    return { ok: false, skipped: true, error: 'BREVO_API_KEY missing' };
  }

  const listIdRaw = opts?.listId ?? Number(process.env.BREVO_LIST_ID);
  const listIds =
    Number.isFinite(listIdRaw) && listIdRaw > 0 ? [listIdRaw] : undefined;

  const body: Record<string, unknown> = {
    email,
    updateEnabled: true,
    attributes: {
      SOURCE: opts?.source || 'website',
    },
  };
  if (listIds) body.listIds = listIds;

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    // 201 created, 204 updated / already exists with updateEnabled
    if (res.ok || res.status === 204) {
      return { ok: true, status: res.status };
    }

    // Duplicate contact is still success for our purposes
    if (res.status === 400) {
      const text = await res.text().catch(() => '');
      if (/already|duplicate|exist/i.test(text)) {
        return { ok: true, status: res.status };
      }
      console.error('[brevo] contact rejected', res.status, text.slice(0, 500));
      return { ok: false, status: res.status, error: text.slice(0, 200) };
    }

    const text = await res.text().catch(() => '');
    console.error('[brevo] contact sync failed', res.status, text.slice(0, 500));
    return { ok: false, status: res.status, error: text.slice(0, 200) };
  } catch (err) {
    console.error('[brevo] contact sync error', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Brevo error',
    };
  }
}
