"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import cn from "classnames";
import { Id } from "react-toastify";
import { createTodo } from "../services/todos";
import { Todo } from "../types/Todo";
import { TodoCreate } from "../types/TodoCreate";

type Props = {
  todos: Todo[] | undefined;
  notify: (text: string) => Id;
  notifyError: (text: string) => Id;
};

const TodoForm: React.FC<Props> = (props) => {
  const { todos, notify, notifyError } = props;
  const [todoTitle, setTodoTitle] = useState("");
  const normalizedTitle = todoTitle.trim();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      notify("Todo was created successfully");
    },
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const prevTodos = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], (old: Todo[]) => [
        ...old,
        { id: Date.now(), ...newTodo },
      ]);

      return { prevTodos };
    },
    onError: (error, todoId, context) => {
      queryClient.setQueryData(["todos"], context?.prevTodos);
      notifyError("Failed to create new todo");
    },
  });

  const inputNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputNameRef.current) {
      inputNameRef.current.focus();
    }
  }, [todos, isPending]);

  const onAddTodo = async (newTodo: TodoCreate): Promise<void> => {
    mutate(newTodo);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedTitle) {
      notifyError("Todo title cannot be empty");
      return;
    }

    const newTodo = {
      title: normalizedTitle,
      userId: 1,
      completed: false,
    };

    try {
      await onAddTodo(newTodo);
      setTodoTitle("");
    } catch (error) {
      console.error(error);
      notifyError("Failed to create new todo");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputNameRef}
          type="text"
          className={cn(
            "w-[800px] border border-gray-800 rounded-xl p-4 text-xl",
            { "opacity-50 cursor-wait animate-pulse": isPending }
          )}
          placeholder="new todo"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isPending}
        />
      </form>
    </>
  );
};

export default TodoForm;
