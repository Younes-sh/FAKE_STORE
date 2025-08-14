import { useState } from 'react';
import Style from './UploadImage.module.css';

export default function UploadImage({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useState(null); // Ref برای ریست کردن input فایل

  const handleUpload = async () => {
    if (!file) return;
    
    // اعتبارسنجی فایل
    if (!file.type.startsWith('image/')) {
      setError('فقط فایل‌های تصویری مجاز هستند');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم فایل باید کمتر از 5MB باشد');
      return;
    }

    setBusy(true); 
    setError('');
    setProgress(0);

    try {
      // 1) از سرور امضا بگیر
      const sigRes = await fetch('/api/cloudinary/sign', { method: 'POST' });
      if (!sigRes.ok) throw new Error('خطا در دریافت امضا');
      
      const { timestamp, folder, signature, apiKey, cloudName } = await sigRes.json();

      // 2) بفرست به Cloudinary با نمایش پیشرفت
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', apiKey);
      form.append('timestamp', timestamp);
      form.append('folder', folder);
      form.append('signature', signature);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded * 100) / e.total));
        }
      };

      const promise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.responseText));
          }
        };
        xhr.onerror = () => reject(new Error('Error uploading image'));
      });

      xhr.send(form);
      const data = await promise;

      if (data.error) throw new Error(data.error.message);
      
      // فراخوانی callback با URL تصویر آپلود شده
      onUploaded?.(data.secure_url, data.public_id);
      
      // ریست کردن فایل پس از آپلود موفق
      resetFileInput();

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Error uploading image');
    } finally {
      setBusy(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setError('');
    setFile(selectedFile);
  };

  const resetFileInput = () => {
    setFile(null);
    // ریست کردن مقدار input فایل
    const fileInput = document.getElementById('upload-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className={Style.uploadContainer}>
      <div className={Style.uploadWrapper}>
        <div className={Style.fileInputContainer}>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className={Style.fileInput}
            id="upload-input"
            disabled={busy}
            ref={fileInputRef}
          />
          <label htmlFor="upload-input" className={Style.fileInputLabel}>
            <span className={Style.fileInputText}>
              {file ? file.name : 'Select file'}
            </span>
            <span className={Style.fileInputButton}>
              {file ? 'Change file' : 'Choose file'}
            </span>
          </label>
        </div>

        <button 
          type="button"
          onClick={handleUpload}
          disabled={!file || busy}
          className={Style.uploadButton}
        >
          {busy ? (
            <span className={Style.uploadButtonContent}>
              <span className={Style.spinner}></span>
              Uploading...
            </span>
          ) : (
            'Upload Image'
          )}
        </button>
      </div>

      {file && (
        <div className={Style.fileInfo}>
          <div className={Style.fileDetails}>
            <span className={Style.fileName}>{file.name}</span>
            <span className={Style.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          {!busy && (
            <button 
              type="button"
              onClick={resetFileInput}
              className={Style.removeButton}
            >
              Delete file
            </button>
          )}
        </div>
      )}

      {busy && (
        <div className={Style.progressContainer}>
          <div className={Style.progressBar}>
            <div 
              className={Style.progressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className={Style.progressText}>{progress}%</span>
        </div>
      )}

      {error && <div className={Style.errorMessage}>{error}</div>}
    </div>
  );
}