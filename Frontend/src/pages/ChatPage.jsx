import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import './pages.css';

function ChatPage() {
    const do_navigate = useNavigate();
    const { t } = useI18n();

    return (
        <div className="page-container">
            <div className="page-card">
                <h1>{t('pages.chat.title')}</h1>
                <p className="page-placeholder">{t('pages.chat.placeholder')}</p>
                <button className="back-btn" onClick={() => do_navigate('/')}>{t('pages.back')}</button>
            </div>
        </div>
    );
}

export default ChatPage;