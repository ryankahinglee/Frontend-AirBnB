import React from 'react';
import PropTypes from 'prop-types'
import makeRequest from '../helpers/makeRequest';
import { contextVariables } from '../helpers/contextVariables';
// From material ui
import { Dialog, DialogTitle, Button, DialogContentText, DialogActions, DialogContent } from '@mui/material';

// This component allows for deleting a listing with a confirmation for the user prior to listing deletion
export default function DeleteListingButton ({ lId, desc, listingSetter }) {
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
      <Button variant='outlined' name='delete-button' onClick={() => {
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
          <Button name='confirm-delete-button' onClick={() => {
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
DeleteListingButton.propTypes = {
  lId: PropTypes.number,
  desc: PropTypes.string,
  listingSetter: PropTypes.func
}
