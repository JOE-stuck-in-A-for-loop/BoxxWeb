import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import './pages.css';

function ExplorePage() {
    const do_navigate = useNavigate();
    const { t } = useI18n();

    return (
        <div className="page-container">
            <div className="page-card">
                <h1>{t('pages.explore.title')}</h1>
                <p className="page-placeholder">{t('pages.explore.placeholder')}</p>
                <button className="back-btn" onClick={() => do_navigate('/')}></button>
            </div>
        </div>
    );
}

export default ExplorePage;