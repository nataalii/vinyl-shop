'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from './FormInput';

interface FormValues {
  name: string;
  surname: string;
  email: string;
  address: string;
  birthdate: string;
  password: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    surname: '',
    email: '',
    address: '',
    birthdate: '2023-01-01',
    password: '',
  });

  const handleSubmit = async function (
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      return false;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (res.ok) {
        setError('');
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <form className='group space-y-6' onSubmit={handleSubmit} noValidate>
      <FormInput
        label='Name'
        type='text'
        id='name'
        placeholder='John'
        minLength={3}
        value={formValues.name}
        onChange={(e) =>
          setFormValues((prevFormValues) => ({
            ...prevFormValues,
            name: e.target.value,
          }))
        }
        error='Name Should be min 3 characters'
      />

      <FormInput
        label='Surname'
        type='text'
        id='surname'
        placeholder='Doe'
        minLength={3}
        value={formValues.surname}
        onChange={(e) =>
          setFormValues((prevFormValues) => ({
            ...prevFormValues,
            surname: e.target.value,
          }))
        }
        error='Surname Should be min 3 characters'
      />
      <FormInput
        label='E-mail address '
        type='email'
        id='email'
        placeholder='johnDoe@exmple.com'
        value={formValues.email}
        onChange={(e) =>
          setFormValues((prevFormValues) => ({
            ...prevFormValues,
            email: e.target.value,
          }))
        }
        error='Please provide a valid email address.'
      />
      <FormInput
        label='Address'
        type='text'
        id='address'
        placeholder='123 Main St, 12345 New York, United States'
        value={formValues.address}
        onChange={(e) =>
          setFormValues((prevFormValues) => ({
            ...prevFormValues,
            address: e.target.value,
          }))
        }
        error='Please provide a valid address.'
      />

      <FormInput
        label='birthdate '
        type='date'
        id='birthdate'
        value={formValues.birthdate}
        onChange={(e) =>
          setFormValues((prevFormValues) => ({
            ...prevFormValues,
            birthdate: e.target.value,
          }))
        }
      />

      <FormInput
        label='Password'
        type='password'
        id='password'
        placeholder=''
        value={formValues.password}
        onChange={(e) =>
          setFormValues((prevFormValues) => ({
            ...prevFormValues,
            password: e.target.value,
          }))
        }
        error='Please provide a valid password.'
      />
      {error && (
        <div className='mt-2 rounded-md border-0 bg-red-500 bg-opacity-30 px-3 py-1.5 ring-1 ring-inset ring-red-500'>
          <p className='text-sm text-gray-900'>{error}</p>
        </div>
      )}

      <div>
        <button
          type='submit'
          className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group-invalid:pointer-events-none group-invalid:opacity-30'
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}
