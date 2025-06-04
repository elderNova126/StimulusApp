import { DiscoveryState } from '../../stores/features';

export const getNumberOfAppliedFilters = (discovery: DiscoveryState) => {
  // Remove 'variables' field so it won't be counted
  const {
    currentLocationIsCheck,
    variables,
    filterSearch,
    savedSearch,
    closeSearch,
    listName,
    count,
    indexList,
    locationsFilter,
    status,
    ...appliedFilters
  } = discovery;
  return (
    Object.values(appliedFilters).filter((element) => {
      if (Array.isArray(element)) {
        const cleanArray = element.filter((ele) => ele !== null && ele !== undefined);
        return cleanArray.length;
      } else if (typeof element === 'object') {
        return Object.values(element).some((element) => element);
      }
      return element;
    }).length + (currentLocationIsCheck ? 1 : 0)
  );
};
