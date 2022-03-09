import { ConfigurationSchema } from '@jbrowse/core/configuration'

export default ConfigurationSchema(
  'DCCAdapter',
  {
    dccLocation: {
      type: 'fileLocation',
      defaultValue: { uri: '/path/file.tsv', locationType: 'UriLocation' },
    },
  },
  { explicitlyTyped: true },
)
