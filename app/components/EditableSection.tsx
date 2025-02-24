"use client";
import { useState } from "react";
import { useEdit } from "./EditContext";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";

interface EditableSectionProps {
  title: string;
  onSave: () => void; 
  children: React.ReactNode;
  editForm: (isEditing: boolean) => React.ReactNode; // ✅ Now takes isEditing as an argument
}

const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  onSave,
  children,
  editForm,
}) => {
  const { isEditMode, isAuthenticated } = useEdit();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      await onSave();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  
  return (
    <div className="relative">
      {isEditMode && isAuthenticated && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-blue-600"
        >
          <PencilIcon size={16} />
        </button>
      )}

      {isEditing ? (
        <div className="border-2 border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <XIcon size={16} />
              </button>
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <CheckIcon size={16} />
              </button>
            </div>
          </div>
          {editForm(isEditing)} {/*Pass isEditing to editForm */}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default EditableSection;
