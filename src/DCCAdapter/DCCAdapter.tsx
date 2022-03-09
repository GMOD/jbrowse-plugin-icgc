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
import { unzip } from '@gmod/bgzf-filehandle'

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

  private async decodeFileContents() {
    const dccLocation = readConfObject(
      this.config,
      'dccLocation',
    ) as FileLocation

    let fileContents = await openLocation(
      dccLocation,
      // @ts-ignore
      this.pluginManager,
    ).readFile()

    if (
      typeof fileContents[0] === 'number' &&
      fileContents[0] === 31 &&
      typeof fileContents[1] === 'number' &&
      fileContents[1] === 139 &&
      typeof fileContents[2] === 'number' &&
      fileContents[2] === 8
    ) {
      // fileContents = new TextDecoder().decode(pako.ungzip(fileContents))
      fileContents = new TextDecoder().decode(await unzip(fileContents))
      console.log(fileContents)
    } else {
      fileContents = fileContents.toString()
    }

    return this.readDcc(fileContents as string)
  }

  private async readDcc(fileContents: string) {
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
          /* some SEG files have different data, this logic is to ensure that we don't need special
             colouring functions to accomodate for those differences...mean and copy number indicate
             the track colouring */
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
    const { columns, lines } = await this.decodeFileContents()
    console.log(lines)

    return lines.map((line, index) => {
      const segment = this.parseLine(line, columns)
      console.log(segment)
      return new SimpleFeature({
        uniqueId: segment.id,
        id: segment.id,
        start: +segment.start,
        end: +segment.end,
        refName: segment.chromosome,
        score: +segment.score,
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
    // const { refNames } = await this.readDcc()
    // return refNames
    return [
      'chr1',
      'chr2',
      'chr3',
      'chr4',
      'chr5',
      'chr6',
      'chr7',
      'chr8',
      'chr9',
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
      'chr20',
      'chr21',
      'chr22',
      'chrX',
      'chrY',
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
