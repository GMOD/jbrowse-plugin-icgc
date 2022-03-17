import { toArray } from 'rxjs/operators'
import DCCAdapter from './DCCAdapter'
import configSchema from './configSchema'
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()

test('adapter can fetch features from dcc_test_data.tsv', async () => {
  const adapter = new DCCAdapter(
    configSchema.create({
      dccLocation: {
        localPath: require.resolve('./test_data/dcc_test_data.tsv'),
      },
    }),
  )

  const features = adapter.getFeatures({
    assemblyName: 'volvox',
    refName: 'chr2',
    start: 0,
    end: 235551314,
  })

  const names = await adapter.getRefNames()
  expect(names).toMatchSnapshot()

  const featuresArray = await features.pipe(toArray()).toPromise()
  const featuresJsonArray = featuresArray.map((f) => f.toJSON())
  expect(featuresJsonArray).toMatchSnapshot()
})
