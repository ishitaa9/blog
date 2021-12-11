import React from "react";
import { useState, useEffect} from 'react';
import {signup, isAuth, preSignup} from '../../actions/auth';
import Router from 'next/router';
import { validationResult } from "express-validator";
import Link from 'next/link';

const SignupComponent = () => {
    const[values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

    const { name, email, password, showForm } = values;

    useEffect(() => {
        isAuth() && Router.push(`/`);
    },[]);

    const handleSubmit = e => {
        e.preventDefault()
        // if(values.password.length <= 6){
        //     setValues({...values, error: 'Password must be 6 characters or more'});
        // }
        if(!values.error){
            //console.table({name, email, password, error, loading, message, showForm})
            setValues({...values, loading:true, error: ''})
            const user = { name, email, password }

            signup(user).then(data => {
                console.log('got here 8439', data);
                if (data && data.errors) {
                    setValues({...values, error: data.errors, loading: false})
                } else {
                    setValues({
                        ...values,
                        name:'',
                        email: '',
                        password:'',
                        error:'',
                        loading: false,
                        message: data && data.message ? data.message : '',
                        showForm: false
                    });
                }
            });
        }
    };

    const handleChange = name => e => {
        setValues({...values, error: false, [name]: e.target.value});
    };

    const showLoading = () => (values.loading ? <div className="alert alert-info">Loading</div> : '')
    const showError = () => (values.error ? <div className="alert alert-danger">{values.error}</div> : '')
    const showMessage = () => (values.message ? <div className="alert alert-info">{values.message}</div>: '')



    const signupForm = () => {

        return (

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                    value ={name}
                    onChange={handleChange('name')}
                    type="text"
                    className="form-control"
                    placeholder="Type your name"/>
                </div>

                <div className="form-group">
                    <input
                    value ={email}
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    placeholder="Type your email"/>
                </div>

                <div className="form-group">
                    <input
                    value ={password}
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    placeholder="Type your password"/>
                </div>

                <div>
                    <button className="btn btn-primary">Signup</button>
                </div>
            </form>
        )
    }

    return (
        <React.Fragment>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && signupForm()}
            <br />
            <Link href="/auth/password/forgot">
                <a className="btn btn-outline-danger btn-small">Forgot password</a>
            </Link>
        </React.Fragment>
    )
}

export default SignupComponent;
