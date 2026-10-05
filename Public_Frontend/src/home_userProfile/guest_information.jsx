import { useI18n } from '../i18n';
import styles from './guest_information.module.css';

function GuestInformation() {
    const { t } = useI18n();

    return (
        <div id="guestInformation" className={styles.guestInformation}>
            <div className={styles.leftSection} style={{ flex: 2 }}>
                <h1>{t('guestInfo.title')}</h1>
                <ul>
                    {t('guestInfo.rules').map((rule, i) => (
                        <li key={i}>{rule}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.rightSection} style={{ flex: 1 }}>
                <h1>{t('guestInfo.welcomeTitle')}</h1>
                <p>{t('guestInfo.welcomeDesc')}</p>
            </div>
        </div>
    );
}

export default GuestInformation;