import { createContext, useReducer } from 'react'

export const TodoContext = createContext(null)

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALL':
      return action.payload
    case 'ADD':
      return [action.payload, ...state]
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    case 'UPDATE':
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.updates }
          : todo
      )
    case 'DELETE':
      return state.filter(todo => todo.id !== action.payload)
    default:
      return state;
  }
}

export function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, [])

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  )
}
