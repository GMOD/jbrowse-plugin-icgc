import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { types } from 'mobx-state-tree'

export default ConfigurationSchema(
  'ICGCAdapter',
  {},
  { explicitlyTyped: true, explicitIdentifier: 'ICGCAdapterId' },
)
