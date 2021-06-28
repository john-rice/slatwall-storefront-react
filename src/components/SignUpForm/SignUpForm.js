import MailchimpSubscribe from 'react-mailchimp-subscribe'
import styles from './SignUpForm.module.css'
import { useTranslation } from 'react-i18next'

const MyForm = ({ status, message, onValidated }) => {
  const { t } = useTranslation()

  let email, fName, lName, company
  const submit = () => {
    email &&
      lName &&
      fName &&
      company &&
      email.value.indexOf('@') > -1 &&
      onValidated({
        MERGE0: email.value,
        MERGE2: lName.value,
        MERGE1: fName.value,
        MERGE3: company.value,
      })
  }

  return (
    <>
      <div className="input-group input-group-overlay flex-nowrap">
        <div className="input-group-prepend-overlay">
          <span className="input-group-text text-muted font-size-base"></span>
        </div>
        <div className="row">
          <div className="col-12 d-flex">
            <input className={`${styles.customInput} form-control prepended-form-control me-3`} type="text" ref={node => (fName = node)} placeholder={t('frontend.account.first_name')} required />
            <input className={`${styles.customInput} form-control prepended-form-control me-3`} type="text" ref={node => (lName = node)} placeholder={t('frontend.account.last_name')} required />
            <input className={`${styles.customInput} form-control prepended-form-control`} type="text" ref={node => (company = node)} placeholder={t('frontend.account.company')} required />
          </div>
          <div className="col-12 d-flex pt-3">
            <input className={`${styles.customInput} form-control prepended-form-control rounded-right-0`} type="email" ref={node => (email = node)} placeholder={t('frontend.account.email')} required />
            <div className="input-group-append">
              <button className="btn btn-primary  d-flex flex-row" type="submit" onClick={submit}>
                <i className="bi bi-envelope p-1"></i>
                {t('frontend.core.subscribe')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <small className="form-text text-light opacity-50" id="mc-helper">
        {t('frontend.mc.info')}
      </small>
      <div className="subscribe-status">
        {status === 'sending' && <div style={{ color: 'blue' }}>{t('frontend.mc.sending')}</div>}
        {status === 'error' && <div style={{ color: 'red' }} dangerouslySetInnerHTML={{ __html: message }} />}
        {status === 'success' && <div style={{ color: 'green' }} dangerouslySetInnerHTML={{ __html: message }} />}
      </div>
    </>
  )
}

const SignUpForm = ({ url }) => {
  return (
    <MailchimpSubscribe
      url={url}
      render={({ subscribe, status, message }) => (
        <div>
          <MyForm
            status={status}
            message={message}
            onValidated={formData => {
              subscribe(formData)
            }}
          />
        </div>
      )}
    />
  )
}
export { SignUpForm }