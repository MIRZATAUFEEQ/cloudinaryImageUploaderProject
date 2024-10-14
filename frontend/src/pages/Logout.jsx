// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Logout = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post('http://localhost:3000/api/user/logout', {}, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       localStorage.removeItem('token');
//       alert('Logged out successfully');
//       navigate('/');  // Redirect to login after logout
//     } catch (error) {
//       console.error('Error logging out', error);
//     }
//   };

//   return (
//     <button onClick={handleLogout}>Logout</button>
//   );
// };

// export default Logout;
