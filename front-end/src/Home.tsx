import { useState, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";
import { AxiosError } from 'axios';
import * as fns from "date-fns";
import type { DateRange } from "materialui-daterange-picker";
import {
  AddFood,
  FoodEntiresTable,
  FilterPicker,
} from './components';

import axiosInstance from './axiosInstance';
import { IFood } from './types';

interface ReachedCalorieLimit {
  tokenDate: string,
  calorieValue:  number
}
interface ReachedPriceLimit {
  tokenMonth: string,
  price:  number
}

const COLORIE_LIMIT: number = 2100;

export default function Home({ isAdmin }: { isAdmin: boolean }) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [calories, setCalories] = useState<ReachedCalorieLimit[]>([]);
  const [prices, setPrices] = useState<ReachedPriceLimit[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [foodList, setFoodList] = useState<IFood[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      let apiEndpoint = '/api/food';

      const { startDate, endDate } = dateRange;
      if (startDate && endDate) {
        const start = fns.format(startDate, 'yyy-MM-dd')+'T00:00:00.000Z';
        const end = fns.format(endDate, 'yyy-MM-dd')+'T00:00:00.000Z';
        apiEndpoint += `?filter=takenDateTime||between||${start},${end}`
      }

      const { data } = await axiosInstance.get(apiEndpoint);

      setFoodList(data);
    } catch (error) {
      const err = error as AxiosError;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      fetchData();
    }

    return () => {
      setIsMounted(false);
      setFoodList([]);
      setError(undefined);
      setLoading(false);
      setDateRange({});
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isMounted) fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  useEffect(() => {
    if (foodList.length === 0) {
      setPrices([]);
      setCalories([]);
      return;
    }

    const calorie: { [index: string]: number } = {};
    const price: { [index: string]: number } = {};

    for (let i=0; i<foodList.length; i++) {
      const food: IFood = foodList[i];
      const tokenDate = fns.format(new Date(food.takenDateTime), 'yyyy-MM-dd');
      if (calorie[tokenDate] === undefined) calorie[tokenDate] = Number(food.calorieValue);
      else calorie[tokenDate] += Number(food.calorieValue);

      const tokenMonth = fns.format(new Date(food.takenDateTime), 'yyyy-MM');
      if (price[tokenMonth] === undefined) price[tokenMonth] = Number(food.price);
      else price[tokenMonth] += Number(food.price);
    }

    setCalories(Object.keys(calorie)
      .filter(date => calorie[date] >= COLORIE_LIMIT)
      .map(date => ({ tokenDate: date, calorieValue:  calorie[date] }))
    );

    setPrices(Object.keys(price)
      .filter(month => price[month] >= 1000)
      .map(month => ({ tokenMonth: month, price:  price[month] }))
    );
  }, [foodList]);

  const handleAddFood = async (name: string, calorieValue: number) => {
    setAdding(true);
    try {
      const { data } = await axiosInstance.post('/api/food', { name, calorieValue });
      setFoodList(prevList => [...prevList, data]);
    } catch (error) {
      const err = error as AxiosError;
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  const handleUpdatePrice = async (id: number, price: number) => {
    try {
      const { data } = await axiosInstance.patch(`/api/food/${id}/update-price/${price}`);
      setFoodList(prevList => prevList.map(list => list.id === data.id ? data : list));
    } catch (error) {
      const err = error as AxiosError;
      setError(err.message);
    }
  }

  const handleDeleteFood = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/food/${id}`);
      setFoodList(prevList => prevList.filter(d => d.id !== id));
    } catch (error) {
      const err = error as AxiosError;
      setError(err.message);
    }
  }

  const handleUpdateFood = async (food: IFood) => {
    try {
      const { data } = await axiosInstance.patch(`/api/food/${food.id}`, food);
      setFoodList(prevList => prevList.map(list => list.id === data.id ? data : list));
    } catch (error) {
      const err = error as AxiosError;
      setError(err.message);
    }
  }

  return (
    <>
      <Stack
        sx={{
          width: '100%',
          padding: 2,
          position: 'absolute',
          zIndex: 99,
        }}
        spacing={2}
      >
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(undefined)}
          >
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        {calories.length > 0 && (
          <Alert
            severity="warning"
            onClose={() => {setCalories([])}}
          >
            <AlertTitle>Warning</AlertTitle>
            {calories.map((calorie, index) => (
              <div key={index}>
                Consumed more than 2100 calories ({ calorie.calorieValue }) on <strong>{calorie.tokenDate}</strong>
              </div>
            ))}
          </Alert>
        )}
        {prices.length > 0 && (
          <Alert
            severity="warning"
            onClose={() => {setPrices([])}}
          >
            <AlertTitle>Warning</AlertTitle>
            {prices.map((price, index) => (
              <div key={index}>
                Spent more than $1000 (${ price.price }) on <strong>{price.tokenMonth}</strong>
              </div>
            ))}
          </Alert>
        )}
      </Stack>
      {loading ? (
        <Box
          display="flex"
          alignItems="center"
          sx={{ height: "100vh" }}
        >
          <CircularProgress disableShrink />
        </Box>
      ) : (
        <Box sx={{ marginTop: 8 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FilterPicker
              TextFieldProps={{
                label: "Date range",
                variant: "outlined"
              }}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <AddFood onAddFood={handleAddFood} loading={adding} />
          </Box>

          <FoodEntiresTable
            isAdmin={isAdmin}
            data={foodList}
            onUpdatePrice={handleUpdatePrice}
            onDeleteFood={handleDeleteFood}
            onUpdateFood={handleUpdateFood}
          />
        </Box>
      )}
    </>
  );
}
