"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { createTodo } from "../services/todos";
import { Todo } from "../types/Todo";

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>
}

const TodoForm: React.FC<Props> = props => {
  const { todos, tempTodo, setTempTodo, setTodos } = props;
  const [todoTitle, setTodoTitle] = useState("");
  const normalizedTitle = todoTitle.trim();

  const inputNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputNameRef.current) {
      inputNameRef.current.focus();
    }
  }, [todos,tempTodo]);


  const onAddTodo = async (newTodo: Omit<Todo, 'id'>): Promise<void> => {
    try {
      const createdTodo = await createTodo(newTodo);
      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedTitle) {
      // setErrorTodos(ErrorType.EmptyTitle);

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
    } finally {
      setTempTodo(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputNameRef}
        type="text"
        className="w-[800px] border border-gray-800 rounded-xl p-4 text-xl"
        placeholder="new todo"
        value={todoTitle}
        onChange={(event) => setTodoTitle(event.target.value)}
      />
    </form>
  );
};

export default TodoForm;
