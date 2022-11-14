import React from 'react';
import {
  useNavigate,
  createSearchParams
} from 'react-router-dom';
// Components of material.mui from https://mui.com/material-ui/react-dialog/
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
// Components of mui x from https://mui.com/x/
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function FormDialog () {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const submitSearch = () => {
    const params = { title, city, minBedrooms, maxBedrooms, minPrice, maxPrice, startDate, endDate, sortByHighest }

    navigate({
      pathname: '/advancedSearch',
      search: `?${createSearchParams(params)}`,
    });
  }

  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [title, setTitle] = React.useState();
  const [city, setCity] = React.useState();
  const [minBedrooms, setMinimumBeds] = React.useState();
  const [maxBedrooms, setMaximumBeds] = React.useState();
  const [minPrice, setMinimumPrice] = React.useState();
  const [maxPrice, setMaximumPrice] = React.useState();
  const [sortByHighest, setSortRating] = React.useState(true)

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        style = {{
          height: '56px'
        }}
      >
        Advanced Search
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Advanced Search Form</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Fill out the field details to have an advanced search on all listings
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="string"
              fullWidth
              variant="standard"
              onChange={event => setTitle(event.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              label="City"
              type="string"
              fullWidth
              variant="standard"
              onChange={event => setCity(event.target.value)}
            />
            <div>
              <TextField
                autoFocus
                margin="dense"
                label="Minimum Bedrooms"
                type="number"
                variant="standard"
                onChange={event => setMinimumBeds(event.target.value)}
              />
              &nbsp;&nbsp;&nbsp;
              <TextField
                autoFocus
                margin="dense"
                label="Maximum Bedrooms"
                type="number"
                variant="standard"
                onChange={event => setMaximumBeds(event.target.value)}
              />
            </div>
            <div>
              <TextField
                autoFocus
                margin="dense"
                label="Minimum Price (per night)"
                type="number"
                variant="standard"
                onChange={event => setMinimumPrice(event.target.value)}
              />
              &nbsp;&nbsp;&nbsp;
              <TextField
                autoFocus
                margin="dense"
                label="Maximum Price (per night)"
                type="number"
                variant="standard"
                onChange={event => setMaximumPrice(event.target.value)}
              />
            </div>
            <p>Date Range</p>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={(newDate) => {
                    newDate.$d.setHours(11, 0, 0);
                    setStartDate(newDate.$d);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End date"
                value={endDate}
                onChange={(newDate) => {
                  newDate.$d.setHours(11, 0, 0);
                  setEndDate(newDate.$d);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            </div>
            <p>Rating</p>
            <FormGroup>
              <span>
              Lowest to Highest&nbsp;&nbsp;&nbsp;
              <FormControlLabel
                onChange = {event => {
                  setSortRating(event.target.checked)
                }}
                control={<Switch defaultChecked />}
              />
              Highest to Lowest
              </span>
            </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {
            submitSearch()
            handleClose()
          }}>
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
