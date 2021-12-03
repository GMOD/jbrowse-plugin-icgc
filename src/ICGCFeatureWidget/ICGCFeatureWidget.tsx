import React from 'react'
import { observer } from 'mobx-react'
import {
  FeatureDetails,
  BaseCard,
} from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'
import { Paper, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({}))

function ICGCFeatureDetails(props: any) {
  const { model } = props
  const feature = model.featureData

  return (
    <Paper data-testid="ideo-widget">
      <FeatureDetails
        feature={feature}
        {...props}
        omit={['synonyms', 'externalLinks']}
      />
    </Paper>
  )
}

export default observer(ICGCFeatureDetails)
