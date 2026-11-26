import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { LANGUAGES, type SupportedLangCode } from '../kbridge';
import { Glyph } from '../components/icons';
import { navCopy } from '../i18n/navCopy';
import { getUiMessages } from '../i18n/messages';

type MenuName = 'lang' | 'account' | 'sheet';

export type BarLink = { href: string; label: string; current?: boolean };

export function TopBar({
  lang,
  nativeName,
  setLang,
  focused,
  primary,
  accountLinks = [],
  accountExtra,
}: {
  lang: SupportedLangCode;
  nativeName: string;
  setLang: (lang: SupportedLangCode) => void;
  focused: boolean;
  primary: BarLink[];
  accountLinks?: BarLink[];
  accountExtra?: ReactNode;
}) {
  const copy = navCopy(lang);
  const ui = getUiMessages(lang);
  const [open, setOpen] = useState<MenuName | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetId = useId();
  const langId = useId();
  const accountId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(null);
  const mark = (item: BarLink) => (item.current ? 'page' : undefined);

  return (
    <div ref={rootRef}>
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand-link" href="#/tracks" onClick={close}>
            <span className="brand-mark" aria-hidden="true">
              K
            </span>
            <span className="brand-name" dir="ltr">
              K-Visa Path
            </span>
          </a>
          {focused ? null : (
            <nav className="topnav" aria-label={copy.navLabel}>
              {primary.map((item) => (
                <a key={item.href} href={item.href} aria-current={mark(item)}>
                  {item.label}
                </a>
              ))}
            </nav>
          )}
          <div className="top-tools">
            <div className="tool-wrap">
              <button type="button" className="nav-tool" aria-expanded={open === 'lang'} aria-controls={langId} onClick={() => setOpen(open === 'lang' ? null : 'lang')}>
                <Glyph name="globe" />
                <span>{nativeName}</span>
              </button>
              {open === 'lang' ? (
                <div className="menu" id={langId} role="group" aria-label={ui.pickerTitle}>
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      aria-pressed={item.code === lang}
                      onClick={() => {
                        setLang(item.code);
                        close();
                      }}
                    >
                      {item.nativeName}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {focused ? null : (
              <div className="tool-wrap desk-only">
                <button type="button" className="nav-tool" aria-expanded={open === 'account'} aria-controls={accountId} onClick={() => setOpen(open === 'account' ? null : 'account')}>
                  <Glyph name="user" />
                  <span>{copy.account}</span>
                </button>
                {open === 'account' ? (
                  <div className="menu" id={accountId} role="group" aria-label={copy.account}>
                    {accountLinks.map((item) => (
                      <a key={item.href} href={item.href} aria-current={mark(item)} onClick={close}>
                        {item.label}
                      </a>
                    ))}
                    {accountExtra}
                  </div>
                ) : null}
              </div>
            )}
            {focused ? null : (
              <button
                type="button"
                className="menu-button"
                aria-expanded={open === 'sheet'}
                aria-controls={sheetId}
                aria-label={copy.navLabel}
                onClick={() => setOpen(open === 'sheet' ? null : 'sheet')}
              >
                <Glyph name="menu" />
              </button>
            )}
          </div>
        </div>
      </header>
      {open === 'sheet' ? (
        <div className="sheet-backdrop" onClick={close}>
          <div className="sheet" id={sheetId} role="dialog" aria-modal="true" aria-label={copy.navLabel} onClick={(event) => event.stopPropagation()}>
            <div className="sheet-grab" aria-hidden="true" />
            <div className="sheet-head">
              <strong>{copy.navLabel}</strong>
              <button type="button" className="btn text" onClick={close}>
                {ui.closeLabel}
              </button>
            </div>
            <nav aria-label={copy.navLabel}>
              {primary.map((item) => (
                <a key={item.href} href={item.href} aria-current={mark(item)} onClick={close}>
                  {item.label}
                </a>
              ))}
            </nav>
            {accountLinks.length > 0 ? <p className="sheet-label">{copy.account}</p> : null}
            {accountLinks.map((item) => (
              <a key={item.href} href={item.href} aria-current={mark(item)} onClick={close}>
                {item.label}
              </a>
            ))}
            {accountExtra}
          </div>
        </div>
      ) : null}
    </div>
  );
}
