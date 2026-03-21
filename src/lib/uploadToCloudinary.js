// src/lib/uploadToCloudinary.js
// ─────────────────────────────────────────────────────────────
// Signed upload helper — gets signature from your API route
// then uploads directly to Cloudinary from the browser
// ─────────────────────────────────────────────────────────────

/**
 * Upload a file to Cloudinary using a signed upload
 * @param {File}   file      - The file object to upload
 * @param {string} empCode   - Employee code (used for folder/public_id)
 * @param {string} fileType  - 'PHOTO' | 'PAN' | 'AADHAAR'
 * @returns {Promise<string>} - Secure URL of the uploaded file
 */
export async function uploadToCloudinary(file, empCode, fileType) {
  // 1. Get signature from your API route
  const folder    = `employees/${empCode}`
  const public_id = `${fileType}_${empCode}`

  const sigRes = await fetch('/api/cloudinary-signature', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ folder, public_id }),
  })

  if (!sigRes.ok) {
    const err = await sigRes.json()
    throw new Error(err.error || 'Failed to get upload signature')
  }

  const { signature, timestamp, api_key, cloud_name } = await sigRes.json()

  // 2. Build FormData for Cloudinary
  const formData = new FormData()
  formData.append('file',       file)
  formData.append('api_key',    api_key)
  formData.append('timestamp',  timestamp)
  formData.append('signature',  signature)
  formData.append('folder',     folder)
  formData.append('public_id',  public_id)

  // 3. Upload directly to Cloudinary
  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
    { method: 'POST', body: formData }
  )

  const data = await uploadRes.json()

  if (!uploadRes.ok || data.error) {
    throw new Error(data.error?.message || 'Cloudinary upload failed')
  }

  return data.secure_url
}

/**
 * Validate file before upload
 * @param {File} file
 * @param {'image'|'document'|'any'} type
 * @returns {string|null} error message or null if valid
 */
export function validateFile(file, type = 'any') {
  if (!file) return 'No file selected'

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB

  if (file.size > MAX_SIZE) {
    return `File too large. Max size is 5MB (current: ${(file.size / 1024 / 1024).toFixed(1)}MB)`
  }

  if (type === 'image') {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      return 'Only JPG, PNG, or WEBP images are allowed'
    }
  }

  if (type === 'document') {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowed.includes(file.type)) {
      return 'Only PDF, JPG, or PNG files are allowed'
    }
  }

  return null // valid
}