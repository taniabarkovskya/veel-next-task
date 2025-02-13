import axios from "axios";
import { Todo } from "../types/Todo";
import { TodoCreate } from "../types/TodoCreate";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("Environment variable NEXT_PUBLIC_API_URL is missing!");
}

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
  try {
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

export async function updateTodo({ id, title, userId, completed }: Todo) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/${id}`,
      { id, title, userId, completed },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update todo");
  }
}
