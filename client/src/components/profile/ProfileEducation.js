import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
  education: { school, degree, fieldofstudy, to, from, description },
}) => {
  return (
    <div>
      <h3 className='text-dark'>
        {degree} {fieldofstudy && <span>in {fieldofstudy} </span>}
      </h3>
      <p>
        <Moment format='YYYY/MM/DD'>{from}</Moment> -
        {!to ? 'till date' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
      </p>
      <p>
        <strong>School: </strong>
        {school}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired,
};

export default ProfileEducation;
