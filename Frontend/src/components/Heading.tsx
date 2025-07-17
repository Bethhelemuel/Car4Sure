import React from 'react'
import { useAuth } from '../contexts/AuthContext';

interface HeadingProps {
  name: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ name, description }) => {
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="bg-white p-3 rounded-lg shadow mb-6 flex items-center justify-between">
      <div>
        <h1 className="mb-1 text-base font-extrabold text-gray-900 dark:text-white md:text-lg lg:text-xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">{name}</span>
        </h1>
        <p className="text-xs font-normal text-gray-500 lg:text-sm dark:text-gray-400">{description}</p>
      </div>
      {user && (
        <div className="flex items-center space-x-2 mr-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            {initial}
          </div>
          <span className="font-semibold text-gray-700 mr-5">{user.name}</span>
        </div>
      )}
    </div>
  )
}
