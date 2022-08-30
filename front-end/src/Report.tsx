import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from "@mui/material";

import axiosInstance from "./axiosInstance";
import { BarChart } from "./components";

interface IReportData {
  lastWeekCount: number,
  previousWeekCount: number,
  last7DaysCalories: {userName: string, average: number}[],
}

export default function Report() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resData, setResData] = useState<IReportData | null>(null);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/reports/get-food-entries-report');
      setResData(data as IReportData);
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      fetchData();
    }

    return () => {
      setIsMounted(false);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {(isLoading || !resData) ? (
        <Box
          display="flex"
          alignItems="center"
          sx={{ height: "100vh" }}
        >
          <CircularProgress disableShrink />
        </Box>
      ) : (
        <Grid container spacing={2} maxWidth={1000} marginTop={20}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: '0 30px' }}>
              <BarChart
                prevCount={resData.previousWeekCount}
                lastCount={resData.lastWeekCount}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ overflow: 'hidden' }}>
              <TableContainer sx={{ height: 250 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align='center'
                        style={{ width: 60 }}
                      >
                        No
                      </TableCell>
                      <TableCell
                        align='left'
                        style={{ minWidth: 140 }}
                      >
                        User
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ minWidth: 100 }}
                      >
                        Avg of Calories
                      </TableCell>                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resData.last7DaysCalories.length === 0 ? (
                      <TableRow hover tabIndex={-1}>
                        <TableCell align="center" colSpan={3}>
                          No data
                        </TableCell>
                      </TableRow>
                    ) : (
                      resData.last7DaysCalories
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                          return (
                            <TableRow hover tabIndex={-1} key={index}>
                              <TableCell align="center">{index+1}</TableCell>
                              <TableCell align="left">{row.userName}</TableCell>
                              <TableCell align="right">{row.average.toFixed(2)}</TableCell>
                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={resData.last7DaysCalories.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
}
