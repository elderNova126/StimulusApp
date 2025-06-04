type CallBackfunction = (...args: any[]) => void;

export const debounce = (func: CallBackfunction, timeout = 400) => {
  let timer: any;

  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
};
