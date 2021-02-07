import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

console.log(nearConfig.contractName)

export async function initContract() {
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
  window.walletConnection = new WalletConnection(near)
  window.accountId = window.walletConnection.getAccountId()

  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: [
      'get_all_products',
      'get_products_of',
      'get_product_of',
      'get_profile_of',
      'get_orders',
      'get_reviews'
    ],
    changeMethods: [
      'create_product',
      'update_product',
      'update_profile',
      'create_order',
      'post_review',
      'give_helpful',
      'update_review',
      'delete_review',
      'create_comment'
    ],
  })
}

export function logout() {
  window.walletConnection.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}
