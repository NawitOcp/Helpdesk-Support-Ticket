import { useSearchParams } from 'react-router-dom';

/**
 * Custom hook for managing query string state
 * Simplifies reading and updating URL query parameters
 * @returns {Object} Query parameter utilities
 */
const useQueryStringState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  /**
   * Get single query parameter value
   */
  const getParam = (key, defaultValue = '') => {
    return searchParams.get(key) || defaultValue;
  };
  
  /**
   * Get all values for a query parameter (for multi-value params)
   */
  const getParamAll = (key) => {
    return searchParams.getAll(key);
  };
  
  /**
   * Set single query parameter
   */
  const setParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === null || value === undefined || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    setSearchParams(newParams);
  };
  
  /**
   * Set multiple query parameters at once
   */
  const setParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array values (for multi-select)
        newParams.delete(key);
        value.forEach(v => newParams.append(key, v));
      } else if (value === null || value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    setSearchParams(newParams);
  };
  
  /**
   * Remove query parameter
   */
  const removeParam = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };
  
  /**
   * Clear all query parameters
   */
  const clearParams = () => {
    setSearchParams(new URLSearchParams());
  };
  
  return {
    getParam,
    getParamAll,
    setParam,
    setParams,
    removeParam,
    clearParams,
    searchParams
  };
};

export default useQueryStringState;