import { useState, useRef, useEffect } from 'react';
import { useI18n } from './i18n';
import './langSwitcher.css';

const LANGUAGES = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
];

function LangSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[1];

  return (
    <div className="lang-switcher" ref={menuRef}>
      <button
        className="lang-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
        <span className={`lang-arrow ${open ? 'up' : ''}`}>▾</span>
      </button>
      {open && (
        <ul className="lang-menu" role="listbox">
          {LANGUAGES.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === locale}
              className={`lang-option ${lang.code === locale ? 'active' : ''}`}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LangSwitcher;