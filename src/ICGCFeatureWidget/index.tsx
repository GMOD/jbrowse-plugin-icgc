import { ConfigurationSchema } from '@jbrowse/core/configuration'
import PluginManager from '@jbrowse/core/PluginManager'
import { ElementId } from '@jbrowse/core/util/types/mst'
import { types } from 'mobx-state-tree'
import ReactComponent from './ICGCFeatureWidget'

export default (pluginManager: PluginManager) => {
  const configSchema = ConfigurationSchema('ICGCFeatureWidget', {})
  const stateModel = types
    .model('ICGCFeatureWidget', {
      id: ElementId,
      type: types.literal('ICGCFeatureWidget'),
      featureData: types.frozen({}),
      view: types.safeReference(
        pluginManager.pluggableMstType('view', 'stateModel'),
      ),
    })
    .actions(self => ({
      setFeatureData(data: any) {
        self.featureData = data
      },
      clearFeatureData() {
        self.featureData = {}
      },
    }))

  return { configSchema, stateModel, ReactComponent }
}
