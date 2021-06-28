import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PaymentAddressSelector, Button } from '../../'
import { addNewAccountAndSetAsBilling, addPayment } from '../../../actions/'
import { orderPayment, billingAccountAddressSelector, fulfillmentSelector } from '../../../selectors'
import { useTranslation } from 'react-i18next'

const TermPayment = ({ method }) => {
  const dispatch = useDispatch()
  const [accountAddressID, setAccountAddressID] = useState('')
  const [saveShippingAsBilling, setSaveShippingAsBilling] = useState('')
  const { purchaseOrderNumber } = useSelector(orderPayment)
  const [termOrderNumber, setTermOrderNumber] = useState(purchaseOrderNumber)
  const selectedAccountID = useSelector(billingAccountAddressSelector)
  const { t } = useTranslation()
  const { fulfillmentMethod } = useSelector(fulfillmentSelector)

  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="purchaseOrderNumber">{t('frontend.checkout.payment.po.number')}</label>
            <input
              className="form-control"
              type="text"
              id="purchaseOrderNumber"
              value={termOrderNumber}
              onChange={e => {
                e.preventDefault()
                setTermOrderNumber(e.target.value)
              }}
            />
          </div>
        </div>
        {fulfillmentMethod.fulfillmentMethodType === 'shipping' && (
          <div className="col-sm-12">
            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  className="custom-control-input"
                  type="checkbox"
                  id="saveShippingAsBilling"
                  checked={saveShippingAsBilling}
                  onChange={e => {
                    setSaveShippingAsBilling(!saveShippingAsBilling)
                  }}
                />
                <label className="custom-control-label" htmlFor="saveShippingAsBilling">
                  Same as shipping address
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      {saveShippingAsBilling && termOrderNumber && termOrderNumber.length > 0 && (
        <Button
          label="Submit"
          onClick={e => {
            e.preventDefault()
            console.log('saveShippingAsBilling', saveShippingAsBilling)
            //TODO: BROKEN

            dispatch(
              addPayment({
                newOrderPayment: {
                  saveShippingAsBilling: 1,
                  purchaseOrderNumber: termOrderNumber,
                  paymentMethod: {
                    paymentMethodID: method,
                  },
                },
              })
            )
          }}
        />
      )}
      {!saveShippingAsBilling && termOrderNumber && termOrderNumber.length > 0 && (
        <PaymentAddressSelector
          addressTitle={'Billing Address'}
          selectedAccountID={selectedAccountID || accountAddressID}
          onSelect={value => {
            dispatch(
              addPayment({
                accountAddressID: value,
                newOrderPayment: {
                  purchaseOrderNumber: termOrderNumber,
                  paymentMethod: {
                    paymentMethodID: method,
                  },
                },
              })
            )
            setAccountAddressID(value)
          }}
          onSave={values => {
            if (values.saveAddress) {
              dispatch(addNewAccountAndSetAsBilling({ ...values }))
            } else {
              dispatch(
                addPayment({
                  newOrderPayment: {
                    billingAddress: {
                      name: values.name,
                      streetAddress: values.streetAddress,
                      street2Address: values.street2Address,
                      city: values.city,
                      statecode: values.stateCode,
                      postalcode: values.postalCode,
                      countrycode: values.countryCode,
                    },
                    purchaseOrderNumber: termOrderNumber,
                    paymentMethod: {
                      paymentMethodID: method,
                    },
                  },
                })
              )
            }
          }}
        />
      )}
    </>
  )
}
export { TermPayment }