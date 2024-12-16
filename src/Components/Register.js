import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from './constant'; // Import the departments
import Image1 from './Images/Login-Background.jpg';
import Image2 from './Images/Login-background2.jpg';
import Vector2 from './Images/Login-vector2.jpg';
const RegisterContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; // Ensure it covers the full viewport height
  // background-image: url(${Image2});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1300px; // Adjust width as needed
    height: 100%;
    background-image: url(${Vector2});
    background-size: contain;
    background-repeat: no-repeat;

    z-index: 0; // Behind the form container
  }

 
`;


const RegisterCard = styled.div`
  position: absolute; // Position relative to the parent (LoginWrapper)
  Right: 100px; // Adjust the left position as needed
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(12px); // Apply blur effect
  background-color:#DDFCFF; // Semi-transparent background with more opacity
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  z-index: 1; // Ensure the form is above the background and vector images
  color: Black; // White text color for better contrast
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: black;
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
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  margin-bottom: 2px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: none;
  border-radius: 5px;
  width: 100%;
  font-size: 1rem;


`;

const Select = styled.select`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  width: 100%;
  font-size: 1rem;
  &:focus {
    outline: none;
    background-color: #55597A; // Darken the background color on focus
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-bottom: 10px;
  text-align: center;
`;

const SubmitButton = styled.button`
  background-color: #6B728E;
  color: white;
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  &:hover {
    background-color:#5B4B8A;
  }
`;

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [employeeDepartment, setEmployeeDepartment] = useState('');
    const [employeeDesignation, setEmployeeDesignation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate(); // Initialize useNavigate

    const validatePassword = (pwd) => {
        const passwordCriteria = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordCriteria.test(pwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const errors = {};
        if (!employeeId) errors.employeeId = 'Employee ID is required.';
        if (!employeeName) errors.employeeName = 'Employee Name is required.';
        if (!employeeDepartment) errors.employeeDepartment = 'Employee Department is required.';
        if (!employeeDesignation) errors.employeeDesignation = 'Employee Designation is required.';
        if (!email) errors.email = 'Email is required.';
        if (!password) errors.password = 'Password is required.';
        if (!validatePassword(password)) errors.password = 'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        } else {
            setValidationErrors({});
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('employeeId', employeeId);
        formData.append('employeeName', employeeName);
        formData.append('password', password);
        formData.append('employeeDepartment', employeeDepartment);
        formData.append('employeeDesignation', employeeDesignation);

        try {
            const response = await axios.post('http://127.0.0.1:8000/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('Registration successful!');
            setError('');

            // Navigate to login page after successful registration
            setTimeout(() => {
                navigate('/');
            }, 1000); // Redirect after 2 seconds
        } catch (error) {
            setError('Registration failed. Please try again.');
            setSuccess('');
        }
    };

    return (
        <RegisterContainer>
            <RegisterCard>
                <Title>Register</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}
                <StyledForm onSubmit={handleSubmit} autoComplete="off">
                    <Row>
                        <FormGroup>
                            <Label>Employee ID</Label>
                            <Input
                                type="text"
                                className={validationErrors.employeeId ? 'is-invalid' : ''}
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                autoComplete="off"
                                name="employeeId"
                            />
                            {validationErrors.employeeId && <ErrorMessage>{validationErrors.employeeId}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Employee Name</Label>
                            <Input
                                type="text"
                                className={validationErrors.employeeName ? 'is-invalid' : ''}
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                                autoComplete="off"
                                name="employeeName"
                            />
                            {validationErrors.employeeName && <ErrorMessage>{validationErrors.employeeName}</ErrorMessage>}
                        </FormGroup>
                    </Row>

                    <Row>
                        <FormGroup>
                            <Label>Employee Department</Label>
                            <Select
                                className={validationErrors.employeeDepartment ? 'is-invalid' : ''}
                                value={employeeDepartment}
                                onChange={(e) => setEmployeeDepartment(e.target.value)}
                                name="employeeDepartment"
                            >
                                <option value="" style={{textAlign: 'center'}} >Select Department</option>
                                {DEPARTMENTS.map((dept) => (
                                    <option style={{textAlign: 'center'}} key={dept} value={dept}>{dept}</option>
                                ))}
                            </Select>
                            {validationErrors.employeeDepartment && <ErrorMessage>{validationErrors.employeeDepartment}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Designation</Label>
                            <Input
                                type="text"
                                className={validationErrors.employeeDesignation ? 'is-invalid' : ''}
                                value={employeeDesignation}
                                onChange={(e) => setEmployeeDesignation(e.target.value)}
                                autoComplete="off"
                                name="employeeDesignation"
                            />
                            {validationErrors.employeeDesignation && <ErrorMessage>{validationErrors.employeeDesignation}</ErrorMessage>}
                        </FormGroup>
                    </Row>

                    <FormGroup>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            className={validationErrors.email ? 'is-invalid' : ''}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            name="email"
                        />
                        {validationErrors.email && <ErrorMessage>{validationErrors.email}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            className={validationErrors.password ? 'is-invalid' : ''}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            name="password"
                        />
                        {validationErrors.password && <ErrorMessage>{validationErrors.password}</ErrorMessage>}
                    </FormGroup>

                    <center>
                        <SubmitButton type="submit">Register</SubmitButton>
                    </center>
                    <br/>
                    <center>if already registered please, <Link to='/'>Sign in</Link></center>
                   
                </StyledForm>
            </RegisterCard>
        </RegisterContainer>
    );
};

export default Register;
