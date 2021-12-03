import { ElementId } from '@jbrowse/core/util/types/mst'
import PluginManager from '@jbrowse/core/PluginManager'
import { types } from 'mobx-state-tree'

export default (pluginManager: PluginManager) => {
  return types.model('ICGCFilterWidget', {
    id: ElementId,
    type: types.literal('ICGCFilterWidget'),
    target: types.safeReference(
      pluginManager.pluggableConfigSchemaType('track'),
    ),
  })
}
