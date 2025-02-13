"use client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import cn from "classnames";
import { Id } from "react-toastify";
import { Todo } from "../types/Todo";
import { deleteTodo, updateTodo } from "../services/todos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  todo: Todo;
  editingTodoId: number | null;
  setEditingTodoId: Dispatch<SetStateAction<number | null>>;
  notify: (text: string) => Id;
  notifyError: (text: string) => Id;
};

const TodoComponent: React.FC<Props> = (props) => {
  const { todo, editingTodoId, setEditingTodoId, notify, notifyError } = props;

  const [newTitle, setNewTitle] = useState(todo.title);

  const inputNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputNameRef.current) {
      inputNameRef.current.focus();
    }
  }, [editingTodoId]);

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
        old.map((todo) => {
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

  const handleEdit = async (newTodo: Todo) => {
    if (newTitle === newTodo.title) {
      setEditingTodoId(null);
      return;
    }

    if (newTitle.trim() === "") {
      remove.mutate(newTodo.id);
      setEditingTodoId(null);

      return;
    }

    update.mutate({
      ...newTodo,
      title: newTitle.trim(),
    });
    setEditingTodoId(null);
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setEditingTodoId(null);
      setNewTitle(todo.title);
    }
  };

  const pendingStyles = remove.isPending || update.isPending;

  return (
    <>
      {editingTodoId === todo.id ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleEdit(todo);
          }}
          onBlur={() => handleEdit(todo)}
        >
          <input
            type="text"
            className="w-full text-center box-border text-md md:text-xl mb-3 p-4 rounded-xl"
            placeholder="empty todo will be deleted"
            ref={inputNameRef}
            value={newTitle}
            onChange={(event) => {
              setNewTitle(event.target.value);
            }}
            onKeyUp={handleEscape}
          />
        </form>
      ) : (
        <li
          className={cn(
            "w-full box-border flex gap-4 md:gap-10 justify-between items-center text-md md:text-xl mb-3 p-4 rounded-xl hover:scale-105 transition duration-300 ease-in-out",
            {
              "bg-green-100": todo.completed,
              "bg-pink-100": !todo.completed,
              "opacity-50 cursor-wait animate-pulse": pendingStyles,
            }
          )}
          onDoubleClick={() => setEditingTodoId(todo.id)}
        >
          <input
            type="checkbox"
            className="shrink-0 appearance-none w-4 h-4 border border-black rounded-xl bg-white mt-1 cursor-pointer checked:bg-green-500"
            checked={todo.completed}
            onChange={() => {
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
      )}
    </>
  );
};

export default TodoComponent;
