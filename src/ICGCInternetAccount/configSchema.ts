import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { Instance } from 'mobx-state-tree'
import { BaseInternetAccountConfig } from '@jbrowse/core/pluggableElementTypes/models'

const ICGCConfigSchema = ConfigurationSchema(
  'ICGCInternetAccount',
  {},
  {
    baseConfiguration: BaseInternetAccountConfig,
    explicitlyTyped: true,
  },
)

export type ICGCInternetAccountConfigModel = typeof ICGCConfigSchema
export type OAuthInternetAccountConfig = Instance<
  ICGCInternetAccountConfigModel
>
export default ICGCConfigSchema
