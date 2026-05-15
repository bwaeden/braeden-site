// components/contact/ContactModal.tsx
// Source: PLAN.md 05-02-T1; UI-SPEC § Modal Composition; CONTEXT D-01..D-19.
//
// Client Component ('use client' — THE single client island per FOUND-07
// carve-out / 05-CONTEXT D-25 inheritance / Phase 5 D-04..D-19). Verified by
// tests/single-client-island.spec.ts AND tests/no-client-components.spec.ts
// (the latter updated atomically in this same commit to allow exactly this
// file). Every other surface on the site stays a Server Component.
//
// LOAD-BEARING PATTERN 1 — Hash-driven open via useEffect+hashchange (D-06):
//   Triggers stay as plain <a href="#contact"> Server-rendered links in
//   Nav.tsx + CTAArrowLink.tsx. The modal listens to window.location.hash
//   on mount + every hashchange. Plan 03 atomically swaps the two trigger
//   href values from "/" to "#contact" in a single commit; this component
//   is ready for that swap on Day 0.
//
// LOAD-BEARING PATTERN 2 — bypassedSuccess separate state (Pitfall 5):
//   The honeypot ('company' field, D-13) and min-time (1500ms, D-14) silent
//   rejections do NOT call useForm.handleSubmit (no Formspree network call).
//   They flip a local bypassedSuccess flag that renders the same success UI
//   as a real submit. From a bot's perspective, real-submit and gate-blocked
//   submit are indistinguishable — no state-change-after-submit signal to
//   train against.
//
// LOAD-BEARING PATTERN 3 — `transition-[border-color,color,opacity]` arbitrary
//   list, NOT the all-colors Tailwind shorthand (Pitfall 4 / Phase 2 02-04
//   e3ed657 / Phase 4 ProjectCard line 51). Tailwind v4's all-colors shorthand
//   includes outline-color, which 200ms-interpolates the :focus-visible 2px
//   accent ring from muted-to-accent on first frame after Tab. The arbitrary
//   list omits outline-color so the focus ring renders the locked accent
//   immediately. Verified GREEN by tests/focus-ring.spec.ts.

'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { site } from '@/data/site';

// Build-time inlined env var (Next.js inlines NEXT_PUBLIC_* at build time per
// Phase 1 D-13). Literal fallback 'xqeypnkw' is dev-safety; the env var is
// already set in Vercel project across Production + Preview + Development.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'xqeypnkw';

// D-15 mailto target. Uses data/site.ts.email (D-15a forward-compat —
// Phase 6 v1.x can swap to hi@braehods.com in one line at data/site.ts).
// Subject `Hi%20Braeden` is hard-coded literal per D-15 verbatim.
// Resolved v1 literal: mailto:fakegoat1@gmail.com?subject=Hi%20Braeden
const MAILTO_HREF = `mailto:${site.email ?? 'fakegoat1@gmail.com'}?subject=Hi%20Braeden`;

// D-14 min-time-to-submit threshold (silent reject if Date.now() - mountTime < this).
const MIN_TIME_MS = 1500;

// D-02 character soft cap + counter color-flip threshold.
const MAX_LEN = 1000;
const WARN_LEN = 800;

