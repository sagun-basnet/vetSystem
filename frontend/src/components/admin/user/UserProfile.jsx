import React, { useContext } from 'react'
import { AuthContext } from '../../../context/authContext'

const UserProfile = () => {
  const {currentUser} = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {currentUser.name}</p>
      <p>Email: {currentUser.email}</p>
      <p>Phone:{currentUser.phone}</p>
      <p>Address:{currentUser.address}</p>
    </div>
  )
}

export default UserProfile