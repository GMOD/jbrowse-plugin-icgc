import React from 'react'
import { makeStyles } from '@material-ui/core'
import { observer } from 'mobx-react'
import { IAnyStateTreeNode } from 'mobx-state-tree'

const useStyles = makeStyles(theme => ({}))

function ConfigurationEditor({ model }: { model: IAnyStateTreeNode }) {
  const classes = useStyles()

  return <div data-testid="configEditor">Hello, world</div>
}

export default observer(ConfigurationEditor)
