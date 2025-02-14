"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Slide, ToastContainer, toast } from "react-toastify";

import { useQuery } from "@tanstack/react-query";

import { getTodos } from "./services/todos";
import TodoForm from "./components/TodoForm";
import TodosList from "./components/TodosList";
import { FilterType } from "./types/FilterType";
import { useState } from "react";
import TodoFilters from "./components/TodoFilters";

export default function Home() {
  const [status, setStatus] = useState(FilterType.All);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const visibleTodos = data?.filter((todo) => {
    switch (status) {
      case FilterType.Completed:
        return todo.completed;
      case FilterType.Active:
        return !todo.completed;
      default:
        return true;
    }
  });

  const notify = (text: string) =>
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

  const notifyError = (text: string) =>
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
    <div className="flex justify-center items-center flex-col mt-10 gap-4 px-10 mx-auto max-w-[800px]">
      <h1 className="text-6xl md:text-8xl font-bold text-gray-800">Todos</h1>
      <TodoForm todos={data} notify={notify} notifyError={notifyError} />
      <TodoFilters status={status} setStatus={setStatus} />
      {isLoading ? (
        <Skeleton height={60} width={800} count={10} borderRadius={12} />
      ) : (
        <TodosList
          todos={visibleTodos}
          notify={notify}
          notifyError={notifyError}
        />
      )}

      {visibleTodos?.length && (
        <p className="text-2xl font-semibold text-gray-800">
          No todos yet{":("}
        </p>
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
