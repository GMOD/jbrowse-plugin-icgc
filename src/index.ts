import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import {
  createBaseTrackConfig,
  createBaseTrackModel,
} from '@jbrowse/core/pluggableElementTypes/models'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'
import WidgetType from '@jbrowse/core/pluggableElementTypes/WidgetType'
import TrackType from '@jbrowse/core/pluggableElementTypes/TrackType'
import AdapterType from '@jbrowse/core/pluggableElementTypes/AdapterType'
import InternetAccountType from '@jbrowse/core/pluggableElementTypes/InternetAccountType'
import { SessionWithWidgets, isAbstractMenuManager } from '@jbrowse/core/util'
import { version } from '../package.json'

import {
  configSchemaFactory as linearICGCDisplayConfigSchemaFactory,
  stateModelFactory as linearICGCDisplayStateModelFactory,
} from './LinearICGCDisplay'
import {
  // @ts-ignore
  AdapterGuesser,
} from '@jbrowse/core/util/tracks'
import { FileLocation } from '@jbrowse/core/util/types'
import {
  configSchema as ICGCInternetAccountConfigSchema,
  modelFactory as ICGCInternetAccountModelFactory,
} from './ICGCInternetAccount'
import ICGCFeatureWidgetF from './ICGCFeatureWidget'
import ICGCFilterWidgetF from './ICGCFilterWidget'
import ICGCSearchWidgetF from './ICGCSearchWidget'
import {
  configSchema as icgcConfigSchema,
  AdapterClass as ICGCAdapter,
} from './ICGCAdapter'
import {
  configSchema as dccConfigSchema,
  AdapterClass as DCCAdapter,
} from './DCCAdapter'
import { DataExploration } from './UI/Icons'

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

    pluginManager.addWidgetType(() => {
      return new WidgetType({
        name: 'ICGCSearchWidget',
        heading: 'Search ICGC',
        ...ICGCSearchWidgetF(pluginManager),
      })
    })

    pluginManager.addInternetAccountType(() => {
      return new InternetAccountType({
        name: 'ICGCInternetAccount',
        configSchema: ICGCInternetAccountConfigSchema,
        stateModel: ICGCInternetAccountModelFactory(
          ICGCInternetAccountConfigSchema,
        ),
      })
    })

    pluginManager.addAdapterType(() => {
      return new AdapterType({
        name: 'DCCAdapter',
        configSchema: dccConfigSchema,
        // @ts-ignore
        adapterMetadata: {
          category: 'ICGC Plugin Adapters',
          displayName: null,
          description: null,
        },
        AdapterClass: DCCAdapter,
      })
    })

    pluginManager.addToExtensionPoint(
      'Core-guessAdapterForLocation',
      (adapterGuesser: AdapterGuesser) => {
        return (
          file: FileLocation,
          index?: FileLocation,
          adapterHint?: string,
        ) => {
          const adapterName = 'DCCAdapter'

          if (adapterHint === adapterName) {
            return {
              type: adapterName,
              dccLocation: file,
            }
          }
          return adapterGuesser(file, index, adapterHint)
        }
      },
    )

    pluginManager.jexl.addFunction('fi', (feature: any) => {
      return feature.get('functionalImpact')
        ? feature.get('functionalImpact').includes('High')
          ? 'red'
          : feature.get('functionalImpact').includes('Low')
          ? 'blue'
          : 'goldenrod'
        : 'goldenrod'
    })
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.appendToMenu('Tools', {
        label: 'ICGC Data Import',
        icon: DataExploration,
        onClick: (session: SessionWithWidgets) => {
          session.showWidget(
            session.addWidget('ICGCSearchWidget', 'icgcSearchWidget'),
          )
        },
      })
    }
  }
}
