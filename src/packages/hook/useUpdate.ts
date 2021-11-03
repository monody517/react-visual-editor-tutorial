import {useMemo, useState} from "react";


/**
 * 强制刷新页面
 * @param
 * @returns
 */
export function useUpdate() {
  const [count, setCount] = useState(0)
  return useMemo(() => ({
    froceUpdate: () => setCount(count + 1)
  }), [count])
}

