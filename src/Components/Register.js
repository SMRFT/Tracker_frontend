import React, { useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from './constant';
import Vector2 from './Images/Login-vector2.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaIdCard, FaEnvelope, FaLock, FaBriefcase, FaBuilding, FaUserTie } from 'react-icons/fa';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(91, 75, 138, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(91, 75, 138, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(91, 75, 138, 0);
  }
`;

// Styled Components
const RegisterContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${Vector2});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
    opacity: 0.8;
  }
`;

const RegisterCard = styled.div`
  position: relative;
  padding: 2.5rem;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  z-index: 1;
  color: #333;
  animation: ${fadeIn} 0.6s ease-out;
  transform-origin: center;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-weight: 600;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #5B4B8A, #6B728E);
    border-radius: 10px;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 10px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #4a5568;
  transition: color 0.3s ease;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 38px;
  color: #6B728E;
  transition: all 0.3s ease;
`;

const Input = styled.input`
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 100%;
  font-size: 1rem;
  background-color: white;
  color: #333;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #5B4B8A;
    box-shadow: 0 0 0 3px rgba(91, 75, 138, 0.2);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const Select = styled.select`
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 100%;
  font-size: 1rem;
  background-color: white;
  color: #333;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #5B4B8A;
    box-shadow: 0 0 0 3px rgba(91, 75, 138, 0.2);
  }
  
  option {
    padding: 10px;
  }
`;

const ErrorMessage = styled.div`
  color: #E53E3E;
  font-size: 0.85rem;
  margin-top: 5px;
  animation: ${fadeIn} 0.3s ease-in;
`;

const SuccessMessage = styled.div`
  color: #38A169;
  margin-bottom: 15px;
  text-align: center;
  padding: 10px;
  background-color: rgba(56, 161, 105, 0.1);
  border-radius: 8px;
  animation: ${fadeIn} 0.3s ease-in;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #5B4B8A, #6B728E);
  color: white;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 150px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(135deg, #4a3d71, #535565);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(91, 75, 138, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    animation: ${pulse} 0.3s;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0), 
      rgba(255, 255, 255, 0.2), 
      rgba(255, 255, 255, 0));
    animation: ${shimmer} 1.5s infinite;
  }
  
  &:disabled {
    background: #CBD5E0;
    cursor: not-allowed;
    
    &::before {
      animation: none;
    }
  }
`;

const LoginLink = styled(Link)`
  color: #5B4B8A;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    color: #6B728E;
    text-decoration: underline;
  }
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #4a5568;
`;

// Custom toast styling
const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 8px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .Toastify__toast--success {
    background: linear-gradient(135deg, #4CAF50, #388E3C);
  }
  
  .Toastify__toast--error {
    background: linear-gradient(135deg, #F44336, #D32F2F);
  }
  
  .Toastify__progress-bar {
    background: rgba(255, 255, 255, 0.7);
  }
`;

