"use client";
import React from "react";
import cn from "classnames";
import { Id } from "react-toastify";
import { Todo } from "../types/Todo";
import { deleteTodo } from "../services/todos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  todos: Todo[] | undefined;
  notify: (text: string) => Id;
  notifyError: (text: string) => Id;
};

const TodosList: React.FC<Props> = (props) => {
  const { todos, notify, notifyError } = props;

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      notify("Todo was deleted successfully");
    },
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const prevTodos = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], (old: Todo[]) =>
        old.filter((todo) => todo.id !== todoId)
      );

      return { prevTodos };
    },
    onError: (error, todoId, context) => {
      queryClient.setQueryData(["todos"], context?.prevTodos);
      notifyError("Failed to delete todo");
    },
  });

  const handleDelete = async (todoId: number) => {
    mutate(todoId);
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
                "opacity-50 cursor-wait animate-pulse": isPending,
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
              disabled={isPending}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TodosList;
