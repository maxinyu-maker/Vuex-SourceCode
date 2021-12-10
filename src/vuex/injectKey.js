import { inject } from 'vue'
export const storeKey = 'store';

export function useStore(injectKey = null) { //vue内部已经将这个些api导出来了
    return inject(injectKey !== null ? injectKey : storeKey)
}