export function ContactModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // useForm returns [state, handleSubmit, reset] per @formspree/react@3.0.0 API
  // (verified RESEARCH.md Pattern 2 + npm verification 2026-05-07).
  const [state, handleSubmit, reset] = useForm(FORMSPREE_ID);

  // Lazy init — runs ONCE per mount (NOT once per render). useState(() => ...)
  // form is critical here; useState(Date.now()) would recompute every render.
  const [mountTime] = useState(() => Date.now());

  // Controlled textarea so the char counter can read length without a ref.
  const [message, setMessage] = useState('');

  // Pitfall 5 separate success state — set by the silent-reject branch of
  // wrappedHandleSubmit so the success UI renders identically to a real submit.
  const [bypassedSuccess, setBypassedSuccess] = useState(false);

  // Effect 1: hash-driven open/close per D-06.
  // - Initial mount sync: if URL already has #contact (deep-link), open modal.
  // - Hash listener: open on hash → #contact, close on hash → anything else.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const sync = () => {
      if (window.location.hash === '#contact') {
        if (!dialog.open) dialog.showModal();
      } else {
        if (dialog.open) dialog.close();
      }
    };

    sync(); // initial-mount: deep-link support (braehods.com/about#contact)
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  // Effect 2: dialog 'close' event handler.
  // - Clear hash via history.replaceState (Pitfall 1 — NOT location.hash = '';
  //   that leaves #contact cached so a subsequent same-hash click does not
  //   fire hashchange, breaking reopen).
  // - Reset useForm state (Pitfall 2 — state survives across open/close otherwise).
  // - Clear local state too.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => {
      // Pitfall 1 fix — replaceState preserves path + search, removes hash
      // without firing a navigation/scroll side-effect.
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      reset();
      setMessage('');
      setBypassedSuccess(false);
    };

    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('close', onClose);
    };
  }, [reset]);

  // Wrapped submit handler — implements honeypot + min-time silent rejection
  // (Pitfall 5 — separate bypassedSuccess so bot can't distinguish gate from
  // real submit).
  const wrappedHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // D-13 honeypot: field name is `company` per CTCT-04 (the Formspree
    // default-name is too well-known — bots have learned it; `company` is
    // a custom name they have not learned). Bots fill all text inputs they
    // find; humans never see this field (positioned at -9999px +
    // tabindex=-1 + aria-hidden + autocomplete=off).
    if (formData.get('company')) {
      setBypassedSuccess(true);
      return;
    }

    // D-14 min-time-to-submit: humans take ≥1.5s to read + fill the form.
    if (Date.now() - mountTime < MIN_TIME_MS) {
      setBypassedSuccess(true);
      return;
    }

    return handleSubmit(event);
  };

  // Pitfall 6 backdrop-click handler. Browser's native top-layer centering
  // means clicks on the backdrop area register on the <dialog> element
  // itself (e.target === e.currentTarget), not on its content children.
  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      dialogRef.current?.close();
    }
  };

  const showSuccess = state.succeeded || bypassedSuccess;

  return (
    <dialog
      id="contact"
      ref={dialogRef}
      onClick={onDialogClick}
      data-test="contact-modal"
      aria-labelledby="contact-modal-heading"
      className="mx-4 max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded border border-[var(--color-border)] bg-[var(--color-bg-end)] p-6 md:p-8"
    >
      <h2
        id="contact-modal-heading"
        className="text-lg font-sans leading-relaxed"
        style={{ color: 'var(--color-text)' }}
      >
        Get in touch
      </h2>

      {/* Error state — renders ABOVE form per D-11 (form remains visible +
          populated so the user retains typed content). */}
      {state.errors && !showSuccess && (
        <div role="alert" aria-live="assertive" aria-atomic="true" className="mt-6">
          <p className="text-base font-sans" style={{ color: 'var(--color-text)' }}>
            Something went wrong sending that. Try the email link below.
          </p>
        </div>
      )}

      {showSuccess ? (
        <>
          {/* D-10 success state — replaces form. Polite aria-live + Send-another
              CTA per UI-SPEC § State 3. U+2014 em-dash + U+2019 curly apostrophe. */}
          <div role="status" aria-live="polite" aria-atomic="true" className="mt-6">
            <p className="text-base font-sans" style={{ color: 'var(--color-text)' }}>
              Thanks — I’ll get back to you within a day or two.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setBypassedSuccess(false);
                  setMessage('');
                }}
                className="group inline-flex items-center gap-2 text-base font-sans hover:underline hover:decoration-1 hover:underline-offset-4"
                style={{ color: 'var(--color-accent)' }}
              >
                Send another{' '}
                <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* D-15 mailto fallback — visible in success state too per
              tests/contact-modal-mailto-fallback.spec.ts:65 ("stays visible
              after success render"). */}
          <div className="mt-6">
            <a
              href={MAILTO_HREF}
              className="group inline-flex items-center gap-2 text-base font-sans hover:underline hover:decoration-1 hover:underline-offset-4"
              style={{ color: 'var(--color-accent)' }}
            >
              Or just email me directly{' '}
              <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </>
      ) : (
        <form
          onSubmit={wrappedHandleSubmit}
          aria-busy={state.submitting}
          className="mt-6 flex flex-col gap-4"
        >
          {/* D-13 honeypot — name="company" per CTCT-04 (custom name; the
              Formspree default is too well-known to bots). Visually hidden
              at -9999px + tabindex=-1 + autocomplete=off + aria-hidden so
              humans never see it but bots fill it. */}
          <div
            className="absolute -left-[9999px] opacity-0 pointer-events-none"
            aria-hidden="true"
          >
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </div>

          {/* Name field — text input, required, label above with * accent suffix
              per D-03. text-base (16px) defeats iOS Safari auto-zoom (Pitfall 7). */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-name"
              className="text-sm font-sans"
              style={{ color: 'var(--color-muted)' }}
            >
              Name{' '}
              <span aria-hidden style={{ color: 'var(--color-accent)' }}>
                *
              </span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              required
              disabled={state.submitting}
              className="px-3 py-2 text-base font-sans rounded border border-[var(--color-border)] bg-transparent transition-[border-color,color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:border-[var(--color-accent)]"
              style={{ color: 'var(--color-text)' }}
            />
            <ValidationError
              prefix="Name"
              field="name"
              errors={state.errors}
              className="text-sm font-sans"
            />
          </div>

          {/* Email field — type=email for browser native validation. */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-email"
              className="text-sm font-sans"
              style={{ color: 'var(--color-muted)' }}
            >
              Email{' '}
              <span aria-hidden style={{ color: 'var(--color-accent)' }}>
                *
              </span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              required
              disabled={state.submitting}
              className="px-3 py-2 text-base font-sans rounded border border-[var(--color-border)] bg-transparent transition-[border-color,color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:border-[var(--color-accent)]"
              style={{ color: 'var(--color-text)' }}
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
              className="text-sm font-sans"
            />
          </div>

          {/* Message field — controlled textarea, rows=4 fixed height per D-02,
              maxLength=1000 soft cap browser-enforced, resize-y user-draggable. */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-message"
              className="text-sm font-sans"
              style={{ color: 'var(--color-muted)' }}
            >
              Message{' '}
              <span aria-hidden style={{ color: 'var(--color-accent)' }}>
                *
              </span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              maxLength={MAX_LEN}
              required
              disabled={state.submitting}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="px-3 py-2 text-base font-sans rounded border border-[var(--color-border)] bg-transparent resize-y transition-[border-color,color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:border-[var(--color-accent)]"
              style={{ color: 'var(--color-text)' }}
            />
            {/* D-02 char counter — Geist Mono micro-format, inline #c8a86a
                literal past 800 chars (NOT promoted to @theme per Phase 4 D-09
                carry-forward). */}
            <div className="mt-1 flex justify-end">
              <span
                className="text-sm font-mono"
                style={{
                  color: message.length > WARN_LEN ? '#c8a86a' : 'var(--color-muted)',
                }}
              >
                {message.length} / {MAX_LEN}
              </span>
            </div>
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
              className="text-sm font-sans"
            />
          </div>

          {/* Send button row + D-15 mailto fallback (idle + submitting state). */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={state.submitting}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-[var(--color-border)] px-4 py-3 text-sm font-sans transition-[border-color,color,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:border-[var(--color-accent)] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
                style={{ color: 'var(--color-accent)' }}
              >
                {state.submitting ? 'Sending…' : 'Send message'}
              </button>
            </div>
            <a
              href={MAILTO_HREF}
              className="group inline-flex items-center gap-2 text-base font-sans hover:underline hover:decoration-1 hover:underline-offset-4"
              style={{ color: 'var(--color-accent)' }}
            >
              Or just email me directly{' '}
              <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </form>
      )}

      {/* Screen-reader-only aria-live regions (CTCT-03 + A11Y-03). The visible
          UI above also communicates state; these are screen-reader-additive.
          Status announcements layered over success/submitting transitions. */}
      <div role="status" aria-live="polite" className="sr-only">
        {state.submitting && 'Sending your message.'}
      </div>
    </dialog>
  );
}
