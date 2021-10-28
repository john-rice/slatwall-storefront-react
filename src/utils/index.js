import { useRef, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import queryString from 'query-string'

export const cleanHTML = data => data.replace('class=', 'className=')
export const renameKeys = (obj, find, replace = '') => {
  Object.keys(obj).forEach(key => {
    const newKey = key.replace(find, replace)
    obj[newKey] = obj[key]
    delete obj[key]
  })
}
export const renameKeysInArrayOfObjects = (arr, find, replace) => {
  arr.forEach(obj => {
    renameKeys(obj, find, replace)
  })
}

export const isAuthenticated = () => {
  let token = localStorage.getItem('token')
  if (token) {
    try {
      token = jwt_decode(token)
      return token.exp && token.exp * 1000 > Date.now() && token.accountID.length > 0
    } catch (error) {}
  }
  return false
}

export const containsHTML = str => /<[a-z][\s\S]*>/i.test(str)
export const isString = val => 'string' === typeof val
export const isBoolean = val => 'boolean' === typeof val
export const booleanToString = value => (value ? 'Yes' : 'No')
export const skuIdsToSkuCodes = (idList, productOptionGroups) => {
  return productOptionGroups
    .map(optionGroup =>
      optionGroup.options
        .filter(option => {
          return idList.includes(option.optionID)
        })
        .map(option => {
          let payload = {}
          payload[optionGroup.optionGroupCode] = option.optionCode
          return payload
        })
    )
    .flat()
}

export const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const groupBy = (arr, criteria) => {
  return arr.reduce((obj, item) => {
    var key = typeof criteria === 'function' ? criteria(item) : item[criteria]
    if (!obj.hasOwnProperty(key)) {
      obj[key] = []
    }
    obj[key].push(item)
    return obj
  }, {})
}
export const parseErrorMessages = error => {
  if (error instanceof Object) {
    return Object.keys(error)
      .map(key => parseErrorMessages(error[key]))
      .flat()
  }
  return error
}
export const getErrorMessage = error => {
  return parseErrorMessages(error)?.join('. ')
}

export const organizeProductTypes = (parents, list) => {
  return parents.map(parent => {
    let childProductTypes = list
      .filter(productType => {
        return productType.productTypeIDPath.includes(parent.productTypeIDPath) && productType.productTypeID !== parent.productTypeID
      })
      .filter(productType => {
        return productType.productTypeIDPath.split(',').length === parent.productTypeIDPath.split(',').length + 1
      })
    if (list.length > 0) {
      childProductTypes = organizeProductTypes(childProductTypes, list)
    }
    return { ...parent, childProductTypes }
  })
}
export const augmentProductType = (parent, data) => {
  let parents = data.filter(productType => {
    return productType.urlTitle === parent
  })
  parents = organizeProductTypes(parents, data)

  if (parents.length > 0) {
    parents = parents[0]
  }
  return parents
}
export const processQueryParameters = params => {
  let qParams = queryString.parse(params, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  Object.keys(qParams).forEach(key => (qParams[key] = Array.isArray(qParams[key]) ? qParams[key].join() : qParams[key]))
  return qParams
}