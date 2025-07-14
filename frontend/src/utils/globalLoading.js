
let externalSetNavigationLoading;

export const registerSetNavigationLoading = (fn) => {
  externalSetNavigationLoading = fn;
};

export const setGlobalNavigationLoading = (value) => {
  if (externalSetNavigationLoading) {
    externalSetNavigationLoading(value);
  }
};
