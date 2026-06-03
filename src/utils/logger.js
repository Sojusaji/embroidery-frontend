
export const logError = (context, error) => {
  if (import.meta.env.DEV) { 
    console.error(`[Error Context: ${context}] ->`, error.message || error);
  } else {
  }
};