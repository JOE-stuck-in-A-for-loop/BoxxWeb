import { useI18n } from './i18n';
import './langSwitcher.css';

function LangSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${locale === 'zh' ? 'active' : ''}`}
        onClick={() => setLocale('zh')}
      >
        中文
      </button>
      <span className="lang-divider">|</span>
      <button
        className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
        onClick={() => setLocale('en')}
      >
        EN
      </button>
    </div>
  );
}

export default LangSwitcher;