const PasswordRequirements = styled.ul`
  font-size: 0.8rem;
  color: #718096;
  margin-top: 5px;
  padding-left: 20px;
  
  li {
    margin-bottom: 2px;
  }
  
  li.valid {
    color: #38A169;
  }
  
  li.invalid {
    color: #E53E3E;
  }
`;

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [employeeDepartment, setEmployeeDepartment] = useState('');
    const [employeeDesignation, setEmployeeDesignation] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

    const navigate = useNavigate();

    // Password validation criteria
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const hasMinLength = password.length >= 8;

    const validatePassword = (pwd) => {
        return hasUpperCase && hasNumber && hasSpecialChar && hasMinLength;
    };

    // Custom toast configurations
    const toastConfig = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const errors = {};
        if (!employeeId) errors.employeeId = 'Employee ID is required.';
        if (!employeeName) errors.employeeName = 'Employee Name is required.';
        if (!role) errors.role = 'Employee Role is required.';
        if (!employeeDepartment) errors.employeeDepartment = 'Employee Department is required.';
        if (!employeeDesignation) errors.employeeDesignation = 'Employee Designation is required.';
        if (!email) errors.email = 'Email is required.';
        if (!email.includes('@')) errors.email = 'Please enter a valid email address.';
        if (!password) errors.password = 'Password is required.';
        if (!validatePassword(password)) errors.password = 'Password does not meet the requirements.';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        } else {
            setValidationErrors({});
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('employeeId', employeeId);
        formData.append('employeeName', employeeName);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('employeeDepartment', employeeDepartment);
        formData.append('employeeDesignation', employeeDesignation);

        try {
            const response = await axios.post('https://tracker.shinovadatabase.in/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setSuccess('Registration successful!');
            setError('');
            toast.success('✅ Registration successful! Redirecting to login...', toastConfig);

            // Navigate to login page after successful registration
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            setIsLoading(false);
            setError('Registration failed. Please try again.');
            setSuccess('');
            toast.error('❌ Registration failed. Please try again.', toastConfig);
        }
    };

    return (
        <RegisterContainer>
            <StyledToastContainer />
            
            <RegisterCard>
                <Title>Create Account</Title>
                
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}
                
                <StyledForm onSubmit={handleSubmit} autoComplete="off">
                    <Row>
                        <FormGroup>
                            <Label htmlFor="employeeId">Employee ID</Label>
                            <InputIcon>
                                <FaIdCard />
                            </InputIcon>
                            <Input
                                type="text"
                                id="employeeId"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                autoComplete="off"
                                name="employeeId"
                                placeholder="Enter employee ID"
                            />
                            {validationErrors.employeeId && <ErrorMessage>{validationErrors.employeeId}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="employeeName">Employee Name</Label>
                            <InputIcon>
                                <FaUser />
                            </InputIcon>
                            <Input
                                type="text"
                                id="employeeName"
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                                autoComplete="off"
                                name="employeeName"
                                placeholder="Enter full name"
                            />
                            {validationErrors.employeeName && <ErrorMessage>{validationErrors.employeeName}</ErrorMessage>}
                        </FormGroup>
                    </Row>

                    <Row>
                        <FormGroup>
                            <Label htmlFor="role">Role</Label>
                            <InputIcon>
                                <FaUserTie />
                            </InputIcon>
                            <Select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                autoComplete="off"
                                name="role"
                            >
                                <option value="">Select a role</option>
                                <option value="Admin">Admin</option>                   
                                <option value="HOD">Head of the Department</option>
                                <option value="Employee">Employee</option>
                            </Select>
                            {validationErrors.role && <ErrorMessage>{validationErrors.role}</ErrorMessage>}
                        </FormGroup>
                        
                        <FormGroup>
                            <Label htmlFor="employeeDepartment">Department</Label>
                            <InputIcon>
                                <FaBuilding />
                            </InputIcon>
                            <Select
                                id="employeeDepartment"
                                value={employeeDepartment}
                                onChange={(e) => setEmployeeDepartment(e.target.value)}
                                name="employeeDepartment"
                            >
                                <option value="">Select Department</option>
                                {DEPARTMENTS.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </Select>
                            {validationErrors.employeeDepartment && <ErrorMessage>{validationErrors.employeeDepartment}</ErrorMessage>}
                        </FormGroup>
                    </Row>

                    <Row>
                        <FormGroup>
                            <Label htmlFor="employeeDesignation">Designation</Label>
                            <InputIcon>
                                <FaBriefcase />
                            </InputIcon>
                            <Input
                                type="text"
                                id="employeeDesignation"
                                value={employeeDesignation}
                                onChange={(e) => setEmployeeDesignation(e.target.value)}
                                autoComplete="off"
                                name="employeeDesignation"
                                placeholder="Enter designation"
                            />
                            {validationErrors.employeeDesignation && <ErrorMessage>{validationErrors.employeeDesignation}</ErrorMessage>}
                        </FormGroup>
                        
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <InputIcon>
                                <FaEnvelope />
                            </InputIcon>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                                name="email"
                                placeholder="Enter email address"
                            />
                            {validationErrors.email && <ErrorMessage>{validationErrors.email}</ErrorMessage>}
                        </FormGroup>
                    </Row>

                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <InputIcon>
                            <FaLock />
                        </InputIcon>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setShowPasswordRequirements(true)}
                            onBlur={() => setShowPasswordRequirements(false)}
                            autoComplete="new-password"
                            name="password"
                            placeholder="Create a secure password"
                        />
                        {validationErrors.password && <ErrorMessage>{validationErrors.password}</ErrorMessage>}
                        
                        {(showPasswordRequirements || password) && (
                            <PasswordRequirements>
                                <li className={hasMinLength ? 'valid' : 'invalid'}>
                                    At least 8 characters
                                </li>
                                <li className={hasUpperCase ? 'valid' : 'invalid'}>
                                    At least 1 uppercase letter
                                </li>
                                <li className={hasNumber ? 'valid' : 'invalid'}>
                                    At least 1 number
                                </li>
                                <li className={hasSpecialChar ? 'valid' : 'invalid'}>
                                    At least 1 special character (@$!%*?&)
                                </li>
                            </PasswordRequirements>
                        )}
                    </FormGroup>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <SubmitButton type="submit" disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </SubmitButton>
                    </div>
                    
                    <FooterText>
                        Already have an account? <LoginLink to='/'>Sign in</LoginLink>
                    </FooterText>
                </StyledForm>
            </RegisterCard>
        </RegisterContainer>
    );
};

export default Register;