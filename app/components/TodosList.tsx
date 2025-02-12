"use client";
import React from "react";
import cn from "classnames";
import { Id } from "react-toastify";
import { Todo } from "../types/Todo";
import { deleteTodo } from "../services/todos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  todos: Todo[] | undefined;
  tempTodo: Todo | null;
  notify: (text: string) => Id;
  notifyError: (text: string) => Id;
};

const TodosList: React.FC<Props> = (props) => {
  const { todos, tempTodo, notify, notifyError } = props;

  const queryClient = useQueryClient();
  const { mutate, isError } = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const prevTodos = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], (old: Todo[]) =>
        old.filter((todo) => todo.id !== todoId)
      );

      return { prevTodos };
    },
  });

  const handleDelete = async (todoId: number) => {
    try {
      mutate(todoId);
      notify("Todo was deleted successfully");
    } catch (error) {
      console.error(error);
      notifyError("Failed to delete todo")
    }
  };

  return (
    <>
      <ul>
        {todos?.map((todo) => (
          <li
            className={cn(
              "w-[800px] flex gap-10 justify-between items-center text-xl mb-3 p-4 rounded-xl hover:scale-105 transition duration-300 ease-in-out",
              {
                "bg-green-100": todo.completed,
                "bg-pink-100": !todo.completed,
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
            <button className="w-6 h-6 flex items-center justify-center border border-black rounded-full pb-1 text-m transition duration-300 ease-in-out">
              x
            </button>
          </li>
        )}
      </ul>
      {isError && notifyError("Failed to delete todo")}
    </>
  );
};

export default TodosList;
