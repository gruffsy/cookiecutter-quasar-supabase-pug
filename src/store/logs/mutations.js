// 'Произошла ошибка!' 'An error has occured'
// 'Оповещение системы!' 'System alert'

import { Notify } from 'quasar'

export function setError (state, payload) {
  state.errors.push(payload)
  if (state.errors.length > 100) state.errors.shift()
  let caption
  if (payload instanceof Error) caption = payload.message
  if (typeof payload === 'string') caption = payload
  console.error(caption)
  Notify.create({
    type: 'error',
    position: 'center',
    message: 'An error has occured',
    caption
  })
}

export function setInfo (state, payload) {
  state.infos.push(payload)
  if (state.infos.length > 100) state.infos.shift()
  let caption
  if (payload instanceof Error) caption = payload.message
  if (typeof payload === 'string') caption = payload
  console.log(caption)
  Notify.create({
    type: 'info',
    message: 'System alert',
    caption
  })
}
