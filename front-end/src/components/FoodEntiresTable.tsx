import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

import type { IFood } from '../types';

interface Column {
  id: 'name' | 'takenDateTime' | 'calorieValue' | 'price';
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: number | string) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  {
    id: 'takenDateTime',
    label: 'Date/Time',
    minWidth: 170,
    align: 'right',
    format: (value) => {
      const d = new Date(value);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    },
  },
  {
    id: 'calorieValue',
    label: 'Calorie',
    minWidth: 170,
    align: 'right',
    format: (value) => typeof value === 'number' ? value.toFixed(2) : value,
  },
  {
    id: 'price',
    label: 'Price',
    minWidth: 150,
    align: 'right',
    format: (value) => typeof value === 'number' ? value.toFixed(2) : Number(value).toFixed(2),
  },
];

type TableProps = {
  isAdmin: boolean,
  data: IFood[],
  onUpdatePrice: (id: number, price: number) => void,
  onDeleteFood: (id: number) => void,
  onUpdateFood?: (food: IFood) => void
}

type ModalProps = {
  id: number,
  action: 'delete' | 'edit' | 'price',
  data?: IFood
}
export default function FoodEntiresTable({
  isAdmin,
  data,
  onUpdatePrice,
  onDeleteFood,
  onUpdateFood
}: TableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState<ModalProps | undefined>(undefined);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClose = () => setModalOpen(undefined);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    if (modalOpen?.action === 'price') {
      onUpdatePrice(modalOpen.id, Number(target.price.value));
    } else if (modalOpen?.action === 'edit') {
      if (modalOpen?.data && onUpdateFood) {
        onUpdateFood({
          ...modalOpen.data,
          name: target.foodName.value,
          calorieValue: target.calorieValue.value,
          price: target.price.value,
        });
      }
    } else {
      onDeleteFood(modalOpen?.id || 0);
    }
    handleClose();
  }

  return (
    <>
      <Paper sx={{ overflow: 'hidden', marginTop: 1, marginBottom: 3 }}>
        <TableContainer sx={{ maxHeight: 340 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  align='center'
                  style={{ minWidth: 50 }}
                >
                  No
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                {isAdmin && (
                  <TableCell
                    align='center'
                    style={{ minWidth: 100 }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell align="center">{index+1}</TableCell>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={index + '_' + column.id} align={column.align}>
                            {column.format ? column.format(value) : value}
                            {!isAdmin && column.id === 'price' && (
                              <IconButton onClick={() => setModalOpen({ id: row.id, action: 'price', data: row })}>
                                <Edit />
                              </IconButton>
                            )}
                          </TableCell>
                        );
                      })}
                      {isAdmin && (
                        <TableCell align="center">
                          <IconButton onClick={() => setModalOpen({ id: row.id, action: 'edit', data: row })}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => setModalOpen({ id: row.id, action: 'delete' })}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {modalOpen && (
        <Dialog open onClose={handleClose}>
          <DialogTitle>
            {modalOpen.action === 'price'
              ? 'Add/Edit Price'
              : modalOpen.action === 'edit'
              ? 'Edit Food'
              : 'Delete Food'
            }
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ paddingTop: 0 }}>
              {modalOpen.action === 'edit' && (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="foodName"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    required
                    defaultValue={modalOpen.data?.name}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    name="calorieValue"
                    label="Calorie"
                    type="number"
                    fullWidth
                    variant="standard"
                    required
                    defaultValue={modalOpen.data?.calorieValue}
                  />
                </>
              )}
              {(modalOpen.action === 'price' || modalOpen.action === 'edit') && (
                <TextField
                  autoFocus
                  margin="dense"
                  id="price"
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  variant="standard"
                  required
                  defaultValue={modalOpen.data?.price}
                />
              )}
              {modalOpen.action === 'delete' && (
                <span>Are you sure?</span>
              )}
            </DialogContent>
            <DialogActions>
              <Button type="submit">Ok</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  );
}
