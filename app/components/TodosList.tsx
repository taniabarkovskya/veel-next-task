"use client";
import React from "react";
import cn from "classnames";
import { Id } from "react-toastify";
import { Todo } from "../types/Todo";
import { deleteTodo, updateTodo } from "../services/todos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  todos: Todo[] | undefined;
  notify: (text: string) => Id;
  notifyError: (text: string) => Id;
};

const TodosList: React.FC<Props> = (props) => {
  const { todos, notify, notifyError } = props;

  const queryClient = useQueryClient();

  const remove = useMutation({
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

  const update = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      notify("Todo was updated successfully");
    },
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const prevTodos = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], (old: Todo[]) =>
        old.map(todo => {
          return todo.id === updatedTodo.id ? updatedTodo : todo;
        })
      );

      return { prevTodos };
    },
    onError: (error, updatedTodo, context) => {
      queryClient.setQueryData(["todos"], context?.prevTodos);
      notifyError("Failed to update todo");
    },
  });

  const handleDelete = async (todoId: number) => {
    remove.mutate(todoId);
  };

  const handleUpdate = async (updatedTodo: Todo) => {
    update.mutate({ ...updatedTodo, completed: !updatedTodo.completed });
  };

  return (
    <>
      <ul className="w-full">
        {todos?.map((todo) => (
          <li
            className={cn(
              "w-full box-border flex gap-4 md:gap-10 justify-between items-center text-md md:text-xl mb-3 p-4 rounded-xl hover:scale-105 transition duration-300 ease-in-out",
              {
                "bg-green-100": todo.completed,
                "bg-pink-100": !todo.completed,
                "opacity-50 cursor-wait animate-pulse": remove.isPending || update.isPending,
              }
            )}
            key={todo.id}
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="shrink-0 appearance-none w-4 h-4 border border-black rounded-xl bg-white mt-1 cursor-pointer checked:bg-green-500"
              checked={todo.completed}
              onClick={() => {
                handleUpdate(todo);
              }}
            />
            <span className="text-gray-600 transition duration-300 ease-in-out">
              {todo.title}
            </span>
            <button
              className="shrink-0 w-6 h-6 flex items-center justify-center border border-black rounded-full pb-1 text-m transition duration-300 ease-in-out hover:text-red-600 hover:border-red-600"
              onClick={() => {
                handleDelete(todo.id);
              }}
              disabled={remove.isPending}
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
