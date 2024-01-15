import React from 'react';

interface FormInputProps {
  label: string;
  type: string;
  id: string;
  placeholder?: string;
  value: string;
  minLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  id,
  placeholder,
  value,
  onChange,
  error,
  minLength,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={id}
        placeholder={placeholder}
        required
        minLength={minLength}
        className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
        value={value}
        onChange={onChange}
      />
      <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
        {error}
      </p>
    </div>
  );
};

export default FormInput;
