"use client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import cn from "classnames";
import { Id } from "react-toastify";
import { createTodo } from "../services/todos";
import { Todo } from "../types/Todo";
import { TodoCreate } from "../types/TodoCreate";

type Props = {
  todos: Todo[] | undefined;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  notify: (text: string) => Id;
  notifyError: (text: string) => Id;
};

const TodoForm: React.FC<Props> = (props) => {
  const { todos, tempTodo, setTempTodo, notify, notifyError } = props;
  const [todoTitle, setTodoTitle] = useState("");
  const normalizedTitle = todoTitle.trim();

  const inputNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputNameRef.current) {
      inputNameRef.current.focus();
    }
  }, [todos, tempTodo]);

  const queryClient = useQueryClient();
  const { mutate, isError } = useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const prevTodos = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], (old: Todo[]) => [
        ...old,
        { id: Date.now(), ...newTodo },
      ]);

      return { prevTodos };
    },
  });

  const onAddTodo = async (newTodo: TodoCreate): Promise<void> => {
    try {
      mutate(newTodo);
      notify("Todo was created successfully");
    } catch (error) {
      console.error(error);
    }
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

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      await onAddTodo(newTodo);
      setTodoTitle("");
    } catch (error) {
      console.error(error);
      notifyError("Failed to create new todo");
    } finally {
      setTempTodo(null);
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
            { "cursor-wait animate-pulse": !!tempTodo }
          )}
          placeholder="new todo"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
      {isError && notifyError("Failed to create new todo")}
    </>
  );
};

export default TodoForm;
