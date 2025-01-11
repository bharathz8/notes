// AuthForm.tsx
import React, { useState } from "react";

// Define the form field structure
interface FormField {
  name: string;
  type: string;
  placeholder: string;
}

// Make AuthFormProps generic to accept specific form data types
interface AuthFormProps<T> {
  title: string;
  tagLine: string;
  buttonText: string;
  fields: FormField[];
  onSubmit: (data: T) => void | Promise<void>;
  redirectText?: string;
  redirectLink?: string;
  redirectUrl?: string;
}

const AuthForm = <T extends { [key: string]: string }>({
  title,
  tagLine,
  buttonText,
  fields,
  onSubmit,
  redirectText,
  redirectLink,
  redirectUrl,
}: AuthFormProps<T>) => {
  const [formData, setFormData] = useState<T>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {} as T)
  );

  const [fieldTouched, setFieldTouched] = useState<{ [key: string]: boolean }>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: false }), {})
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value } as T));
  };

  const handleFocus = (name: string) => {
    setFieldTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name: string) => {
    if (!formData[name]) {
      setFieldTouched(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex items-center justify-left min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-2">{title}</h1>
        <h1 className="font-semibold text-center text-gray-400 mb-6">{tagLine}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.name} className="relative border border-gray-300 rounded-lg">
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                placeholder=" "
                value={formData[field.name]}
                onChange={handleChange}
                onFocus={() => handleFocus(field.name)}
                onBlur={() => handleBlur(field.name)}
                className="peer w-full px-4 py-3 text-sm text-gray-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg"
              />
              <legend
                className={`absolute text-sm text-gray-400 left-4 top-2 -translate-y-1/2 bg-white px-1 transition-all ${
                  fieldTouched[field.name] || formData[field.name]
                    ? "top-0 scale-75 text-indigo-500"
                    : "peer-placeholder-shown:top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400"
                }`}
              >
                {field.placeholder}
              </legend>
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:bg-gradient-to-l shadow-md hover:shadow-lg transition-all"
          >
            {buttonText}
          </button>
        </form>
        {redirectText && redirectLink && redirectUrl && (
          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">{redirectText}</p>
            <a
              href={redirectUrl}
              className="text-indigo-500 hover:underline font-medium"
            >
              {redirectLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;