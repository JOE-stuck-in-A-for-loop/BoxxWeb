import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useI18n } from '../i18n';
import UserProfile from './userProfile';
import styles from './guest_information.module.css';

function GuestInformation() {
    const { user, isAuthenticated, login, loading } = useAuth();
    const { t } = useI18n();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 如果正在检查登录状态，显示 loading
    if (loading) {
        return (
            <div id="guestInformation" className={styles.guestInformation}>
                <div className={styles.rightSection}>
                    <p>{t('guestInfo.form.loading')}</p>
                </div>
            </div>
        );
    }

    // 如果已登录，直接显示 UserProfile（保持同样的容器尺寸）
    if (isAuthenticated) {
        return (
            <div id="guestInformation" className={styles.guestInformation}>
                <div className={styles.rightSection}>
                    <UserProfile />
                </div>
            </div>
        );
    }

    async function handleLogin(e) {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError(t('guestInfo.errors.fillFields'));
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await login(username, password);
            // 登录成功 → isAuthenticated 变为 true，组件自动显示 UserProfile
        } catch (err) {
            if (err.status === 401) {
                setError(t('guestInfo.errors.invalidCredentials'));
            } else {
                setError(err.message || t('guestInfo.errors.loginFailed'));
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div id="guestInformation" className={styles.guestInformation}>
            <div className={styles.leftSection}>
                <h1>{t('guestInfo.title')}</h1>
                <ul>
                    {t('guestInfo.rules').map((rule, i) => (
                        <li key={i}>{rule}</li>
                    ))}
                </ul>
            </div>

            <div className={styles.rightSection}>
                <form className={styles.form} onSubmit={handleLogin}>
                    <h2 className={styles.formTitle}>{t('guestInfo.form.loginSubmit')}</h2>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder={t('guestInfo.form.username')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={submitting}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder={t('guestInfo.form.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={submitting}
                    />
                    {error && <p className={styles.errorMsg}>{error}</p>}
                    <button className={styles.submitBtn} type="submit" disabled={submitting}>
                        {submitting ? t('guestInfo.form.loading') : t('guestInfo.form.loginSubmit')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default GuestInformation;