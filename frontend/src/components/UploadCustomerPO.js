import React, { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from '../axiosConfig';

export default function UploadCustomerPO() {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('customerPO'); // Default for Customer PO
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      toast.error("Invalid file type! Only PDF, JPG, PNG allowed.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit!");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file ||  !docType) {
      toast.error("Please select file, and docType.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);

    try {
      setUploadStatus('uploading');
      const token = localStorage.getItem('docuwise_token');  // 🛡️ get token first
      //console.log("token >>>>>>>>... ", token)
      const response = await axiosInstance.post("/uploads", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,  // <<< THIS IS IMPORTANT
         },
         onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
         }
      });

      console.log(response.data);
      toast.success("File uploaded successfully!");
      setUploadStatus('success');
      setFile(null);
      setDocType('customerPO');

    } catch (error) {
      console.error(error);
      toast.error("Upload failed! See server logs.");
      setUploadStatus('error');
    }
  };

  return (
   <div className="main-content">
      <div className="container mt-5">
         <Toaster />
         <h3 className="text-center mb-4">Upload Customer PO</h3>
         <div className="card p-4">
         <div className="mb-3">
            <input type="file" className="form-control" onChange={handleFileChange} />
         </div>
         <div className="mb-3">
            <select className="form-control" value={docType} onChange={(e) => setDocType(e.target.value)}>
               <option value="customerPO">Customer PO</option>
               <option value="invoice">Invoice</option>
               <option value="coa">Certificate of Analysis (COA)</option>
            </select>
         </div>
         <button onClick={handleUpload} className="btn btn-primary w-100">
            Upload File
         </button>
         {uploadStatus === 'uploading' && (
            <div className="progress mt-3">
               <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
               {uploadProgress}%
               </div>
            </div>
         )}
         </div>
      </div>
   </div>
  );
}
