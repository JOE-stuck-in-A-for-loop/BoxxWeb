import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import './pages.css';

function ContactPage() {
    const do_navigate = useNavigate();
    const { t } = useI18n();

    return (
        <div className="page-container">
            <div className="page-card">
                <h1>{t('pages.contact.title')}</h1>
                <p className="page-placeholder">{t('pages.contact.qq')}</p>
                <button className="back-btn" onClick={() => do_navigate('/')}></button>
            </div>
        </div>
    );
}

export default ContactPage;