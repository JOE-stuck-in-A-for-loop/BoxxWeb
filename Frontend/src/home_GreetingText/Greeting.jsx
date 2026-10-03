// for header greeting and navigations
import { useI18n } from '../i18n';

function Greetings() {
    const { t } = useI18n();

    //for observion, you can add a style object to define the styles for your component. Here's an example of how you can do that:
    const styleForSloganArea = {
        border: '1px solid #e40e0e',
        padding: '10px',
        textAlign: 'center',
        height: '10vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.5)',
    }



    return(
    <div>
        <div className="sloganArea" style={styleForSloganArea}>
            <h1 style={{fontFamily: "monospace",
                        textAlign: "center",
                        fontSize: "3rem",
                                            }}>
                {t('greeting.welcome')}
                </h1>




        </div>

    </div>
    )
}

export default Greetings