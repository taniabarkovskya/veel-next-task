"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Slide, ToastContainer, toast } from "react-toastify";

import { useQuery } from "@tanstack/react-query";

import { useState } from "react";
import { getTodos } from "./services/todos";
import { Todo } from "./types/Todo";
import TodoForm from "./components/TodoForm";
import TodosList from "./components/TodosList";

export default function Home() {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const notify = (text: string ) =>
    toast.success(text, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
  
    const notifyError = (text: string ) =>
      toast.error(text, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });

  return (
    <div className="flex justify-center items-center flex-col mt-10 gap-8">
      <h1 className="text-8xl font-bold text-gray-800">Todos</h1>
      <TodoForm
        todos={data}
        tempTodo={tempTodo}
        setTempTodo={setTempTodo}
        notify={notify}
        notifyError={notifyError}
      />
      {isLoading ? (
        <Skeleton height={60} width={800} count={10} borderRadius={12} />
      ) : (
        <TodosList
          todos={data}
            tempTodo={tempTodo}
            notify={notify}
            notifyError={notifyError}
        />
      )}
      {isError && notifyError("Failed to get todos")}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </div>
  );
}
