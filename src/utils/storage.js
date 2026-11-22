const STORAGE_KEY = 'eduadmin_students_data_v1';

/**
 * Safely retrieves student records from LocalStorage.
 * Falls back to defaultData if storage is empty or contains malformed JSON.
 * @param {Array} defaultData 
 * @returns {Array}
 */
export const getStoredStudents = (defaultData = []) => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // Save default data initially if nothing exists
      if (defaultData && defaultData.length > 0) {
        saveStoredStudents(defaultData);
      }
      return defaultData;
    }
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    console.warn('LocalStorage data was not an array. Resetting to fallback.');
    return defaultData;
  } catch (error) {
    console.error('Failed to read students from LocalStorage:', error);
    return defaultData;
  }
};

/**
 * Safely saves student records into LocalStorage.
 * @param {Array} students 
 * @returns {boolean}
 */
export const saveStoredStudents = (students) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return true;
  } catch (error) {
    console.error('Failed to save students to LocalStorage:', error);
    return false;
  }
};

/**
 * Clears student records and resets to initial dataset.
 * @param {Array} initialData 
 */
export const resetStoredStudents = (initialData = []) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return true;
  } catch (error) {
    console.error('Failed to reset students in LocalStorage:', error);
    return false;
  }
};
