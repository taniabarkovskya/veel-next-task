import axios from "axios";
import { Todo } from "../types/Todo";
import { TodoCreate } from "../types/TodoCreate";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTodos(): Promise<Todo[]> {
  try {
    const response = await axios.get(`${BASE_URL}?_limit=10`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get todos");
  }
}

export async function deleteTodo(todoId: number): Promise<void> {
  try{
    await axios.delete(`${BASE_URL}/${todoId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete todo");
  }
}

export async function createTodo(newTodo: TodoCreate) {
  try {
    const response = await axios.post(`${BASE_URL}`, newTodo, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create new todo");
  }
}
