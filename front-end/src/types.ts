export interface IUser {
  id: number,
  firstName: string,
  lastName: string,
  role: "user" | "admin",
}

export interface IFood {
  id: number,
  name: string;
  calorieValue: number;
  takenDateTime: string;
  price: number;
  user?: Object
}
