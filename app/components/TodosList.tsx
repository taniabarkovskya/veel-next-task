"use client";
import React, { useState } from "react";
import { Id } from "react-toastify";
import { Todo } from "../types/Todo";
import TodoComponent from "./TodoComponent";

type Props = {
  todos: Todo[] | undefined;
  notify: (text: string) => Id;
  notifyError: (text: string) => Id;
};

const TodosList: React.FC<Props> = (props) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const { todos, notify, notifyError } = props;

  return (
    <>
      <ul className="w-full">
        {todos?.map((todo) => (
          <TodoComponent
            key={todo.id}
            todo={todo}
            editingTodoId={editingTodoId}
            setEditingTodoId={setEditingTodoId}
            notify={notify}
            notifyError={notifyError}
          />
        ))}
      </ul>
    </>
  );
};

export default TodosList;
