import { toast } from 'react-toastify'
import { SlatwalApiService } from '../services'
import { getErrorMessage } from '../utils'

export const REQUEST_CONFIGURATION = 'REQUEST_CONFIGURATION'
export const RECIVE_CONFIGURATION = 'RECIVE_CONFIGURATION'
export const SET_TITLE = 'SET_TITLE'
export const SET_TITLE_META = 'SET_TITLE_META'

export const setTitle = (title = '') => {
  return {
    type: SET_TITLE,
    title,
  }
}
export const reciveConfiguration = config => {
  return {
    type: RECIVE_CONFIGURATION,
    config,
  }
}
export const requestConfiguration = () => {
  return {
    type: REQUEST_CONFIGURATION,
  }
}

export const getConfiguration = () => {
  return async (dispatch, getState) => {
    dispatch(requestConfiguration())
    const siteCode = getState().configuration.site.siteCode

    const payload = {
      siteCode: siteCode,
    }

    await SlatwalApiService.content.getConfiguration(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(reciveConfiguration(response.success().config))
      } else {
        dispatch(reciveConfiguration({}))
      }
    })
  }
}