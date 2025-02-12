"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodosList from "./components/TodosList";
import { fetchTodos } from "./services/todos";
import { Todo } from "./types/Todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTodos()
      .then(setTodos)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex justify-center items-center flex-col mt-10 gap-8">
      <h1 className="text-8xl font-bold text-gray-800">Todos</h1>
      <TodoForm
        todos={todos}
        tempTodo={tempTodo}
        setTempTodo={setTempTodo}
        setTodos={setTodos}
      />
      {loading ? (
        <Skeleton height={60} width={800} count={10} borderRadius={12}/>
      ) : (
        <TodosList
          todos={todos}
          setTodos={setTodos}
          loadingTodosIds={loadingTodosIds}
          setLoadingTodosIds={setLoadingTodosIds}
          tempTodo={tempTodo}
        />
      )}

    </div>
  );
}
