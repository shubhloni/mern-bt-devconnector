import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
  const educations = education.map((edu) => {
    return (
      <tr key={edu._id}>
        <td>{edu.degree}</td>
        <td className='hide-sm'>{edu.school}</td>
        <td className='hide-sm'>
          <Moment format='YYYY/MM/DD'>{edu.from}</Moment> -
          {edu.to === null ? (
            ' Till date'
          ) : (
            <Moment format='YYYY/MM/DD'>{edu.to}</Moment>
          )}
        </td>
        <td>
          <button
            className='btn btn-danger'
            onClick={() => deleteEducation(edu._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  return (
    <React.Fragment>
      <h2 className='my-2'>Education Credentials</h2>
      {education ? (
        <table className='table'>
          <thead>
            <tr>
              <th>Degree</th>
              <th className='hide-sm'>School</th>
              <th className='hide-sm'>Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{educations}</tbody>
        </table>
      ) : (
        'No Education. Add one'
      )}
    </React.Fragment>
  );
};

Education.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
