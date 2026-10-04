import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useI18n } from '../i18n';
import UserProfile from './userProfile';
import styles from './guest_information.module.css';

function GuestInformation() {
    const { user, isAuthenticated, login, register, loading } = useAuth();
    const { t } = useI18n();
    const [view, setView] = useState('default');

    // 表单字段
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 切换视图时清空表单
    function switchView(newView) {
        setView(newView);
        setUsername('');
        setPassword('');
        setIdNumber('');
        setError('');
    }

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

    async function handleRegister(e) {
        e.preventDefault();
        if (!username.trim() || !password.trim() || !idNumber.trim()) {
            setError(t('guestInfo.errors.fillAll'));
            return;
        }
        if (password.length < 4) {
            setError(t('guestInfo.errors.passwordShort'));
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await register(username, password, idNumber);
            // 注册成功 → 自动登录 → isAuthenticated 变为 true
        } catch (err) {
            if (err.status === 400) {
                setError(t('guestInfo.errors.usernameTaken'));
            } else {
                setError(err.message || t('guestInfo.errors.registerFailed'));
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div id="guestInformation" className={styles.guestInformation}>
            <div className={styles.leftSection}>
                {view === 'default' && (
                    <>
                        <h1>{t('guestInfo.title')}</h1>
                        <ul>
                            {t('guestInfo.rules').map((rule, i) => (
                                <li key={i}>{rule}</li>
                            ))}
                        </ul>
                    </>
                )}
                {view === 'login' && (
                    <>
                        <h1>{t('guestInfo.loginRulesTitle')}</h1>
                        <ul>
                            {t('guestInfo.loginRules').map((rule, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: rule }} />
                            ))}
                        </ul>
                    </>
                )}
                {view === 'register' && (
                    <>
                        <h1>{t('guestInfo.registerRulesTitle')}</h1>
                        <ul>
                            {t('guestInfo.registerRules').map((rule, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: rule }} />
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className={styles.rightSection}>
                {view === 'default' && (
                    <>
                        <h1>{t('guestInfo.loginTitle')}</h1>
                        <p>{t('guestInfo.loginDesc')}</p>
                        <button className={styles.loginButton} onClick={() => switchView('login')}>{t('guestInfo.loginBtn')}</button>
                        <button className={styles.registerButton} onClick={() => switchView('register')}>{t('guestInfo.registerBtn')}</button>
                    </>
                )}

                {view === 'login' && (
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
                        <button className={styles.backLink} type="button" onClick={() => switchView('default')}>
                            {t('guestInfo.form.back')}
                        </button>
                        <p className={styles.switchLink}>
                            {t('guestInfo.form.noAccount')}{' '}
                            <span onClick={() => switchView('register')}>{t('guestInfo.form.registerHere')}</span>
                        </p>
                    </form>
                )}

                {view === 'register' && (
                    <form className={styles.form} onSubmit={handleRegister}>
                        <h2 className={styles.formTitle}>{t('guestInfo.form.registerSubmit')}</h2>
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
                        <input
                            className={styles.input}
                            type="text"
                            placeholder={t('guestInfo.form.idNumber')}
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            disabled={submitting}
                        />
                        {error && <p className={styles.errorMsg}>{error}</p>}
                        <button className={styles.submitBtn} type="submit" disabled={submitting}>
                            {submitting ? t('guestInfo.form.loading') : t('guestInfo.form.registerSubmit')}
                        </button>
                        <button className={styles.backLink} type="button" onClick={() => switchView('default')}>
                            {t('guestInfo.form.back')}
                        </button>
                        <p className={styles.switchLink}>
                            {t('guestInfo.form.hasAccount')}{' '}
                            <span onClick={() => switchView('login')}>{t('guestInfo.form.loginHere')}</span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default GuestInformation;