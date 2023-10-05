import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const ProfileComponent = () => {

  const navigate = useNavigate()

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([])
  const [notificationIsSubmitted, setNotificationIsSubmitted] = useState(false);

  const schema = Yup.object().shape({
    text: Yup.string().required()
  });

  const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm({
    mode: 'all',
    resolver: yupResolver(schema)
  });

  const handleError = async (error, code) => {
    toast.error(code || JSON.stringify(error));
    await authService.logout(); 
    navigate('/');
  }

  const handleValidSubmit = async (data) => {
    setNotificationIsSubmitted(true)
    try {
      const result = await authService.createNotification(data);
      if (result.data) {
        fetchNotifications();
      } else {
        throw new Error("Token expired")
      }
    } catch (error) {
      handleError(error)
    }
    setNotificationIsSubmitted(false)
  }

  const handleDeleteNotification = async (id) => {
    try {
      const result = await authService.deleteNotification({id});
      console.log(result)
      if (result.data.status !== 401) {
        toast.success('Notification deleted!');
        fetchNotifications();
      } else {
        throw new Error("Token expired")
      }
    } catch (error) {
      handleError(error, 401)
    }
  }

  const fetchProfile = async () => {
    const result = await authService.profile();
    setUser(result)
  }

  const fetchNotifications = async () => {
    authService.getNotifications().then(result => {
      console.log(result)
      if(result.data.total === undefined) {
        throw new Error("Token expired")
      } else {
        setNotifications(result.data.list)
      }
    }).catch(handleError, 401)
  }

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, []);

  return (
    <>
      <h4>Profile</h4>
      <div className="row">
        <div className="col-6 offset-3">
          <ul className="list-group">
            <li className="list-group-item"><span className="fw-bold">Id</span> - {user?.id}</li>
            <li className="list-group-item"><span className="fw-bold">Name</span> - {user?.name}</li>
            <li className="list-group-item"><span className="fw-bold">Email</span> - {user?.login}</li>
          </ul>
        </div>
      </div>
      <hr className="hr" />
      <h4>New notification</h4>
      <form onSubmit={handleSubmit(handleValidSubmit)}>
        <div className="mb-3">
          <label htmlFor="text" className="form-label">Notification text</label>
          <input type="text" className="form-control w-25" id="text" {...register('text')} />
          <div className="form-text text-danger">
            {errors.text && <p>{errors.text.message}</p>}
          </div>
        </div>
        <button type="submit" disabled={notificationIsSubmitted || !isDirty || !isValid} className="btn btn-primary">Submit</button>
      </form>
      <hr className="hr" />
      <h4>Notifications</h4>
      <div className="row mt-5">
        <div className="col-6">
            {
              notifications.map(notification => (
                <div className={"card mt-1"} style={{width: "18rem"}} key={notification.id}>
                  <div className={"card-body"}>
                    <h5 className={"card-title"}>{notification.text}</h5>
                    <button type="button" className="btn btn-danger" onClick={() => {handleDeleteNotification(notification.id)}}>Delete</button>
                  </div>
                </div>
              ))
            }
        </div>
      </div>
    </>
  )
}

export default ProfileComponent