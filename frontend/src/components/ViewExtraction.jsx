import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // ✅ Import this
import axiosInstance from '../axiosConfig';

const ViewExtraction = ({  currentUser }) => {
    const { uploadId } = useParams(); // ✅ This will extract ID from URL
    const [upload, setUpload] = useState(null);
    const [fields, setFields] = useState({});
    const [originalFields, setOriginalFields] = useState({});
    const [errors, setErrors] = useState([]);
    const [saving, setSaving] = useState(false);
    

    useEffect(() => {
        if (uploadId) fetchData();
    }, [uploadId]);

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get(`/extractions/${uploadId}`);
            setUpload(res.data.upload);
            setFields({ ...res.data.extraction.extractedData });
            setOriginalFields({ ...res.data.extraction.extractedData });
            setErrors(res.data.extraction.validationErrors || []);
        } catch (err) {
        console.error(err);
        }
    };

    const handleChange = (field, value) => {
        setFields(prev => ({ ...prev, [field]: value }));
    };

  const handleSaveAndValidate = async () => {
    setSaving(true);
    try {
      const corrections = Object.keys(fields).map(key => ({
        fieldName: key,
        oldValue: originalFields[key] || '',
        newValue: fields[key]
      }));

      const res = await axiosInstance.post(`/extractions/correct/${uploadId}`, {
        corrections,
        correctedBy: currentUser || 'admin',
      });

      alert('Corrections saved and revalidated!');
      setErrors(res.data.validationErrors || []);
    } catch (err) {
      console.error('Save error', err);
      alert('Error saving corrections');
    }
    setSaving(false);
  };

  if (!upload || !fields) return <p className="p-4">Loading...</p>;

  return (
    <div className="container-fluid mt-3">
  <div className="row">
    {/* Left Panel: Uploaded Document */}
    <div className="col-md-6 mb-3">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">Uploaded Document</h4>
          <iframe
            src={`http://localhost:5000/uploads/${upload.filename}`}
            title="Document Viewer"
            className="w-100"
            style={{ height: '80vh', border: '1px solid #ddd', borderRadius: '8px' }}
          ></iframe>
        </div>
      </div>
    </div>

    {/* Right Panel: Extracted Fields */}
    <div className="col-md-6 mb-3">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h4 className="card-title mb-3">Correct Extracted Fields</h4>

          <div className="overflow-auto" style={{ maxHeight: '65vh' }}>
            {Object.entries(fields).map(([key, value]) => (
              <div className="mb-3" key={key}>
                <label className="form-label fw-bold">{key}</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors?.some(err => err.includes(key)) ? 'is-invalid' : ''
                  }`}
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          {errors?.length > 0 && (
            <div className="alert alert-danger mt-3">
              <strong>Validation Errors:</strong>
              <ul className="mb-0 mt-2 ps-3">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleSaveAndValidate}
            className="btn btn-primary mt-4 align-self-start"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save & Revalidate'}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default ViewExtraction;
