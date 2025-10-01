// lib/verifyCode.js
export function generate6DigitCode() {
  // تضمین ۶ رقمی با پرکردن صفرهای ابتدای عدد
  return String(Math.floor(100000 + Math.random() * 900000));
}
export function isCodeValid(code) {
  // بررسی اینکه کد ۶ رقمی باشد
  return /^\d{6}$/.test(code);
}