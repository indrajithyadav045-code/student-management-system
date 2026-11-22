const STORAGE_KEY = 'eduadmin_students_data_v1';
const INITIALIZED_FLAG = 'eduadmin_storage_initialized_v1';

/**
 * Checks if localStorage is available and accessible in the current browser environment.
 * @returns {boolean}
 */
export const isLocalStorageAvailable = () => {
  try {
    const testKey = '__eduadmin_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Safely retrieves student records from LocalStorage.
 * Handles corrupted data, uninitialized storage, and avoids overwriting user deletions.
 * @param {Array} defaultData 
 * @returns {Array}
 */
export const getStoredStudents = (defaultData = []) => {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage is not available. Using in-memory fallback data.');
    return defaultData;
  }

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    const hasBeenInitialized = window.localStorage.getItem(INITIALIZED_FLAG);

    // First time ever opening app: seed with initial sample data and set initialized flag
    if (rawData === null && !hasBeenInitialized) {
      if (defaultData && defaultData.length > 0) {
        saveStoredStudents(defaultData);
      }
      try {
        window.localStorage.setItem(INITIALIZED_FLAG, 'true');
      } catch {
        // Ignore failure setting flag
      }
      return defaultData;
    }

    // If key exists but is null/empty string
    if (rawData === null || rawData.trim() === '') {
      return [];
    }

    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      return parsed;
    }

    console.warn('Stored student data was not a valid array. Falling back safely.');
    return defaultData;
  } catch (error) {
    console.error('Failed to parse students from LocalStorage (corrupted JSON):', error);
    // Return defaultData as safe fallback without crashing the app
    return defaultData;
  }
};

/**
 * Safely saves student records into LocalStorage.
 * Returns detailed status so the UI can notify the user if quota or permission errors occur.
 * @param {Array} students 
 * @returns {{ success: boolean, error?: string }}
 */
export const saveStoredStudents = (students) => {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: 'LocalStorage is unavailable or restricted in this browser session.'
    };
  }

  if (!Array.isArray(students)) {
    return {
      success: false,
      error: 'Cannot save invalid student records: expected an array.'
    };
  }

  try {
    const serialized = JSON.stringify(students);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    // Mark as initialized so empty arrays [] are preserved as valid user state
    window.localStorage.setItem(INITIALIZED_FLAG, 'true');
    return { success: true };
  } catch (error) {
    console.error('Failed to save students to LocalStorage:', error);
    let errorMessage = 'Failed to persist student records to storage.';
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      errorMessage = 'Storage quota exceeded. Please export or remove some records.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Resets student records to initial dataset.
 * @param {Array} initialData 
 * @returns {{ success: boolean, error?: string }}
 */
export const resetStoredStudents = (initialData = []) => {
  return saveStoredStudents(initialData);
};
