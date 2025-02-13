import React, { Dispatch, SetStateAction } from 'react'
import { FilterType } from '../types/FilterType';
import cn from 'classnames';

type Props = {
  status: FilterType;
  setStatus: Dispatch<SetStateAction<FilterType>>;
} 

const TodoFilters: React.FC<Props> = (props) => {
  const { status, setStatus } = props;

  return (
    <nav className="flex gap-2">
        {Object.values(FilterType).map(filter => (
          <a
            key={filter}
            href={`#/${filter !== FilterType.All && filter.toLowerCase()}`}
            className={cn("text-md md:text-xl px-2 md:px-4 py-1 border border-gray-800 text-gray-800 rounded-xl transition duration-300 ease-in-out hover:bg-gray-800 hover:text-white", { "bg-gray-800 text-white": status === filter })}
            onClick={() => {
              setStatus(filter);
            }}
          >
            {filter}
          </a>
        ))}
      </nav>
  )
}

export default TodoFilters