import React from 'react';
import PropTypes from 'prop-types'
import makeRequest from '../makeRequest';
import { contextVariables } from '../contextVariables';
import { Dialog, DialogTitle, Button, DialogContentText, DialogActions, DialogContent } from '@mui/material';

export default function DeleteButton ({ lId, desc, listingSetter }) {
  const { getters } = React.useContext(contextVariables);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant='outlined' onClick={() => {
        handleClickOpen();
      }}>
        {desc}
      </Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Confirm Deletion of Listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible. <br />Please confirm the deletion of your booking
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {
            makeRequest(`/listings/${lId}`, 'delete', undefined, getters.token).then((res) => {
              if (!('error' in res)) {
                listingSetter(lId)
              }
            })
            handleClose()
          }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
DeleteButton.propTypes = {
  lId: PropTypes.number,
  desc: PropTypes.string,
  listingSetter: PropTypes.func
}
