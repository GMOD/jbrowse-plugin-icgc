import React from 'react'
import { types } from 'mobx-state-tree'
import { render } from '@testing-library/react'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import ICGCFeatureDetails from './ICGCFeatureWidget'

describe('ICGCTrack widget', () => {
  it('renders a mutation with the required model elements', () => {
    const f = types
      .model({
        // used as proxy for session
        pluginManager: types.optional(types.frozen(), {}),
        rpcManager: types.optional(types.frozen(), {}),
        // used as proxy for session
        configuration: ConfigurationSchema('null', {}),
        featureData: types.frozen({
          refName: 'chr3',
          type: 'single base substitution',
          start: 124907170,
          end: 124907171,
          id: 'MU125557849',
          chromosome: 3,
          mutation: 'G>T',
          assemblyVersion: 'GRCh37',
          referenceGenomeAllele: 'G',
          testedDonorCount: 186,
          affectedDonorCountTotal: 1,
          affectedDonorCountFiltered: 1,
          affectedProjectCount: 1,
          functionalImpact: 'Unknown',
        }),
      })
      .create()

    const { container } = render(<ICGCFeatureDetails model={f} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders a gene with the required model elements', () => {
    const f = types
      .model({
        // used as proxy for session
        rpcManager: 'hello',
        // used as proxy for session
        configuration: ConfigurationSchema('null', {}),
        featureData: types.frozen({
          refName: 'chr3',
          type: 'MU128994531',
          start: 124909350,
          end: 124909349,
          id: 'DO52170',
          donorId: 'DO52170',
          mutationId: 'MU128994531',
          chromosome: 3,
          projectId: 'LIHC-US',
          mutation: 'G>T',
        }),
      })
      .create()

    const { container } = render(<ICGCFeatureDetails model={f} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
