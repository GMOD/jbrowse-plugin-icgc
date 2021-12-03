import { BaseFeatureDataAdapter } from '@jbrowse/core/data_adapters/BaseAdapter'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import { Region } from '@jbrowse/core/util/types'
import { Feature } from '@jbrowse/core/util/simpleFeature'
import { Instance } from 'mobx-state-tree'
import { readConfObject } from '@jbrowse/core/configuration'
import { BaseOptions } from '@jbrowse/core/data_adapters/BaseAdapter'
import ICGCFeature from './ICGCFeature'
import MyConfigSchema from './configSchema'
import AbortablePromiseCache from 'abortable-promise-cache'
import LRU from '@jbrowse/core/util/QuickLRU'

export default class ICGCAdapter extends BaseFeatureDataAdapter {
  public static capabilities = ['getFeatures', 'getRefNames']

  public constructor(config: Instance<typeof MyConfigSchema>) {
    super(config)
  }

  public async getRefNames() {
    return [
      'chr1',
      'chr10',
      'chr11',
      'chr12',
      'chr13',
      'chr14',
      'chr15',
      'chr16',
      'chr17',
      'chr18',
      'chr19',
      'chr2',
      'chr20',
      'chr21',
      'chr22',
      'chr3',
      'chr4',
      'chr5',
      'chr6',
      'chr7',
      'chr8',
      'chr9',
      'chrX',
      'chrY',
    ]
  }

  public getFeatures(region: Region, opts: BaseOptions = {}) {
    return ObservableCreate<Feature>(async observer => {
      const features = new Array()
      features.forEach((f: any) => {
        if (
          f.get('refName') === region.refName &&
          f.get('end') > region.start &&
          f.get('start') < region.end
        ) {
          observer.next(f)
        }
      })
      observer.complete()
    }, opts.signal)
  }

  public freeResources(): void {}
}
