import { useReducer } from "react";

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
};

const PAGE_CHANGED = "PAGE_CHANGED";
const PAGE_SIZE_CHANGED = "PAGE_SIZE_CHANGED";

function reducer(state, { type, payload }) {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      };
    case PAGE_SIZE_CHANGED:
      return {
        ...state,
        queryPageSize: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
}

export default function usePageReducer() {
  return useReducer(reducer, initialState);
}

export { PAGE_CHANGED, PAGE_SIZE_CHANGED };
