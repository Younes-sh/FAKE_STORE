// utils/fetcher.js
export const fetcher = async (path, options = {}) => {
  let baseUrl = '';

  // اگر در مرورگر هستیم
  if (typeof window !== 'undefined') {
    baseUrl = '';
  } else {
    // اگر در سرور هستیم
    baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  const res = await fetch(`${baseUrl}${path}`, options);

  if (!res.ok) {
    throw new Error(`Fetch failed with status: ${res.status}`);
  }

  return res.json();
};
