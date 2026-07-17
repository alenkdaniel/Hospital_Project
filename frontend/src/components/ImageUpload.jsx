import { useState } from "react";

import { X, UploadCloud } from "lucide-react";

// =====================================
// REUSABLE IMAGE UPLOAD COMPONENT
// =====================================

const ImageUpload = ({
  label = "Upload Images",

  multiple = true,

  maxFiles = 5,

  onChange,
}) => {
  const [preview, setPreview] = useState([]);

  // =====================================
  // HANDLE FILE SELECT
  // =====================================

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);

      return;
    }

    // SEND FILES TO PARENT

    onChange(multiple ? files : files[0]);

    // CREATE PREVIEW

    const previews = files.map((file) => ({
      file,

      url: URL.createObjectURL(file),
    }));

    setPreview(previews);
  };

  // =====================================
  // REMOVE IMAGE
  // =====================================

  const removeImage = (index) => {
    const updated = preview.filter((_, i) => i !== index);

    setPreview(updated);

    const updatedFiles = updated.map((item) => item.file);

    onChange(multiple ? updatedFiles : null);
  };

  return (
    <div
      className="
w-full
space-y-5
"
    >
      {/* TITLE */}

      <label
        className="
block
font-semibold
text-gray-700
"
      >
        {label}
      </label>

      {/* UPLOAD BOX */}

      <label
        className="
border-2
border-dashed
border-blue-300
rounded-3xl
p-10
flex
flex-col
items-center
justify-center
cursor-pointer
bg-blue-50
hover:bg-blue-100
transition
"
      >
        <UploadCloud
          size={50}
          className="
text-blue-600
"
        />

        <p
          className="
mt-4
font-semibold
text-gray-700
"
        >
          Click to upload
        </p>

        <p
          className="
text-sm
text-gray-500
mt-1
"
        >
          PNG, JPG, WEBP
        </p>

        <input
          type="file"
          hidden
          accept="
image/png,
image/jpeg,
image/jpg,
image/webp
"
          multiple={multiple}
          onChange={handleFileChange}
        />
      </label>

      {/* PREVIEW */}

      {preview.length > 0 && (
        <div
          className="
grid
grid-cols-2
md:grid-cols-4
gap-5
"
        >
          {preview.map((item, index) => (
            <div
              key={index}
              className="
relative
rounded-2xl
overflow-hidden
shadow-lg
"
            >
              <img
                src={item.url}
                alt="preview"
                className="
h-36
w-full
object-cover
"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="
absolute
top-2
right-2
bg-red-600
text-white
rounded-full
p-1
"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
