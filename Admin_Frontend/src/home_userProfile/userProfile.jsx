import { useAuth } from '../AuthContext';
import { useI18n } from '../i18n';
import styles from './userProfile.module.css';

function UserProfile() {
    const { user, logout } = useAuth();
    const { t } = useI18n();

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.avatar}>
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <p className={styles.greeting}>
                    {t('userProfile.welcome', { username: user?.username })}
                </p>
                <button className={styles.logoutBtn} onClick={logout}>
                    {t('userProfile.logout')}
                </button>
            </div>
        </div>
    );
}

export default UserProfile;