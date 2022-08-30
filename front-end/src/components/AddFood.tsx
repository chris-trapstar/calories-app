import * as React from 'react';
import Add from '@mui/icons-material/Add';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';

type AddFoodProps = {
  onAddFood: (name: string, calorieValue: number) => void;
  loading?: boolean;
}
export default function AddFood({ onAddFood, loading }: AddFoodProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    onAddFood(target.foodName.value, Number(target.calorieValue.value));
    handleClose();
  }

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Food'}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Food</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ paddingTop: 0 }}>
            <DialogContentText>
              Input Food Name and Calorie value
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="foodName"
              label="Food Name"
              type="text"
              fullWidth
              variant="standard"
              required
            />
            <TextField
              autoFocus
              margin="dense"
              name="calorieValue"
              label="Calorie Value"
              type="number"
              fullWidth
              variant="standard"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
