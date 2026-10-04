import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import './home_options.css';

function HomeOptions() {
    const do_navigate = useNavigate();
    const { t } = useI18n();

    return (
        <div className="home_options">
            <button className="opt-btn feed" onClick={() => do_navigate('/feed')}>{t('navOptions.feed')}</button>
            <button className="opt-btn chat" onClick={() => do_navigate('/chat')}>{t('navOptions.chat')}</button>
            <button className="opt-btn justify" onClick={() => do_navigate('/justify')}>{t('navOptions.justify')}</button>
            <button className="opt-btn explore" onClick={() => do_navigate('/explore')}>{t('navOptions.explore')}</button>
        </div>
    );
}

export default HomeOptions;