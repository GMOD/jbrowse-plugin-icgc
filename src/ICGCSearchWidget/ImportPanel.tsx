import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import AddIcon from '@material-ui/icons/Add'
import ExitToApp from '@material-ui/icons/ExitToApp'
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

  const [tokenStored, setTokenStored] = useState(false)
  const [authErrorMessage, setAuthErrorMessage] = useState<String>()
  const [success, setSuccess] = useState(false)
  const [trackErrorMessage, setTrackErrorMessage] = useState<String>()
  const [trackInfoMessage, setTrackInfoMessage] = useState<String>()
  const [browseSuccess, setBrowseSuccess] = useState(false)

  const session = getSession(model)
  const inputRef = useRef()

  const handleSubmit = async () => {}

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
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {tokenStored ? (
          <Alert severity="success">
            Your token has been stored.
            <br />
            Verification of your token will be performed when you attempt to
            access controlled data.
          </Alert>
        ) : null}
        {authErrorMessage ? (
          <Alert severity="error">{authErrorMessage}</Alert>
        ) : null}
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1">
            Login to access controlled data
          </Typography>
          <Button
            color="primary"
            variant="contained"
            size="small"
            startIcon={<ExitToApp />}
          >
            Login
          </Button>
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h6" component="h1" align="center">
          Import File by UUID or URL
        </Typography>
        <Typography variant="body1" align="center">
          Add a track by providing the UUID or URL of a file, including
          controlled data.
        </Typography>
        {trackErrorMessage ? (
          <Alert severity="error">{trackErrorMessage}</Alert>
        ) : null}
        {trackInfoMessage ? (
          <Alert severity="info">{trackInfoMessage}</Alert>
        ) : null}
        {success ? (
          <Alert severity="success">The requested track has been added.</Alert>
        ) : null}
        <div className={classes.submitContainer}>
          <TextField
            color="primary"
            variant="outlined"
            label="Enter UUID or URL"
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
