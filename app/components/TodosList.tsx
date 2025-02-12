"use client";
import React, { Dispatch, SetStateAction } from "react";
import cn from "classnames";
import { Todo } from "../types/Todo";
import { deleteTodo } from "../services/todos";

type Props = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  loadingTodosIds: number[];
  setLoadingTodosIds: Dispatch<SetStateAction<number[]>>;
  tempTodo: Todo | null;
};

const TodosList: React.FC<Props> = (props) => {
  const { todos, setTodos, loadingTodosIds, setLoadingTodosIds, tempTodo } =
    props;

  const handleDelete = async (todoId: number) => {
    setLoadingTodosIds((currentIds) => [...currentIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTodosIds((currentIds) =>
        currentIds.filter((id) => id !== todoId)
      );
    }
  };

  return (
    <ul>
      {todos.map((todo) => (
        <li
          className={cn(
            "w-[800px] flex gap-10 justify-between items-center text-xl mb-3 p-4 rounded-xl hover:scale-105 transition duration-300 ease-in-out",
            {
              "bg-green-100": todo.completed,
              "bg-pink-100": !todo.completed,
              "animate-pulse opacity-50": loadingTodosIds.includes(
                todo.id
              ),
            }
          )}
          key={todo.id}
        >
          <span className="text-gray-600 transition duration-300 ease-in-out">
            {todo.title}
          </span>
          <button
            className="w-6 h-6 flex items-center justify-center border border-black rounded-full pb-1 text-m transition duration-300 ease-in-out hover:text-red-600 hover:border-red-600"
            onClick={() => {
              handleDelete(todo.id);
            }}
            disabled={loadingTodosIds.includes(todo.id)}
          >
            x
          </button>
        </li>
      ))}
      {tempTodo && (
        <li
        className={cn(
          "w-[800px] flex gap-10 justify-between items-center text-xl mb-3 p-4 rounded-xl hover:scale-105 transition duration-300 ease-in-out animate-pulse opacity-50",
          {
            "bg-green-100": tempTodo.completed,
            "bg-pink-100": !tempTodo.completed,
          }
        )}
      >
        <span className="text-gray-600 transition duration-300 ease-in-out">
          {tempTodo.title}
        </span>
        <button
          className="w-6 h-6 flex items-center justify-center border border-black rounded-full pb-1 text-m transition duration-300 ease-in-out"
        >
          x
        </button>
      </li>
      )}
    </ul>
  );
};

export default TodosList;
