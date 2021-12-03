import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import ViewType from '@jbrowse/core/pluggableElementTypes/ViewType'
import { AbstractSessionModel, isAbstractMenuManager } from '@jbrowse/core/util'
import {
  createBaseTrackConfig,
  createBaseTrackModel,
} from '@jbrowse/core/pluggableElementTypes/models'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'
import WidgetType from '@jbrowse/core/pluggableElementTypes/WidgetType'
import TrackType from '@jbrowse/core/pluggableElementTypes/TrackType'
import AdapterType from '@jbrowse/core/pluggableElementTypes/AdapterType'
import { version } from '../package.json'

import {
  configSchemaFactory as linearICGCDisplayConfigSchemaFactory,
  stateModelFactory as linearICGCDisplayStateModelFactory,
} from './LinearICGCDisplay'

import ICGCFeatureWidgetF from './ICGCFeatureWidget'
import ICGCFilterWidgetF from './ICGCFilterWidget'
import {
  configSchema as icgcConfigSchema,
  AdapterClass as ICGCAdapter,
} from './ICGCAdapter'

export default class ICGCPlugin extends Plugin {
  name = 'ICGC'
  version = version

  install(pluginManager: PluginManager) {
    const LGVPlugin = pluginManager.getPlugin(
      'LinearGenomeViewPlugin',
    ) as import('@jbrowse/plugin-linear-genome-view').default
    const { BaseLinearDisplayComponent } = LGVPlugin.exports

    pluginManager.addTrackType(() => {
      const configSchema = ConfigurationSchema(
        'ICGCTrack',
        {},
        {
          baseConfiguration: createBaseTrackConfig(pluginManager),
          explicitIdentifier: 'trackId',
        },
      )
      return new TrackType({
        name: 'ICGCTrack',
        configSchema,
        stateModel: createBaseTrackModel(
          pluginManager,
          'ICGCTrack',
          configSchema,
        ),
      })
    })

    pluginManager.addDisplayType(() => {
      const configSchema = linearICGCDisplayConfigSchemaFactory(pluginManager)
      return new DisplayType({
        name: 'LinearICGCDisplay',
        configSchema,
        stateModel: linearICGCDisplayStateModelFactory(
          configSchema,
          pluginManager,
        ),
        trackType: 'ICGCTrack',
        viewType: 'LinearGenomeView',
        ReactComponent: BaseLinearDisplayComponent,
      })
    })

    pluginManager.addAdapterType(() => {
      return new AdapterType({
        name: 'ICGCAdapter',
        configSchema: icgcConfigSchema,
        // @ts-ignore
        adapterMetadata: {
          hiddenFromGUI: true,
        },
        AdapterClass: ICGCAdapter,
      })
    })

    pluginManager.addWidgetType(() => {
      return new WidgetType({
        name: 'ICGCFeatureWidget',
        heading: 'Feature Details',
        ...ICGCFeatureWidgetF(pluginManager),
      })
    })

    pluginManager.addWidgetType(() => {
      return new WidgetType({
        name: 'ICGCFilterWidget',
        ...ICGCFilterWidgetF(pluginManager),
      })
    })
  }
}
