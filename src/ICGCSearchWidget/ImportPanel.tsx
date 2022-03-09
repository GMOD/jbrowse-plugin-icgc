import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import {
  Button,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import AddIcon from '@material-ui/icons/Add'
import { getSession } from '@jbrowse/core/util'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    margin: `0px 0px ${theme.spacing(1)}px 0px`,
    justifyContent: 'center',
  },
  submitContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

function Panel({ model }: { model: any }) {
  const classes = useStyles()

  const [browseSuccess, setBrowseSuccess] = useState(false)
  const [trackSuccess, setTrackSuccess] = useState(false)
  const [trackErrorMessage, setTrackErrorMessage] = useState<String>()

  const session = getSession(model)
  const inputRef = useRef()

  function resetMessages() {
    setTrackErrorMessage(undefined)
    setTrackSuccess(false)
  }

  const handleSubmit = () => {
    resetMessages()
    try {
      //@ts-ignore
      let fileReq = inputRef ? inputRef.current.value : undefined
      fileReq = fileReq.split('/')[4]

      if (session) {
        const datenow = Date.now()
        const trackId = `file-${datenow}`
        // @ts-ignore
        session.addTrackConf({
          type: 'FeatureTrack',
          trackId,
          name: `check-1`,
          assemblyNames: ['hg38'],
          category: ['Annotation'],
          adapter: {
            type: 'DCCAdapter',
            dccLocation: {
              uri: `https://dcc.icgc.org/api/v1/download?fn=/current/Projects/GACA-CN/simple_somatic_mutation.open.GACA-CN.tsv.gz`,
              locationType: 'UriLocation',
            },
          },
        })
        // @ts-ignore
        session.views[0].showTrack(trackId)
        setTrackSuccess(true)
      }
    } catch (e) {
      console.error(e)
      const message =
        // @ts-ignore
        e.message.length > 100 ? `${e.message.substring(0, 99)}...` : e
      setTrackErrorMessage(`Failed to add track.\n ${message}.`)
    }
  }

  const handleAddBrowse = () => {
    if (session) {
      const datenow = Date.now()
      const trackId = `icgc_browse_track-${datenow}`
      // @ts-ignore
      session.addTrackConf({
        type: 'ICGCTrack',
        trackId,
        name: `ICGC Browse ${datenow}`,
        assemblyNames: ['hg38'],
        category: ['Annotation'],
        adapter: {
          ICGCAdapterId: 'DefaultICGCAdapter',
          type: 'ICGCAdapter',
        },
        displays: [
          {
            type: 'LinearICGCDisplay',
            displayId: `icgc_browse_track_linear_${datenow}`,
          },
        ],
      })
      // @ts-ignore
      session.views[0].showTrack(trackId)
      setBrowseSuccess(true)
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h6" component="h1" align="center">
          Import DCC File by URL
        </Typography>
        <Typography variant="body1" align="center">
          Add a track by providing the URL of a DCC file, including controlled
          data.
        </Typography>
        {trackErrorMessage ? (
          <Alert severity="error">{trackErrorMessage}</Alert>
        ) : null}
        {trackSuccess ? (
          <Alert severity="success">The requested track has been added.</Alert>
        ) : null}
        <div className={classes.submitContainer}>
          <TextField
            color="primary"
            variant="outlined"
            label="Enter URL"
            inputRef={inputRef}
          />
          <div className={classes.buttonContainer}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h6" component="h1" align="center">
          Quick-add an ICGC Browse Track
        </Typography>
        <Typography variant="body1" align="center">
          Add additional Browse tracks to your current view by clicking this
          button.
        </Typography>
        {browseSuccess ? (
          <Alert severity="success">
            The requested Browse track has been added.
          </Alert>
        ) : null}
        <Button
          color="primary"
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleAddBrowse}
        >
          Add New ICGC Browse Track
        </Button>
      </Paper>
    </div>
  )
}

export default observer(Panel)
