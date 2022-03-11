import {
  BaseFeatureDataAdapter,
  BaseOptions,
} from '@jbrowse/core/data_adapters/BaseAdapter'
import { FileLocation, Region } from '@jbrowse/core/util/types'
import { openLocation } from '@jbrowse/core/util/io'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import SimpleFeature, { Feature } from '@jbrowse/core/util/simpleFeature'
import { readConfObject } from '@jbrowse/core/configuration'
import { AnyConfigurationModel } from '@jbrowse/core/configuration/configurationSchema'
import PluginManager from '@jbrowse/core/PluginManager'
import { getSubAdapterType } from '@jbrowse/core/data_adapters/dataAdapterCache'

export default class DCCAdapter extends BaseFeatureDataAdapter {
  public static capabilities = ['getFeatures', 'getRefNames']

  public config: any

  private setupP?: Promise<Feature[]>

  public constructor(
    config: AnyConfigurationModel,
    getSubAdapter?: getSubAdapterType,
    pluginManager?: PluginManager,
  ) {
    // @ts-ignore
    super(config, getSubAdapter, pluginManager)
    this.config = config
  }

  private async readDcc() {
    const dccLocation = readConfObject(
      this.config,
      'dccLocation',
    ) as FileLocation

    let fileContents = (await openLocation(
      dccLocation,
      // @ts-ignore
      this.pluginManager,
    ).readFile()) as string

    console.log(fileContents)
    const lines = fileContents.split('\n')
    console.log(lines)
    const refNames: string[] = []
    const rows: string[] = []
    let columns: string[] = []
    let refNameColumnIndex = 0
    lines.forEach(line => {
      if (columns.length === 0) {
        columns = line.split('\t')
        const chromosome = (element: any) =>
          element.toLowerCase() === 'chromosome'
        refNameColumnIndex = columns.findIndex(chromosome)
      } else {
        if (line.split('\t')[refNameColumnIndex] !== undefined) {
          rows.push(line)
          refNames.push(line.split('\t')[refNameColumnIndex])
        }
      }
    })

    return {
      lines: rows,
      columns,
      refNames: Array.from(new Set(refNames)),
    }
  }

  private parseLine(line: string, columns: string[]) {
    let segment: any = {}
    line.split('\t').forEach((property: string, i: number) => {
      if (property) {
        if (i === 0) {
          segment.id = property
        } else {
          if (
            columns[i].toLowerCase() === 'segment_mean' ||
            columns[i].toLowerCase() === 'copy_number'
          ) {
            segment.score = +property
          }
          segment[columns[i].toLowerCase()] = property
        }
      }
    })
    return segment
  }

  private async getLines() {
    const { columns, lines } = await this.readDcc()
    console.log(lines)

    return lines.map((line, index) => {
      const segment = this.parseLine(line, columns)
      console.log(segment)
      return new SimpleFeature({
        uniqueId: segment.icgc_mutation_id,
        id: segment.icgc_mutation_id,
        start: +segment.chromosome_start,
        end: +segment.chromosome_end,
        refName: segment.chromosome,
        ...segment,
      })
    })
  }

  private async setup() {
    if (!this.setupP) {
      this.setupP = this.getLines()
    }
    return this.setupP
  }

  public async getRefNames(_: BaseOptions = {}) {
    return [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      'X',
      'Y',
    ]
  }

  public getFeatures(region: Region, opts: BaseOptions = {}) {
    return ObservableCreate<Feature>(async observer => {
      const feats = await this.setup()
      feats.forEach(f => {
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
